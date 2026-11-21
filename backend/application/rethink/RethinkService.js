// Orchestrates the rethink pipeline (ADR12)
// Code decides the order of steps; Claude does the judgement inside each step.
//   classify -> interview -> sub-goals -> tasks (one call per sub-goal) -> refine
// Every step has a fixed output schema, every plan is checked by PlanChecker, and
// judgement problems get one automatic repair before the user sees anything.

const { classifySchema, interviewSchema, subgoalsSchema, tasksSchema } = require('./schemas.js');
const { systemPrompt, stagePrompts, repairPrompt } = require('./rethinkPrompts.js');
const { checkSubgoals, checkTasks, describeViolations } = require('./PlanChecker.js');
const { refineToolDefinitions, refineToolHandlers } = require('./refineTools.js');

// Replace Magic Number with Named Constant (Martin)
const maxInterviewQuestions = 4;
const repairAttempts = 1;

class RethinkService {
  // Dependency Injection (Fowler) - any ILLMProvider with structured() and runTools()
  constructor(provider, { today = () => new Date(), weeklyHourLimit = 8 } = {}) {
    this.provider = provider;
    this.today = today;
    this.weeklyHourLimit = weeklyHourLimit;
  }

  _messages(contextText, transcript, instruction) {
    return [
      { role: 'user', content: `THE USER'S PLANNER\n${contextText}` },
      ...transcript.map((turn) => ({ role: turn.role === 'assistant' ? 'assistant' : 'user', content: turn.content })),
      { role: 'user', content: instruction }
    ];
  }

  // Ask, check, and if the checker objects, ask once more with the problems listed
  async _structuredWithRepair({ tier, effort, messages, schema, check }) {
    let output = await this.provider.structured({ tier, effort, system: systemPrompt, messages, schema });
    let result = check(output);
    for (let attempt = 0; attempt < repairAttempts && result.violations.length; attempt += 1) {
      const retryMessages = [
        ...messages,
        { role: 'assistant', content: JSON.stringify(output) },
        { role: 'user', content: repairPrompt(describeViolations(result.violations)) }
      ];
      output = await this.provider.structured({ tier, effort, system: systemPrompt, messages: retryMessages, schema });
      result = check(output);
    }
    return { output, ...result };
  }

  async classify({ text, contextText }) {
    return this.provider.structured({
      tier: 'fast',
      effort: 'low',
      system: systemPrompt,
      messages: this._messages(contextText, [], `${stagePrompts.classify}\n\nMessage: ${text}`),
      schema: classifySchema
    });
  }

  // transcript: [{ role, content }] of the conversation so far, user's latest message last
  async interview({ transcript, contextText }) {
    const asked = transcript.filter((turn) => turn.role === 'assistant').length;
    const instruction = asked >= maxInterviewQuestions
      ? `${stagePrompts.interview}\nYou have asked enough questions: reply with kind "ready".`
      : stagePrompts.interview;
    return this.provider.structured({
      tier: 'planning',
      effort: 'medium',
      system: systemPrompt,
      messages: this._messages(contextText, transcript, instruction),
      schema: interviewSchema
    });
  }

  async proposeSubgoals({ transcript, contextText, draft, label, changeRequest }) {
    const instruction = changeRequest
      ? `${stagePrompts.subgoals}\nThe user wants this change to your last proposal: ${changeRequest}`
      : stagePrompts.subgoals;
    const { output, violations } = await this._structuredWithRepair({
      tier: 'planning',
      effort: 'high',
      messages: this._messages(contextText, transcript, instruction),
      schema: subgoalsSchema,
      check: (candidate) => checkSubgoals(candidate.items, { today: this.today() })
    });
    draft.setSubgoals(output.items);
    return { message: output.message, result: output.result, warnings: violations };
  }

  // One call per active sub-goal, in parallel - small outputs, nothing to cut off
  async planTasks({ transcript, contextText, draft, label, existingTaskNames = [] }) {
    draft.lockSubgoals();
    const active = draft.activeSubgoals();
    const others = (subgoal) => active.filter((item) => item.id !== subgoal.id).map((item) => `"${item.now}"`).join(', ') || 'none';

    const results = await Promise.all(active.map(async (subgoal) => {
      const instruction = `${stagePrompts.tasks}\nSub-goal: "${subgoal.now}" (why: ${subgoal.why})\nOther sub-goals: ${others(subgoal)}`;
      let fixedTasks = [];
      let fixes = [];
      const { output, violations } = await this._structuredWithRepair({
        tier: 'planning',
        effort: 'high',
        messages: this._messages(contextText, transcript, instruction),
        schema: tasksSchema,
        check: (candidate) => {
          const checked = checkTasks(candidate.tasks, { today: this.today(), existingTaskNames, weeklyHourLimit: this.weeklyHourLimit });
          fixedTasks = checked.tasks;
          fixes = checked.fixes;
          return checked;
        }
      });
      draft.setTasks(subgoal.id, fixedTasks);
      return { subgoalId: subgoal.id, message: output.message, fixes, warnings: violations };
    }));

    return { subgoals: results, warnings: results.flatMap((item) => item.warnings) };
  }

  async refine({ transcript, contextText, draft, label, request, existingTaskNames = [] }) {
    const planJson = () => JSON.stringify(draft.toJSON().subgoals.map(({ id, verdict, now, tasks }) => ({ id, verdict, now, tasks })));
    const ask = (ending) => this.provider.runTools({
      tier: 'planning',
      effort: 'high',
      system: systemPrompt,
      messages: this._messages(contextText, transcript, `${stagePrompts.refine}\nCurrent plan (with ids): ${planJson()}\n${ending}`),
      tools: refineToolDefinitions,
      handlers: refineToolHandlers(draft)
    });

    let reply = await ask(`Request: ${request}`);

    const problems = () => draft.activeSubgoals().flatMap((subgoal) => {
      const checked = checkTasks(subgoal.tasks, { today: this.today(), existingTaskNames, weeklyHourLimit: this.weeklyHourLimit });
      draft.setTasks(subgoal.id, checked.tasks);
      return checked.violations;
    });

    let warnings = problems();
    if (warnings.length) {
      // Fresh plan in the prompt, so the repair sees the edits already made
      reply = await ask(`Request: ${request}\nYou already made edits for this request. ${repairPrompt(describeViolations(warnings))}`);
      warnings = problems();
    }
    return { message: reply.text, warnings };
  }
}

module.exports = { RethinkService };

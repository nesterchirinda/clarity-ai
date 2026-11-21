// Runs every persona through the real pipeline and scores the plans (ADR12)
// Uses real Claude calls, so it needs ANTHROPIC_API_KEY and costs money.
//   npm run eval                 all personas
//   npm run eval -- health       personas whose id contains "health"
// Scores: code checks (PlanChecker + persona must/must-not mention) and a Claude judge
// for the rubric. Run it before and after changing prompts, and compare.

const fs = require('fs');
const path = require('path');
const { personas } = require('./personas.js');
const { RethinkService } = require('../application/rethink/RethinkService.js');
const { PlanDraft } = require('../application/rethink/PlanDraft.js');
const { buildPlannerContext } = require('../application/rethink/plannerContext.js');
const { checkSubgoals, checkTasks } = require('../application/rethink/PlanChecker.js');
const { AnthropicProvider } = require('../infrastructure/AnthropicProvider.js');

const judgeSchema = {
  type: 'object',
  properties: {
    score: { type: 'integer', enum: [1, 2, 3, 4, 5] },
    met: { type: 'array', items: { type: 'string' } },
    missed: { type: 'array', items: { type: 'string' } }
  },
  required: ['score', 'met', 'missed'],
  additionalProperties: false
};

function planText(draft) {
  return draft.toJSON().subgoals.map((subgoal) => [
    `[${subgoal.verdict}] ${subgoal.now} - ${subgoal.why}`,
    ...subgoal.tasks.map((task) => `   - ${task.name} (${task.repeat ? `repeat ${task.repeat.days.join('/')} ${task.repeat.from}..${task.repeat.until}` : task.due || 'no date'})${task.subtasks.length ? `: ${task.subtasks.join('; ')}` : ''}`)
  ].join('\n')).join('\n');
}

async function runPersona(persona, service, provider, today) {
  const contextText = buildPlannerContext({ ...persona.planner, today });
  const transcript = [{ role: 'assistant', content: `When you think of "${persona.planner.intention.name}", what does it mean to you between now and the end of the year?` }];
  const answers = [...persona.answers];
  transcript.push({ role: 'user', content: answers.shift() });

  for (let turn = 0; turn < 6; turn += 1) {
    const reply = await service.interview({ transcript, contextText });
    if (reply.kind === 'ready') break;
    transcript.push({ role: 'assistant', content: reply.message });
    transcript.push({ role: 'user', content: answers.shift() || "That's everything I can think of." });
  }

  const draft = new PlanDraft({ intention: persona.planner.intention });
  const proposal = await service.proposeSubgoals({ transcript, contextText, draft, label: 'eval' });
  const planned = await service.planTasks({ transcript, contextText, draft, label: 'eval-tasks', existingTaskNames: persona.planner.openTasks.map((task) => task.name) });

  const text = planText(draft);
  const codeProblems = [
    ...checkSubgoals(draft.toJSON().subgoals, { today }).violations.map((item) => item.message),
    ...draft.activeSubgoals().flatMap((subgoal) => checkTasks(subgoal.tasks, { today }).violations.map((item) => item.message)),
    ...persona.mustMention.filter((pattern) => !pattern.test(text)).map((pattern) => `Missing: ${pattern}`),
    ...persona.mustNotMention.filter((pattern) => pattern.test(text)).map((pattern) => `Should not include: ${pattern}`)
  ];

  const judged = await provider.structured({
    tier: 'planning',
    effort: 'high',
    system: 'You grade plans made by a planning coach. Be strict and specific.',
    messages: [{ role: 'user', content: `Situation:\n${transcript.map((turn) => `${turn.role}: ${turn.content}`).join('\n')}\n\nPlan:\n${text}\n\nRubric: ${persona.rubric}\n\nScore 1 (poor) to 5 (what an excellent mentor would plan). List rubric points met and missed.` }],
    schema: judgeSchema
  });

  return { id: persona.id, questions: transcript.filter((turn) => turn.role === 'assistant').length - 1, message: proposal.message, plan: text, codeProblems, warnings: [...proposal.warnings, ...planned.warnings].map((item) => item.message), judge: judged };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.error('Set ANTHROPIC_API_KEY to run the evals (they make real, billed Claude calls).');
    process.exit(1);
  }
  const filter = process.argv[2] || '';
  const today = new Date();
  const provider = new AnthropicProvider();
  const service = new RethinkService(provider, { today: () => today });
  const results = [];

  for (const persona of personas.filter((item) => item.id.includes(filter))) {
    process.stdout.write(`${persona.id} ... `);
    try {
      const result = await runPersona(persona, service, provider, today);
      results.push(result);
      console.log(`judge ${result.judge.score}/5, ${result.codeProblems.length} code problems`);
    } catch (error) {
      results.push({ id: persona.id, error: error.message });
      console.log(`failed: ${error.message}`);
    }
  }

  const scored = results.filter((item) => item.judge);
  const average = scored.length ? scored.reduce((sum, item) => sum + item.judge.score, 0) / scored.length : 0;
  const clean = scored.filter((item) => item.codeProblems.length === 0).length;
  console.log(`\nAverage judge score ${average.toFixed(2)}/5; ${clean}/${scored.length} plans pass every code check.`);

  const outDir = path.join(__dirname, 'results');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${today.toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ at: today.toISOString(), average, results }, null, 2));
  console.log(`Full results: ${outFile}`);
}

if (require.main === module) main();

module.exports = { runPersona, planText };

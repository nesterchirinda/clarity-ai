// Unit tests for RethinkService and AnthropicProvider (ADR12, ADR13)
// The model is faked: tests check the orchestration, not the model's answers

const { RethinkService } = require('../application/rethink/RethinkService.js');
const { PlanDraft } = require('../application/rethink/PlanDraft.js');
const { AnthropicProvider, LLMError } = require('../infrastructure/AnthropicProvider.js');

const today = () => new Date(Date.UTC(2026, 10, 21));

// Fake provider: answers come from queues, every request is recorded
function fakeProvider({ structured = [], tools = [] } = {}) {
  const calls = [];
  return {
    calls,
    structured: jest.fn(async (request) => { calls.push(request); return structured.shift(); }),
    runTools: jest.fn(async (request) => { calls.push(request); const step = tools.shift(); return step(request); })
  };
}

const goodSubgoals = {
  message: "Here's what I think you can achieve by 31 December, and what has to wait until next year.",
  items: [
    { verdict: 'New', was: '', now: 'See the GP by 5 December', why: 'Overdue.' },
    { verdict: 'New', was: '', now: 'Train 3 times a week until 31 December (ongoing)', why: 'Start small.' },
    { verdict: 'Next year', was: '', now: 'Build muscle definition', why: 'Takes months.' }
  ],
  result: '2 new and 1 carried'
};

const tasksFor = (name) => ({
  message: 'Tasks.',
  tasks: [{ name, due: '2026-11-25', repeat: null, template: '', existing: false, hours: 0.5, subtasks: ['Do it'] }]
});


describe('RethinkService', () => {
  test('should repair sub-goals once when the checker finds a problem', async () => {
    // ARRANGE
    const bad = { ...goodSubgoals, items: [...goodSubgoals.items, { verdict: 'New', was: '', now: 'Get an offer by 31 December', why: 'x' }] };
    const provider = fakeProvider({ structured: [bad, goodSubgoals] });
    const service = new RethinkService(provider, { today });
    const draft = new PlanDraft();

    // ACT
    const result = await service.proposeSubgoals({ transcript: [], contextText: 'ctx', draft, label: 'u1' });

    // ASSERT
    expect(provider.structured).toHaveBeenCalledTimes(2);
    expect(provider.calls[1].messages.at(-1).content).toContain("depends on other people's decisions");
    expect(result.warnings).toEqual([]);
    expect(draft.activeSubgoals()).toHaveLength(2);
  });

  test('should return warnings instead of looping when the repair still breaks a rule', async () => {
    const bad = { ...goodSubgoals, items: [{ verdict: 'New', was: '', now: 'Land a job by 31 December', why: 'x' }] };
    const provider = fakeProvider({ structured: [bad, bad] });
    const service = new RethinkService(provider, { today });

    const result = await service.proposeSubgoals({ transcript: [], contextText: 'ctx', draft: new PlanDraft(), label: 'u1' });

    expect(provider.structured).toHaveBeenCalledTimes(2);
    expect(result.warnings.map((item) => item.rule)).toContain('in-control');
  });

  test('should plan tasks with one call per active sub-goal and lock the sub-goals', async () => {
    const provider = fakeProvider({ structured: [goodSubgoals, tasksFor('Call the surgery'), tasksFor('Book a gym induction')] });
    const service = new RethinkService(provider, { today });
    const draft = new PlanDraft();
    await service.proposeSubgoals({ transcript: [], contextText: 'ctx', draft, label: 'u1' });

    await service.planTasks({ transcript: [], contextText: 'ctx', draft, label: 'approve2' });

    expect(provider.structured).toHaveBeenCalledTimes(3);
    expect(draft.toJSON().locked).toBe(true);
    expect(draft.activeSubgoals().map((subgoal) => subgoal.tasks.length)).toEqual([1, 1]);
  });

  test('refine should change the plan through tools and keep every sub-goal', async () => {
    const provider = fakeProvider({
      structured: [goodSubgoals, tasksFor('Call the surgery'), tasksFor('Book a gym induction')],
      tools: [(request) => {
        const taskId = JSON.parse(request.messages.at(-1).content.match(/Current plan \(with ids\): (.*)\n/)[1])[0].tasks[0].id;
        request.handlers.replace_task({ task_id: taskId, task: { name: 'Call the surgery at 8am', due: '2026-11-24', repeat: null, template: '', existing: false, hours: 0.5, subtasks: [] } });
        expect(() => request.handlers.remove_task({ task_id: 'nope' })).toThrow();
        return { text: 'Moved the call to Tuesday.' };
      }]
    });
    const service = new RethinkService(provider, { today });
    const draft = new PlanDraft();
    await service.proposeSubgoals({ transcript: [], contextText: 'ctx', draft, label: 'u1' });
    await service.planTasks({ transcript: [], contextText: 'ctx', draft, label: 'approve2' });

    const result = await service.refine({ transcript: [], contextText: 'ctx', draft, label: 'u3', request: 'Call on Tuesday' });

    expect(result.message).toBe('Moved the call to Tuesday.');
    expect(draft.activeSubgoals()[0].tasks[0].name).toBe('Call the surgery at 8am');
    expect(draft.activeSubgoals()).toHaveLength(2);
  });

  test('interview should insist on finishing after 4 questions', async () => {
    const provider = fakeProvider({ structured: [{ kind: 'ready', message: 'Thanks.', options: [], facts: [] }] });
    const service = new RethinkService(provider, { today });
    const transcript = [1, 2, 3, 4].flatMap((n) => [{ role: 'assistant', content: `Q${n}` }, { role: 'user', content: `A${n}` }]);

    await service.interview({ transcript, contextText: 'ctx' });

    expect(provider.calls[0].messages.at(-1).content).toContain('You have asked enough questions');
    expect(provider.calls[0].tier).toBe('planning');
  });
});


describe('AnthropicProvider', () => {
  function fakeClient(messages) {
    const sent = [];
    return {
      sent,
      beta: { messages: { stream: (params) => { sent.push(JSON.parse(JSON.stringify(params))); return { finalMessage: async () => messages.shift() }; } } }
    };
  }

  test('structured should send a JSON schema, cache the system prompt and use the fallback on Opus', async () => {
    const client = fakeClient([{ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"ok":true}' }] }]);
    const provider = new AnthropicProvider({ client });

    const result = await provider.structured({ tier: 'planning', system: 'rules', messages: [{ role: 'user', content: 'hi' }], schema: { type: 'object' } });

    expect(result).toEqual({ ok: true });
    const params = client.sent[0];
    expect(params.model).toBe('claude-opus-5-5');
    expect(params.output_config).toEqual({ effort: 'high', format: { type: 'json_schema', schema: { type: 'object' } } });
    expect(params.system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(params.fallbacks).toBe('default');
    expect(params.max_tokens).toBeGreaterThanOrEqual(32000);
  });

  test('the fast tier should use Haiku at low effort with no fallback', async () => {
    const client = fakeClient([{ stop_reason: 'end_turn', content: [{ type: 'text', text: '{}' }] }]);

    await new AnthropicProvider({ client }).structured({ tier: 'fast', system: 's', messages: [], schema: {} });

    expect(client.sent[0].model).toBe('claude-haiku-5-5');
    expect(client.sent[0].output_config.effort).toBe('low');
    expect(client.sent[0].fallbacks).toBeUndefined();
  });

  test('should raise clear errors for refusals and cut-off answers', async () => {
    const refused = new AnthropicProvider({ client: fakeClient([{ stop_reason: 'refusal', content: [] }]) });
    const cutOff = new AnthropicProvider({ client: fakeClient([{ stop_reason: 'max_tokens', content: [] }]) });

    await expect(refused.structured({ system: '', messages: [], schema: {} })).rejects.toMatchObject({ code: 'refusal' });
    await expect(cutOff.structured({ system: '', messages: [], schema: {} })).rejects.toBeInstanceOf(LLMError);
  });

  test('runTools should run every tool call, report errors to the model and append turns unchanged', async () => {
    const toolTurn = { stop_reason: 'tool_use', content: [
      { type: 'tool_use', id: 't1', name: 'add_task', input: { x: 1 } },
      { type: 'tool_use', id: 't2', name: 'broken', input: {} }
    ] };
    const client = fakeClient([toolTurn, { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Done.' }] }]);
    const provider = new AnthropicProvider({ client });
    const handlers = { add_task: jest.fn(() => 'Added.'), broken: () => { throw new Error('No such task'); } };

    const result = await provider.runTools({ system: 's', messages: [{ role: 'user', content: 'go' }], tools: [], handlers });

    expect(result.text).toBe('Done.');
    expect(handlers.add_task).toHaveBeenCalledWith({ x: 1 });
    const second = client.sent[1].messages;
    expect(second[1]).toEqual({ role: 'assistant', content: toolTurn.content });
    expect(second[2].content).toEqual([
      { type: 'tool_result', tool_use_id: 't1', content: 'Added.' },
      { type: 'tool_result', tool_use_id: 't2', content: 'No such task', is_error: true }
    ]);
    expect(client.sent[0].tool_choice).toEqual({ type: 'auto' });
  });
});


describe('eval runner', () => {
  test('should run a persona end to end with a fake model and report code problems', async () => {
    const { runPersona } = require('../evals/run-evals.js');
    const { personas } = require('../evals/personas.js');
    const persona = personas.find((item) => item.id === 'career-failed-probation');
    const structured = [
      { kind: 'question', message: 'Which roles?', options: [], facts: [] },
      { kind: 'ready', message: 'Thanks.', options: [], facts: [] },
      { message: 'Plan.', result: 'x', items: [
        { verdict: 'Close', was: 'Pass graduate probation', now: 'Close probation as not passed', why: 'It ended.' },
        { verdict: 'New', was: '', now: 'Choose a direction by 5 December', why: 'Reflect first.' }
      ] },
      { message: 'Tasks.', tasks: [{ name: 'Write what went well and what did not', due: '2026-11-28', repeat: null, template: '', existing: false, hours: 1, subtasks: ['List 3 wins'] }] },
      { score: 3, met: ['reflection first'], missed: ['skills'] }
    ];
    const provider = { structured: jest.fn(async () => structured.shift()), runTools: jest.fn() };
    const service = new RethinkService(provider, { today });

    const result = await runPersona(persona, service, provider, today());

    expect(result.judge.score).toBe(3);
    expect(result.questions).toBe(1);
    expect(result.codeProblems.join(' ')).toMatch(/Missing/);
  });
});

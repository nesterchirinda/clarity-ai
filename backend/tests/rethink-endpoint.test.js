// Unit tests for the rethink endpoint and the Notion planner reader (ADR12)
// Arrange, Act, Assert - Supabase, Notion and the model are all faked

process.env.JWT_SECRET = 'test-only-key-do-not-use-in-prod';

const { createHandler } = require('../rethink.js');
const { NotionPlannerReader } = require('../infrastructure/NotionPlannerReader.js');
const { sign, SESSION_COOKIE_NAME } = require('../infrastructure/sessionToken.js');

const token = sign('a@b.com');
const now = () => new Date(Date.UTC(2026, 10, 21));

function makeEvent(body, { authenticated = true } = {}) {
  return { httpMethod: 'POST', headers: authenticated ? { cookie: `${SESSION_COOKIE_NAME}=${token}` } : {}, body: JSON.stringify(body) };
}

function fakeRepository() {
  const sessions = new Map();
  return {
    sessions,
    findOrCreateUserByEmail: jest.fn(async () => ({ id: 'user-1' })),
    findNotionConnection: jest.fn(async () => ({ accessToken: 'secret' })),
    findNotionDatabaseRefs: jest.fn(async () => ({ goal_data_source_id: 'g', milestone_data_source_id: 'm', task_data_source_id: 't', subtask_data_source_id: 's' })),
    findRethinkSession: jest.fn(async (id) => sessions.get(id) || null),
    saveRethinkSession: jest.fn(async (userId, id, session) => {
      const row = { user_id: userId, session_id: id, intention_id: session.intentionId, stage: session.stage, transcript: session.transcript, draft: session.draft };
      sessions.set(id, JSON.parse(JSON.stringify(row)));
      return row;
    })
  };
}

const planner = {
  intention: { id: 'i1', name: "I'm strong, healthy and I love my body" },
  intentions: [{ id: 'i1', name: "I'm strong, healthy and I love my body" }],
  subgoals: [],
  openTasks: [],
  routines: [],
  existingTaskNames: []
};

function setup(serviceOverrides = {}) {
  const repository = fakeRepository();
  const service = {
    interview: jest.fn(async () => ({ kind: 'question', message: 'What gets in the way?', options: ['Time', 'Motivation'], facts: [] })),
    proposeSubgoals: jest.fn(async ({ draft }) => {
      draft.setSubgoals([{ verdict: 'New', was: '', now: 'See the GP by 5 December', why: 'Overdue.' }]);
      return { message: 'Here is the plan.', result: '1 new', warnings: [] };
    }),
    planTasks: jest.fn(async ({ draft }) => {
      draft.lockSubgoals();
      draft.setTasks(draft.activeSubgoals()[0].id, [{ name: 'Walk 20 minutes', due: null, repeat: { days: ['Tue'], from: '2026-11-24', until: '2026-12-31', skip: [] }, template: '', existing: false, hours: 0.5, subtasks: [] }]);
      return { warnings: [] };
    }),
    refine: jest.fn(async () => ({ message: 'Changed.', warnings: [{ message: 'A warning' }] })),
    ...serviceOverrides
  };
  const handler = createHandler({ makeRepository: () => repository, makeReader: () => ({ loadForIntention: async () => planner, listIntentions: async () => planner.intentions }), makeService: () => service, now });
  const send = async (body) => { const response = await handler(makeEvent(body)); return { status: response.statusCode, body: JSON.parse(response.body) }; };
  return { repository, service, handler, send };
}


test('should return 401 without a session cookie', async () => {
  const { handler } = setup();

  const response = await handler(makeEvent({ action: 'start', sessionId: 's1', intentionId: 'i1' }, { authenticated: false }));

  expect(response.statusCode).toBe(401);
});

test('should list intentions without a session id', async () => {
  const { send } = setup();

  const listed = await send({ action: 'intentions' });

  expect(listed.status).toBe(200);
  expect(listed.body.intentions).toEqual(planner.intentions);
});

test('should return 400 for an unknown action', async () => {
  const { send } = setup();

  expect((await send({ action: 'delete', sessionId: 's1' })).status).toBe(400);
});

test('should run a whole conversation: start, answer, ready, approve, refine', async () => {
  // ARRANGE
  const { send, service } = setup();

  // ACT + ASSERT, one step at a time
  const started = await send({ action: 'start', sessionId: 's1', intentionId: 'i1' });
  expect(started.body.reply).toContain("I'm strong, healthy and I love my body");
  expect(started.body.stage).toBe('interview');

  const asked = await send({ action: 'message', sessionId: 's1', text: 'Feeling strong' });
  expect(asked.body.options).toEqual(['Time', 'Motivation']);

  service.interview.mockResolvedValueOnce({ kind: 'ready', message: 'Got it.', options: [], facts: ['Motivation dips'] });
  const proposed = await send({ action: 'message', sessionId: 's1', text: 'Motivation' });
  expect(proposed.body.stage).toBe('review');
  expect(proposed.body.subgoals[0].now).toBe('See the GP by 5 December');

  const planned = await send({ action: 'approve', sessionId: 's1' });
  expect(planned.body.stage).toBe('tasks');
  expect(planned.body.subgoals[0].tasks[0].dates).toEqual(['2026-11-24', '2026-12-01', '2026-12-08', '2026-12-15', '2026-12-22', '2026-12-29']);

  const refined = await send({ action: 'message', sessionId: 's1', text: 'Move the walk to Wednesday' });
  expect(service.refine).toHaveBeenCalled();
  expect(refined.body.warnings).toEqual(['A warning']);
});

test('typing during review should change the sub-goals, not start a new request', async () => {
  const { send, service } = setup();
  await send({ action: 'start', sessionId: 's2', intentionId: 'i1' });
  service.interview.mockResolvedValueOnce({ kind: 'ready', message: 'Got it.', options: [], facts: [] });
  await send({ action: 'message', sessionId: 's2', text: 'Feeling strong' });

  await send({ action: 'message', sessionId: 's2', text: 'Nothing I cannot control' });

  expect(service.proposeSubgoals).toHaveBeenCalledTimes(2);
  expect(service.proposeSubgoals.mock.calls[1][0].changeRequest).toBe('Nothing I cannot control');
});

test('back should restore the stage, transcript and draft from before a message', async () => {
  const { send, service } = setup();
  await send({ action: 'start', sessionId: 's3', intentionId: 'i1' });
  service.interview.mockResolvedValueOnce({ kind: 'ready', message: 'Got it.', options: [], facts: [] });
  const proposed = await send({ action: 'message', sessionId: 's3', text: 'Feeling strong' });
  const userMessage = proposed.body.transcript.find((turn) => turn.role === 'user');

  const back = await send({ action: 'back', sessionId: 's3', messageId: userMessage.id });

  expect(back.body.stage).toBe('interview');
  expect(back.body.transcript).toHaveLength(1);
  expect(back.body.subgoals).toEqual([]);
});

test('should return 502 with the model\'s error code when Claude fails', async () => {
  const { LLMError } = require('../infrastructure/AnthropicProvider.js');
  const { send } = setup({ interview: jest.fn(async () => { throw new LLMError('max_tokens', 'Cut off.'); }) });
  await send({ action: 'start', sessionId: 's4', intentionId: 'i1' });

  const failed = await send({ action: 'message', sessionId: 's4', text: 'Hi' });

  expect(failed.status).toBe(502);
  expect(failed.body.code).toBe('max_tokens');
});


describe('NotionPlannerReader', () => {
  const page = (id, name, properties = {}, created = '2026-11-20T10:00:00.000Z') => ({
    id,
    created_time: created,
    properties: { Name: { type: 'title', title: [{ plain_text: name }] }, ...properties }
  });
  const relation = (ids) => ({ type: 'relation', relation: ids.map((id) => ({ id })) });

  test('should load only this intention\'s sub-goals and their open tasks, and detect routines', async () => {
    const notion = {
      queryDataSource: jest.fn(async (id) => ({
        g: [page('i1', "I'm strong"), page('i2', "I'm calm")],
        m: [page('sg1', 'See the GP', { Goal: relation(['i1']) }), page('sg2', 'Meditate', { Goal: relation(['i2']) })],
        t: [
          page('t1', 'Book GP', { Milestone: relation(['sg1']), Done: { type: 'checkbox', checkbox: false } }),
          page('t2', 'Meditate 10 minutes', { Milestone: relation(['sg2']), Done: { type: 'checkbox', checkbox: false } }),
          page('t3', 'Weekly reset', {}, '2026-11-16T10:00:00.000Z'),
          page('t4', 'Weekly reset', {}, '2026-11-09T10:00:00.000Z'),
          page('t5', 'Weekly reset', {}, '2026-11-02T10:00:00.000Z')
        ]
      })[id])
    };
    const reader = new NotionPlannerReader(notion, { goalDataSourceId: 'g', milestoneDataSourceId: 'm', taskDataSourceId: 't' });

    const loaded = await reader.loadForIntention('i1', { today: now() });

    expect(loaded.intention.name).toBe("I'm strong");
    expect(loaded.subgoals.map((item) => item.name)).toEqual(['See the GP']);
    expect(loaded.openTasks.map((item) => item.name)).toEqual(['Book GP']);
    expect(loaded.routines).toEqual(['Weekly reset']);
  });
});

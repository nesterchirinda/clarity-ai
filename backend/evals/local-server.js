// Local server for trying the Clarity page against the real rethink endpoint (ADR12)
//   node backend/evals/local-server.js            fake Claude, fake Notion, no keys needed
//   USE_CLAUDE=1 node backend/evals/local-server.js  real Claude (needs ANTHROPIC_API_KEY)
// Serves frontend/ with the same Content-Security-Policy as netlify.toml, and runs
// backend/rethink.js with the real RethinkService. Supabase and Notion are replaced by
// in-memory fakes holding a sample planner. Open http://localhost:8899/clarity.html

process.env.JWT_SECRET = process.env.JWT_SECRET || 'local-only-secret';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createHandler } = require('../rethink.js');
const { RethinkService } = require('../application/rethink/RethinkService.js');
const { AnthropicProvider } = require('../infrastructure/AnthropicProvider.js');
const { interviewSchema, subgoalsSchema, tasksSchema } = require('../application/rethink/schemas.js');
const { sign, SESSION_COOKIE_NAME } = require('../infrastructure/sessionToken.js');

const port = Number(process.env.PORT || 8899);
const frontend = path.join(__dirname, '..', '..', 'frontend');
const csp = fs.readFileSync(path.join(__dirname, '..', '..', 'netlify.toml'), 'utf8').match(/Content-Security-Policy = "([^"]+)"/)[1];

const intentions = [
  { id: 'i-career', name: "I'm a trusted, confident professional" },
  { id: 'i-health', name: "I'm strong, healthy and I love my body" }
];

// Stand-in for Claude: answers in the shape each stage asks for
function fakeProvider() {
  return {
    async structured(request) {
      if (request.schema === interviewSchema) {
        // One question per conversation: the opening question is the first assistant turn
        const assistantTurns = request.messages.filter((message) => message.role === 'assistant').length;
        return assistantTurns < 2
          ? { kind: 'question', message: 'That helps. What usually gets in the way?', options: ['Time', 'Motivation dips', 'Not sure where to start'], facts: [] }
          : { kind: 'ready', message: 'Thanks, I have enough.', options: [], facts: ['Motivation dips'] };
      }
      if (request.schema === subgoalsSchema) {
        const changed = /change to your last proposal/i.test(request.messages.at(-1).content);
        return {
          message: changed ? 'Updated: nothing depends on other people now. Here\'s what I think you can achieve by 31 December, and what has to wait until next year.' : 'By the end of the year this is about feeling stronger, starting small. Here\'s what I think you can achieve by 31 December, and what has to wait until next year.',
          items: [
            { verdict: 'New', was: '', now: 'See the GP by 5 December', why: 'It has been overdue since 12 November.' },
            { verdict: 'New', was: '', now: 'Train 3 times a week until 31 December (ongoing)', why: 'Start at a level you can keep on a bad week.' },
            { verdict: 'Next year', was: '', now: 'Build visible muscle definition', why: 'That takes months of steady training.' }
          ],
          result: '2 new and 1 carried to next year'
        };
      }
      if (request.schema === tasksSchema) {
        const named = (request.messages.at(-1).content.match(/Sub-goal: "([^"]+)"/) || [])[1] || '';
        const gp = /See the GP/.test(named);
        return gp
          ? { message: 'Tasks.', tasks: [{ name: 'Call the surgery to book', due: '2026-11-25', repeat: null, template: '', existing: false, hours: 0.5, subtasks: ['Call at 8am', 'Write down the date'] }] }
          : { message: 'Tasks.', tasks: [
            { name: 'Lower body day', due: null, repeat: { days: ['Mon'], from: '2026-11-23', until: '2026-12-31', skip: [] }, template: 'Lower body day', existing: false, hours: 0.75, subtasks: [] },
            { name: 'Walk for 30 minutes', due: null, repeat: { days: ['Thu'], from: '2026-11-26', until: '2026-12-31', skip: ['2026-12-24'] }, template: '', existing: false, hours: 0.5, subtasks: ['Put on trainers', 'Walk a 30-minute loop'] },
            { name: 'Write 3 things to do when training feels hard', due: '2026-11-24', repeat: null, template: '', existing: false, hours: 0.25, subtasks: ['List them', 'Stick the list on the fridge'] }
          ] };
      }
      throw new Error('fake provider: unknown schema');
    },
    async runTools(request) {
      const plan = JSON.parse(request.messages.at(-1).content.match(/Current plan \(with ids\): (.*)\n/)[1]);
      const walk = plan.flatMap((subgoal) => subgoal.tasks).find((task) => /Walk/.test(task.name));
      if (walk) {
        const { id, ...task } = walk;
        request.handlers.replace_task({ task_id: id, task: { ...task, repeat: { ...task.repeat, days: ['Wed'] } } });
      }
      return { text: 'I moved the walk to Wednesdays.' };
    }
  };
}

function fakeRepository(store) {
  return {
    findOrCreateUserByEmail: async () => ({ id: 'local-user' }),
    findNotionConnection: async () => ({ accessToken: 'local' }),
    findNotionDatabaseRefs: async () => ({ goal_data_source_id: 'g', milestone_data_source_id: 'm', task_data_source_id: 't', subtask_data_source_id: 's' }),
    findRethinkSession: async (id) => store.get(id) || null,
    saveRethinkSession: async (userId, id, session) => {
      const row = { user_id: userId, session_id: id, intention_id: session.intentionId, stage: session.stage, transcript: session.transcript, draft: session.draft };
      store.set(id, JSON.parse(JSON.stringify(row)));
      return row;
    }
  };
}

const store = new Map();
const reader = {
  listIntentions: async () => intentions,
  loadForIntention: async (id) => ({
    intention: intentions.find((item) => item.id === id) || null,
    intentions,
    subgoals: [],
    openTasks: [{ name: 'GP Appointment', due: '2026-11-12' }],
    routines: ['Reflect & Plan next week', 'Lower body day'],
    existingTaskNames: ['GP Appointment']
  })
};
const provider = process.env.USE_CLAUDE ? new AnthropicProvider() : fakeProvider();
const handler = createHandler({
  makeRepository: () => fakeRepository(store),
  makeReader: () => reader,
  makeService: () => new RethinkService(provider),
  now: () => new Date(process.env.TODAY || Date.now())
});

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };

http.createServer(async (req, res) => {
  if (req.url.startsWith('/.netlify/functions/rethink')) {
    let body = '';
    for await (const chunk of req) body += chunk;
    const result = await handler({ httpMethod: req.method, headers: req.headers, body });
    res.writeHead(result.statusCode, result.headers || { 'Content-Type': 'application/json' });
    return res.end(result.body);
  }
  const file = path.join(frontend, path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^([/\\])+/, ''));
  if (!file.startsWith(frontend) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Security-Policy': csp };
  // Signed-in session for local testing only
  if (file.endsWith('.html')) headers['Set-Cookie'] = `${SESSION_COOKIE_NAME}=${sign('local@example.com')}; HttpOnly; SameSite=Lax; Path=/`;
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Clarity local server: http://localhost:${port}/clarity.html (${process.env.USE_CLAUDE ? 'real Claude' : 'fake Claude'})`));

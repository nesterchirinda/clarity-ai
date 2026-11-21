// Rethink the sub-goals and tasks under one intention, through conversation (ADR12)
//
// POST { action, sessionId, ... }
//   intentions {}             - the user's intentions from Notion (no sessionId needed)
//   start   { intentionId }   - opens the conversation with a fixed first question
//   message { text }          - an answer, a change to the sub-goals, or a refine,
//                               depending on the stage the session is in
//   approve {}                - agree the sub-goals and plan their tasks
//   back    { messageId }     - go back to before a message the user sent
//
// The draft plan lives in Supabase and is the source of truth. A version is saved
// before every user message, so `back` can always restore it. Every reply returns
// a view of it with repeating tasks already expanded into dates.

const { DatabaseRepository, hasAllDatabaseRefs } = require('./infrastructure/DatabaseRepository.js');
const { NotionAdapter } = require('./infrastructure/NotionAdapter.js');
const { NotionPlannerReader } = require('./infrastructure/NotionPlannerReader.js');
const { AnthropicProvider, LLMError } = require('./infrastructure/AnthropicProvider.js');
const { RethinkService } = require('./application/rethink/RethinkService.js');
const { PlanDraft, DraftError } = require('./application/rethink/PlanDraft.js');
const { buildPlannerContext } = require('./application/rethink/plannerContext.js');
const { expandRepeat } = require('./application/rethink/repeatDates.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { sanitizeUserText } = require('./infrastructure/sanitizeInput.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

function draftView(draft, today) {
  return draft.toJSON().subgoals.map((subgoal) => ({
    ...subgoal,
    tasks: subgoal.tasks.map((task) => ({ ...task, dates: task.repeat ? expandRepeat(task.repeat, { today }) : task.due ? [task.due] : [] }))
  }));
}

function openingQuestion(intentionName) {
  return `Let's start with the intention, not the sub-goals. When you think of "${intentionName}", what does it mean to you between now and the end of the year?`;
}

// Factory so tests can pass fakes; the exported handler uses the real adapters
function createHandler(deps = {}) {
  const makeRepository = deps.makeRepository || (() => new DatabaseRepository());
  const makeReader = deps.makeReader || ((connection, refs) => new NotionPlannerReader(new NotionAdapter(connection.accessToken), {
    goalDataSourceId: refs.goal_data_source_id,
    milestoneDataSourceId: refs.milestone_data_source_id,
    taskDataSourceId: refs.task_data_source_id
  }));
  const makeService = deps.makeService || (() => new RethinkService(new AnthropicProvider()));
  const now = deps.now || (() => new Date());

  return async (event) => {
    const preflight = handlePreflight(event);
    if (preflight) return preflight;
    const methodError = requirePost(event);
    if (methodError) return methodError;

    try {
      // Verified identity from the OAuth login, not the client-supplied email (NFR05)
      const email = verify(readCookie(event, SESSION_COOKIE_NAME));
      if (!email) return jsonResponse(401, { error: 'Not signed in. Please reconnect Notion.', requiresConnection: true });

      const body = JSON.parse(event.body || '{}');
      const { action, sessionId } = body;
      if (!['intentions', 'start', 'message', 'approve', 'back'].includes(action) || (action !== 'intentions' && !sessionId)) {
        return jsonResponse(400, { error: 'sessionId and a valid action are required' });
      }

      const repository = makeRepository();
      const user = await repository.findOrCreateUserByEmail(email);
      const connection = await repository.findNotionConnection(user.id);
      const refs = await repository.findNotionDatabaseRefs(user.id);
      if (!connection || !hasAllDatabaseRefs(refs)) {
        return jsonResponse(401, { error: 'Connect your Notion planner first.', requiresConnection: true });
      }

      const today = now();
      const reader = makeReader(connection, refs);
      if (action === 'intentions') {
        return jsonResponse(200, { intentions: await reader.listIntentions() });
      }
      const service = makeService();

      let session = await repository.findRethinkSession(sessionId);
      if (action === 'start') {
        if (!body.intentionId) return jsonResponse(400, { error: 'intentionId is required' });
        session = { intentionId: body.intentionId, stage: 'interview', transcript: [], draft: {} };
      } else if (!session) {
        return jsonResponse(404, { error: 'That conversation has ended. Start again.' });
      } else {
        session = { intentionId: session.intention_id, stage: session.stage, transcript: session.transcript || [], draft: session.draft || {} };
      }

      const planner = await reader.loadForIntention(session.intentionId, { today });
      if (!planner.intention) return jsonResponse(404, { error: 'That intention is not in your planner.' });
      const contextText = buildPlannerContext({ ...planner, today });
      const draft = PlanDraft.fromJSON(session.draft);
      const transcript = session.transcript;
      const say = (content, extra = {}) => transcript.push({ id: `a${transcript.length}`, role: 'assistant', content, ...extra });
      let reply;
      let options = [];
      let warnings = [];

      if (action === 'start') {
        reply = openingQuestion(planner.intention.name);
        say(reply);
      } else if (action === 'back') {
        const index = transcript.findIndex((turn) => turn.id === body.messageId && turn.role === 'user');
        if (index === -1) return jsonResponse(400, { error: 'That message is not in this conversation.' });
        const turn = transcript[index];
        try { draft.restore(turn.id); } catch (error) { if (!(error instanceof DraftError)) throw error; }
        session.stage = turn.stageBefore;
        session.transcript = transcript.slice(0, index);
        reply = null;
      } else if (action === 'approve') {
        if (session.stage !== 'review') return jsonResponse(400, { error: 'There are no sub-goals waiting to be agreed.' });
        const label = `approve${transcript.length}`;
        transcript.push({ id: label, role: 'user', content: 'I agree with these sub-goals. Plan the tasks.', stageBefore: 'review' });
        draft.checkpoint(label);
        const planned = await service.planTasks({ transcript, contextText, draft, label, existingTaskNames: planner.existingTaskNames });
        warnings = planned.warnings;
        reply = 'Here are the tasks for each sub-goal.';
        say(reply);
        session.stage = 'tasks';
      } else {
        const text = sanitizeUserText(String(body.text || '')).trim();
        if (!text) return jsonResponse(400, { error: 'Type a message first.' });
        const label = `u${transcript.length}`;
        transcript.push({ id: label, role: 'user', content: text, stageBefore: session.stage });
        draft.checkpoint(label);

        if (session.stage === 'interview') {
          const answer = await service.interview({ transcript, contextText });
          if (answer.kind === 'question') {
            reply = answer.message;
            options = answer.options;
            say(reply);
          } else {
            const proposal = await service.proposeSubgoals({ transcript, contextText, draft, label });
            reply = proposal.message;
            warnings = proposal.warnings;
            say(reply, { facts: answer.facts });
            session.stage = 'review';
          }
        } else if (session.stage === 'review') {
          const proposal = await service.proposeSubgoals({ transcript, contextText, draft, label, changeRequest: text });
          reply = proposal.message;
          warnings = proposal.warnings;
          say(reply);
        } else {
          const refined = await service.refine({ transcript, contextText, draft, label, request: text, existingTaskNames: planner.existingTaskNames });
          reply = refined.message;
          warnings = refined.warnings;
          say(reply);
        }
      }

      const saved = { intentionId: session.intentionId, stage: session.stage, transcript: session.transcript || transcript, draft: draft.toJSON() };
      await repository.saveRethinkSession(user.id, sessionId, saved);

      return jsonResponse(200, {
        stage: saved.stage,
        reply,
        options,
        warnings: warnings.map((warning) => warning.message),
        transcript: saved.transcript.map(({ id, role, content }) => ({ id, role, content })),
        subgoals: draftView(draft, today)
      });
    } catch (error) {
      if (error instanceof LLMError) {
        console.error('[rethink] model error:', error.code, error.message);
        return jsonResponse(502, { error: error.message, code: error.code });
      }
      if (error instanceof DraftError) return jsonResponse(400, { error: error.message });
      console.error('[rethink] failed:', error.message);
      return jsonResponse(500, { error: 'Something went wrong. Try again.' });
    }
  };
}

exports.createHandler = createHandler;
exports.handler = createHandler();

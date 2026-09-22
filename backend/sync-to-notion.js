// Writes the approved plan to Notion with its relations preserved (FR09, FR10)

const { DatabaseRepository, hasAllDatabaseRefs } = require('./infrastructure/DatabaseRepository.js');
const { NotionAdapter } = require('./infrastructure/NotionAdapter.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

exports.handler = async (event) => {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;
  const methodError = requirePost(event);
  if (methodError) return methodError;

  const repository = new DatabaseRepository();
  try {
    const { sessionId, hierarchy } = JSON.parse(event.body || '{}');
    // Verified identity from the OAuth login, not the client-supplied email (NFR05)
    const email = verify(readCookie(event, SESSION_COOKIE_NAME));
    if (!email) {
      return jsonResponse(401, {
        error: 'Not signed in. Please reconnect Notion.',
        requiresConnection: true
      });
    }
    if (!hierarchy || !hierarchy.goal || !Array.isArray(hierarchy.milestones)) {
      return jsonResponse(400, { error: 'A full hierarchy is required' });
    }

    const user = await repository.findOrCreateUserByEmail(email);
    const connection = await repository.findNotionConnection(user.id);
    if (!connection) {
      return jsonResponse(401, {
        error: 'Connect your Notion workspace before syncing your plan.',
        requiresConnection: true
      });
    }

    const adapter = new NotionAdapter(connection.accessToken);
    const refs = await repository.findNotionDatabaseRefs(user.id);
    if (!hasAllDatabaseRefs(refs)) {
      return jsonResponse(400, {
        error:
          'Enter the Goal, Milestone, Task, and Subtask data source IDs from your duplicated Clarity Planner template before syncing.',
        requiresDatabaseSetup: true
      });
    }

    const result = await adapter.syncHierarchy(
      {
        goalDataSourceId: refs.goal_data_source_id,
        milestoneDataSourceId: refs.milestone_data_source_id,
        taskDataSourceId: refs.task_data_source_id,
        subtaskDataSourceId: refs.subtask_data_source_id
      },
      hierarchy
    );

    // Retain goal content no longer than necessary (NFR02) - nothing reads this
    // conversation again once its plan is synced, so clear it rather than keep it forever.
    // Best-effort: the sync itself already succeeded, so a cleanup failure shouldn't fail the request
    if (sessionId) {
      try {
        await repository.updateConversationHistory(sessionId, []);
      } catch (clearError) {
        console.error('[sync-to-notion] failed to clear conversation history:', clearError);
      }
    }

    return jsonResponse(200, { success: true, ...result });
  } catch (error) {
    const userMessage = error.userMessage ?? 'Something went wrong. Try again.';
    console.error('[sync-to-notion] failed:', error);
    return jsonResponse(502, { error: userMessage });
  }
};

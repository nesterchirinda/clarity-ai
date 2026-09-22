// Checks each of the four data source ids against Notion, then saves them (FR10)
// Kept separate from sync-to-notion.js so this can run right after connecting, before a plan exists

const { DatabaseRepository } = require('./infrastructure/DatabaseRepository.js');
const { NotionAdapter } = require('./infrastructure/NotionAdapter.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

// Checked one at a time so the user gets one specific, actionable message back
const dataSourceFields = [
  { key: 'goalDataSourceId', label: 'Goals' },
  { key: 'milestoneDataSourceId', label: 'Milestones' },
  { key: 'taskDataSourceId', label: 'Tasks' },
  { key: 'subtaskDataSourceId', label: 'Subtasks' }
];

exports.handler = async (event) => {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;
  const methodError = requirePost(event);
  if (methodError) return methodError;

  const repository = new DatabaseRepository();
  try {
    const { dataSourceRefs } = JSON.parse(event.body || '{}');
    // Verified identity from the OAuth login, not the client-supplied email (NFR05)
    const email = verify(readCookie(event, SESSION_COOKIE_NAME));
    if (!email) {
      return jsonResponse(401, {
        error: 'Not signed in. Please reconnect Notion.',
        requiresConnection: true
      });
    }
    if (!dataSourceRefs) {
      return jsonResponse(400, { error: 'dataSourceRefs is required' });
    }

    const user = await repository.findOrCreateUserByEmail(email);
    const connection = await repository.findNotionConnection(user.id);
    if (!connection) {
      return jsonResponse(401, {
        error: 'Connect your Notion workspace before adding your data source ids.',
        requiresConnection: true
      });
    }

    const adapter = new NotionAdapter(connection.accessToken);
    for (const field of dataSourceFields) {
      const id = dataSourceRefs[field.key];
      if (!id) {
        return jsonResponse(400, {
          error: `Enter a data source id for ${field.label}.`,
          field: field.key
        });
      }
      try {
        await adapter.getDataSource(id);
      } catch (_lookupError) {
        // Handle each invalid ID here so the response identifies the specific field
        return jsonResponse(400, {
          error: `I can't access that data source for ${field.label}. Either it's the wrong id, or it's real but hasn't been shared with your ClarityAI integration yet - open it in Notion, use the "..." menu, then "Connect to" and add the integration, then send the id again.`,
          field: field.key
        });
      }
    }

    await repository.saveNotionDatabaseRefs(user.id, {
      goalDbId: dataSourceRefs.goalDataSourceId,
      milestoneDbId: dataSourceRefs.milestoneDataSourceId,
      taskDbId: dataSourceRefs.taskDataSourceId,
      subtaskDbId: dataSourceRefs.subtaskDataSourceId
    });

    return jsonResponse(200, { success: true });
  } catch (error) {
    console.error('[save-database-refs] failed:', error);
    return jsonResponse(502, { error: 'Something went wrong. Try again.' });
  }
};

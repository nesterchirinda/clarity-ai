// Tells the client whether this user already has data source ids saved (FR10)

const { DatabaseRepository, hasAllDatabaseRefs } = require('./infrastructure/DatabaseRepository.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

exports.handler = async (event) => {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;
  const methodError = requirePost(event);
  if (methodError) return methodError;

  try {
    // Verified identity from the OAuth login, not the client-supplied email (NFR05)
    const email = verify(readCookie(event, SESSION_COOKIE_NAME));
    if (!email) {
      return jsonResponse(401, {
        error: 'Not signed in. Please reconnect Notion.',
        requiresConnection: true
      });
    }

    const repository = new DatabaseRepository();
    const user = await repository.findOrCreateUserByEmail(email);
    const refs = await repository.findNotionDatabaseRefs(user.id);
    const hasDatabaseRefs = hasAllDatabaseRefs(refs);

    return jsonResponse(200, { hasDatabaseRefs });
  } catch (error) {
    console.error('[get-database-refs] failed:', error);
    return jsonResponse(502, { error: 'Something went wrong. Try again.' });
  }
};

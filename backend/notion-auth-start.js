// Starts Notion OAuth 2.0 (FR02). Ref: https://developers.notion.com/docs/authorization
// Nonce below doubles as CSRF protection (NFR01), checked in notion-auth-callback.js
// Ref: https://auth0.com/docs/secure/attack-protection/state-parameters

const { generateNonce } = require('./infrastructure/encryption.js');
const { handlePreflight, requirePost, jsonResponse } = require('./infrastructure/httpResponse.js');

// Netlify Dev serves over plain HTTP, where a Secure cookie would silently never be stored
const secureCookieFlag = process.env.NETLIFY_DEV ? '' : ' Secure;';

exports.handler = async (event) => {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;
  const methodError = requirePost(event);
  if (methodError) return methodError;

  try {
    if (!process.env.NOTION_CLIENT_ID || !process.env.NOTION_REDIRECT_URI) {
      console.error('[notion-auth-start] missing NOTION_CLIENT_ID or NOTION_REDIRECT_URI');
      return jsonResponse(500, { error: 'Notion connection is not configured yet. Please try again later.' });
    }

    const nonce = generateNonce();
    const params = new URLSearchParams({
      client_id: process.env.NOTION_CLIENT_ID,
      redirect_uri: process.env.NOTION_REDIRECT_URI,
      response_type: 'code',
      owner: 'user',
      state: nonce
    });
    // User is prompted to duplicate the template during this OAuth screen (set on Notion's side)
    // Ref: https://developers.notion.com/guides/get-started/public-connections
    const authUrl = `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
    const nonceCookie = `clarityai_oauth_nonce=${nonce}; HttpOnly;${secureCookieFlag} SameSite=Lax; Max-Age=600; Path=/`;

    return jsonResponse(200, { authUrl }, { 'Set-Cookie': nonceCookie });
  } catch (error) {
    console.error('[notion-auth-start] failed:', error);
    return jsonResponse(500, { error: 'Something went wrong. Try again.' });
  }
};

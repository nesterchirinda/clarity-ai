// Finishes Notion OAuth 2.0 and saves the access token encrypted (FR02, FR03, NFR01)

const { DatabaseRepository } = require('./infrastructure/DatabaseRepository.js');
const { sign, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');
const { readCookie } = require('./infrastructure/httpResponse.js');

const corsHeaders = { 'Access-Control-Allow-Origin': '*' };
const nonceCookieName = 'clarityai_oauth_nonce';

// Netlify Dev serves plain HTTP - Secure cookies wouldn't be stored
const secureCookieFlag = process.env.NETLIFY_DEV ? '' : ' Secure;';

// Redirects and always clears the nonce cookie. extraCookies sets the session cookie on success only.
function redirectAndClearNonceCookie(path, extraCookies = []) {
  const baseUrl = (process.env.APP_BASE_URL || 'https://clarityai-goals.netlify.app').replace(/\/$/, '');
  const clearNonceCookie = `${nonceCookieName}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`;
  return {
    statusCode: 302,
    headers: { ...corsHeaders, Location: `${baseUrl}${path}` },
    multiValueHeaders: { 'Set-Cookie': [...extraCookies, clearNonceCookie] },
    body: ''
  };
}

// Notion redirects the browser here after login
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const { code, state, error: oauthError } = params;
  if (oauthError) {
    console.error('[notion-auth-callback] notion returned oauth error:', oauthError);
    return redirectAndClearNonceCookie(`/?notion_error=${encodeURIComponent(oauthError)}`);
  }
  if (!code || !state) {
    return redirectAndClearNonceCookie('/?notion_error=missing_code');
  }

  // CSRF check (NFR01): only a browser holding the cookie notion-auth-start.js set for it can produce a state that matches
  const nonceCookie = readCookie(event, nonceCookieName);
  if (!nonceCookie || nonceCookie !== state) {
    console.error('[notion-auth-callback] state did not match the nonce cookie');
    return redirectAndClearNonceCookie('/?notion_error=invalid_state');
  }

  try {
    const basic = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
    ).toString('base64');
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${basic}` },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[notion-auth-callback] token exchange failed:', response.status, errorBody);
      throw new Error('Notion token exchange failed');
    }

    const tokenData = await response.json();
    // Needs the integration's "Read user information including email addresses" setting turned on
    const email = tokenData.owner?.user?.person?.email;
    const name = tokenData.owner?.user?.name;
    const avatarUrl = tokenData.owner?.user?.avatar_url;
    if (!email) {
      console.error('[notion-auth-callback] token response had no owner email');
      return redirectAndClearNonceCookie('/?notion_error=no_email');
    }

    const repository = new DatabaseRepository();
    const user = await repository.findOrCreateUserByEmail(email);
    await repository.saveNotionConnection(user.id, {
      accessToken: tokenData.access_token,
      workspaceId: tokenData.workspace_id,
      workspaceName: tokenData.workspace_name,
      botId: tokenData.bot_id,
      tokenExpiresAt: null
    });

    // Session proof, checked on every request (NFR05)
    const token = sign(email);
    // HttpOnly cookie, not a URL param - keeps the token out of logs, browser history, and client-side JS
    const sessionCookie = `${SESSION_COOKIE_NAME}=${token}; HttpOnly;${secureCookieFlag} SameSite=Lax; Max-Age=2592000; Path=/`;
    const redirectParams = new URLSearchParams({ connected: 'true', email });
    if (name) redirectParams.set('name', name);
    if (avatarUrl) redirectParams.set('avatarUrl', avatarUrl);

    return redirectAndClearNonceCookie(`/?${redirectParams.toString()}`, [sessionCookie]);
  } catch (error) {
    console.error('[notion-auth-callback] failed:', error);
    return redirectAndClearNonceCookie('/?notion_error=connection_failed');
  }
};

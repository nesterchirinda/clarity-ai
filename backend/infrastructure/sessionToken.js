// Signs the user's email after real Notion OAuth, so later requests prove identity (NFR05)
// Ref: https://auth0.com/docs/secure/tokens/json-web-tokens
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const SESSION_COOKIE_NAME = 'clarityai_session';

function sign(email) {
  if (!secret) throw new Error('JWT_SECRET environment variable is required');
  return jwt.sign({ email }, secret, { expiresIn: '30d', algorithm: 'HS256' });
}

function verify(token) {
  if (!secret) return null;
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] }).email;
  } catch (_error) {
    return null;
  }
}

module.exports = { sign, verify, SESSION_COOKIE_NAME };

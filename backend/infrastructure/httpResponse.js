// Shared CORS headers and checks, so every function does not repeat the same code

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Answer a browser pre-flight check or return nothing if this is not one
function handlePreflight(event) {
  if (event.httpMethod !== 'OPTIONS') return null;
  return { statusCode: 200, headers: corsHeaders, body: '' };
}

// Every handler response is this same shape - only the status code and JSON payload differ.
// extraHeaders lets the rare caller (e.g. setting a cookie) add to corsHeaders without every
// other handler needing to know that's possible
function jsonResponse(statusCode, payload, extraHeaders = {}) {
  return { statusCode, headers: { ...corsHeaders, ...extraHeaders }, body: JSON.stringify(payload) };
}

// Block anything that is not a POST request
function requirePost(event) {
  if (event.httpMethod === 'POST') return null;
  return jsonResponse(405, { error: 'Method not allowed' });
}

// Parses a single cookie value out of the raw "name=value; name2=value2" header
function readCookie(event, name) {
  const cookieHeader = event.headers && event.headers.cookie;
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').find((part) => part.trim().startsWith(`${name}=`));
  return match ? match.trim().slice(name.length + 1) : null;
}

module.exports = { handlePreflight, requirePost, jsonResponse, readCookie };

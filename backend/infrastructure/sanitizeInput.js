// Strip HTML/scripts before user input hits the LLM, DB, or Notion (NFR01)
const sanitizeHtml = require('sanitize-html');

// sanitize-html HTML-encodes plain text (e.g. "&" -> "&amp;") for safe embedding as HTML.
// Stored as plain text, so decode once tags/scripts are gone.
const htmlEntities = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" };

function sanitizeUserText(text) {
  if (typeof text !== 'string') return text;
  const withoutTags = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
  const decoded = withoutTags.replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => htmlEntities[entity]);
  return decoded.trim();
}

module.exports = { sanitizeUserText };

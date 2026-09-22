// Some models wrap JSON in a markdown fence - strip it before parsing
function stripFences(rawText) {
  return rawText
    .trim()
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim();
}

function parseJsonArray(rawText, errorMessage) {
  try {
    const parsed = JSON.parse(stripFences(rawText));
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    throw new Error(errorMessage);
  }
}

// Object shape, not array - used for the task decomposition step's { tasks } answer
function parseJsonObject(rawText, errorMessage) {
  try {
    const parsed = JSON.parse(stripFences(rawText));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(errorMessage);
    }
    return parsed;
  } catch (_error) {
    throw new Error(errorMessage);
  }
}

module.exports = { parseJsonArray, parseJsonObject };

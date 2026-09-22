// Thin fetch wrapper used for every ClarityAI backend call

async function post(path, body) {
  let response;
  try {
    // Session cookie sent automatically (same-origin) - nothing to attach
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (_networkError) {
    throw new Error("ClarityAI couldn't reach the server. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error ?? 'Something went wrong. Try again.');
    error.data = data;
    throw error;
  }

  return data;
}

// One entry per backend endpoint, so the rest of the app never builds a fetch by hand
const api = {
  startNotionAuth: () => post('/.netlify/functions/notion-auth-start', {}),

  sendChatMessage: (email, sessionId, message, mode, history) =>
    post('/.netlify/functions/chat', { email, sessionId, message, mode, history }),

  generateMilestones: (email, sessionId, refinementNote) =>
    post('/.netlify/functions/generate-milestones', { email, sessionId, refinementNote }),

  // One params object instead of five positional arguments - Martin
  generateTasks: ({ milestone, refinementNote, otherMilestoneTitles, windowStart, windowEnd }) =>
    post('/.netlify/functions/generate-tasks', {
      milestone,
      refinementNote,
      otherMilestoneTitles,
      windowStart,
      windowEnd
    }),

  generateSubtasks: (task, refinementNote) =>
    post('/.netlify/functions/generate-subtasks', { task, refinementNote }),

  syncToNotion: (email, sessionId, hierarchy) =>
    post('/.netlify/functions/sync-to-notion', { email, sessionId, hierarchy }),

  getDatabaseRefs: (email) => post('/.netlify/functions/get-database-refs', { email }),

  saveDatabaseRefs: (email, dataSourceRefs) =>
    post('/.netlify/functions/save-database-refs', { email, dataSourceRefs })
};

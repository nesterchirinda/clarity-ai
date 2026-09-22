// Generates Subtasks from a single Task - the last decomposition step (FR06, FR08, FR09)

const { ClaudeProvider } = require('./infrastructure/ClaudeProvider.js');
const { PlanningService } = require('./application/llm/PlanningService.js');
const { runDecompositionStep, subtaskStep } = require('./application/decomposition/decompositionSteps.js');
const { PlanValidator } = require('./application/decomposition/PlanValidator.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { sanitizeUserText } = require('./infrastructure/sanitizeInput.js');
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

    const { task, refinementNote: rawRefinementNote } = JSON.parse(event.body || '{}');
    // Strip HTML/script content from raw user input before it's used anywhere (NFR01)
    const refinementNote = rawRefinementNote ? sanitizeUserText(rawRefinementNote) : rawRefinementNote;
    if (!task || !task.title) {
      return jsonResponse(400, { error: 'A valid task object is required' });
    }

    const planningService = new PlanningService(new ClaudeProvider());
    const subtasks = await runDecompositionStep(planningService, subtaskStep, { task, refinementNote });
    new PlanValidator().validateSubtasks(subtasks);

    return jsonResponse(200, { subtasks });
  } catch (error) {
    const userMessage = error.userMessage ?? 'Something went wrong. Try again.';
    console.error('[generate-subtasks] failed:', error);
    return jsonResponse(502, { error: userMessage });
  }
};

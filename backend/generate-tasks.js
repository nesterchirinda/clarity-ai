// Generates Tasks from a single Milestone - step 2 of 3 (FR06, FR08)

const { ClaudeProvider } = require('./infrastructure/ClaudeProvider.js');
const { PlanningService } = require('./application/llm/PlanningService.js');
const { runDecompositionStep, taskStep } = require('./application/decomposition/decompositionSteps.js');
const { PlanValidator } = require('./application/decomposition/PlanValidator.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { sanitizeUserText } = require('./infrastructure/sanitizeInput.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

// Priority is set here by list position, not left up to the model
const priorityOptions = ['Do First', 'Do Next', 'Do Later'];

// Replace Magic Number with Named Constant (Martin)
const doNextCutoff = 2;

function assignPriorities(tasks) {
  return tasks.map((task, position) => {
    if (position === 0) {
      return { ...task, priority: priorityOptions[0] };
    }

    if (position <= doNextCutoff) {
      return { ...task, priority: priorityOptions[1] };
    }

    return { ...task, priority: priorityOptions[2] };
  });
}

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

    const {
      milestone,
      refinementNote: rawRefinementNote,
      otherMilestoneTitles,
      windowStart,
      windowEnd
    } = JSON.parse(event.body || '{}');
    // Strip HTML/script content from raw user input before it's used anywhere (NFR01)
    const refinementNote = rawRefinementNote ? sanitizeUserText(rawRefinementNote) : rawRefinementNote;
    if (!milestone || !milestone.title) {
      return jsonResponse(400, { error: 'A valid milestone object is required' });
    }

    const planningService = new PlanningService(new ClaudeProvider());
    const { tasks: rawTasks } = await runDecompositionStep(planningService, taskStep, {
      milestone,
      refinementNote,
      otherMilestoneTitles,
      windowStart,
      windowEnd
    });
    new PlanValidator().validateTasks(rawTasks);

    const tasks = assignPriorities(rawTasks);

    return jsonResponse(200, { tasks });
  } catch (error) {
    const userMessage = error.userMessage ?? 'Something went wrong. Try again.';
    console.error('[generate-tasks] failed:', error);
    return jsonResponse(502, { error: userMessage });
  }
};

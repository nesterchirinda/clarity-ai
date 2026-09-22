// Builds the Goal from the conversation, then generates Milestones - step 1 of 3 (FR06, FR08)
// Split across three calls since a Netlify Function only gets 10 seconds per invocation

const { DatabaseRepository } = require('./infrastructure/DatabaseRepository.js');
const { ClaudeProvider } = require('./infrastructure/ClaudeProvider.js');
const { PlanningService } = require('./application/llm/PlanningService.js');
const {
  runDecompositionStep,
  goalStep,
  milestoneStep
} = require('./application/decomposition/decompositionSteps.js');
const { PlanValidator } = require('./application/decomposition/PlanValidator.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { sanitizeUserText } = require('./infrastructure/sanitizeInput.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

exports.handler = async (event) => {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;
  const methodError = requirePost(event);
  if (methodError) return methodError;

  const repository = new DatabaseRepository();
  try {
    const { sessionId, refinementNote: rawRefinementNote } = JSON.parse(event.body || '{}');
    // Verified identity from the OAuth login, not the client-supplied email (NFR05)
    const email = verify(readCookie(event, SESSION_COOKIE_NAME));
    if (!email) {
      return jsonResponse(401, {
        error: 'Not signed in. Please reconnect Notion.',
        requiresConnection: true
      });
    }
    if (!sessionId) {
      return jsonResponse(400, { error: 'sessionId is required' });
    }
    // Strip HTML/script content from raw user input before it's used anywhere (NFR01)
    const refinementNote = rawRefinementNote ? sanitizeUserText(rawRefinementNote) : rawRefinementNote;

    await repository.findOrCreateUserByEmail(email);
    const session = await repository.findConversationSession(sessionId);
    if (
      !session ||
      !Array.isArray(session.conversation_history) ||
      session.conversation_history.length === 0
    ) {
      return jsonResponse(400, { error: 'Tell me about your goal before I can build a plan.' });
    }

    const planningService = new PlanningService(new ClaudeProvider());
    const goal = await runDecompositionStep(planningService, goalStep, {
      conversationHistory: session.conversation_history
    });
    const milestones = await runDecompositionStep(planningService, milestoneStep, {
      goal,
      conversationHistory: session.conversation_history,
      refinementNote
    });
    new PlanValidator().validateMilestones(milestones);

    return jsonResponse(200, { goal, milestones });
  } catch (error) {
    const userMessage = error.userMessage ?? 'Something went wrong. Try again.';
    console.error('[generate-milestones] failed:', error);
    return jsonResponse(502, { error: userMessage });
  }
};

// Handles one turn of the open ended goal conversation and refinement loop (FR05)
// No memory between calls - loads and saves conversation state via Supabase every time

const { DatabaseRepository } = require('./infrastructure/DatabaseRepository.js');
const { ClaudeProvider } = require('./infrastructure/ClaudeProvider.js');
const { PlanningService } = require('./application/llm/PlanningService.js');
const { handlePreflight, requirePost, jsonResponse, readCookie } = require('./infrastructure/httpResponse.js');
const { readyToken, chatPrompt, refinePrompt } = require('./application/prompts/chatPrompt.js');
const { sanitizeUserText } = require('./infrastructure/sanitizeInput.js');
const { verify, SESSION_COOKIE_NAME } = require('./infrastructure/sessionToken.js');

exports.handler = async (event) => {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;
  const methodError = requirePost(event);
  if (methodError) return methodError;

  const repository = new DatabaseRepository();
  try {
    const { sessionId, message: rawMessage, mode, history: clientHistory } = JSON.parse(
      event.body || '{}'
    );
    // Verified identity from the OAuth login, not the client-supplied email (NFR05)
    const email = verify(readCookie(event, SESSION_COOKIE_NAME));
    if (!email) {
      return jsonResponse(401, {
        error: 'Not signed in. Please reconnect Notion.',
        requiresConnection: true
      });
    }
    if (!sessionId || !rawMessage) {
      return jsonResponse(400, { error: 'sessionId and message are required' });
    }
    // Strip HTML/script content from raw user input before it's used anywhere (NFR01)
    const message = sanitizeUserText(rawMessage);

    const user = await repository.findOrCreateUserByEmail(email);
    const isRefine = mode === 'refine';

    // Refinement chat is short-lived and browser-only - never saved into the history the goal step reads from
    let history;
    if (isRefine) {
      history = Array.isArray(clientHistory) ? [...clientHistory] : [];
    } else {
      let session = await repository.findConversationSession(sessionId);
      if (!session) {
        session = await repository.createConversationSession(user.id, sessionId);
      }
      history = Array.isArray(session.conversation_history) ? session.conversation_history : [];
    }
    history.push({ role: 'user', content: message });

    const planningService = new PlanningService(new ClaudeProvider());
    const systemPrompt = isRefine ? refinePrompt : chatPrompt;
    const replyText = await planningService.chat(history, { systemPrompt });
    const readyToGenerate = replyText.includes(readyToken);
    const visibleReply = replyText.replace(readyToken, '').trim();

    history.push({ role: 'assistant', content: visibleReply });
    if (!isRefine) {
      await repository.updateConversationHistory(sessionId, history);
    }

    return jsonResponse(200, {
      reply: visibleReply,
      readyToGenerate,
      conversationHistory: history
    });
  } catch (error) {
    console.error('[chat] failed:', error);
    return jsonResponse(500, { error: 'Something went wrong. Try again.' });
  }
};

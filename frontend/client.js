// Handles onboarding, identity, and the goal chat loop (FR01, FR05)
// Plain HTML/CSS/JS, no build step - plan.js owns generation/review/sync, speech.js owns
// speech, api.js owns backend calls, all sharing appState and the DOM helpers below

const storageKeys = {
  email: 'clarityai_email',
  name: 'clarityai_name',
  avatarUrl: 'clarityai_avatar_url',
  sessionId: 'clarityai_session_id',
  notionConnected: 'clarityai_notion_connected',
  planState: 'clarityai_plan_state'
};

const appState = {
  email: localStorage.getItem(storageKeys.email),
  name: localStorage.getItem(storageKeys.name),
  avatarUrl: localStorage.getItem(storageKeys.avatarUrl),
  sessionId: null,
  notionConnected: localStorage.getItem(storageKeys.notionConnected) === 'true',
  conversationHistory: [],
  hierarchy: null,
  goalPageId: null,
  refinementNote: null,
  refinementHistory: [],
  stage: 'onboarding', // onboarding -> datasource-setup -> chat -> reviewing -> approved -> synced
  dataSourceDraft: null,
  dataSourceStepIndex: 0
};

// Falls back to Math.random if crypto.randomUUID isn't available
function createSessionId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const chatLog = document.getElementById('chat-log');
const composer = document.getElementById('composer');
const chatInput = document.getElementById('chat-input');

// Replaces any error already shown, rather than stacking them
function showError(message) {
  clearError();
  const row = document.createElement('p');
  row.className = 'chat-error';
  row.setAttribute('role', 'alert');
  row.setAttribute('aria-live', 'assertive');
  row.textContent = message;
  chatLog.appendChild(row);
  appState.errorRow = row;
  scrollToBottom();
}

function clearError() {
  if (appState.errorRow) {
    appState.errorRow.remove();
    appState.errorRow = null;
  }
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Relies on the browser to escape when textContent is read back out as innerHTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

// Two named functions instead of one with a true/false switch - avoids a flag argument (Martin)
// DOMPurify strips anything unsafe before it reaches innerHTML
function renderMarkdown(text) {
  return DOMPurify.sanitize(marked.parse(text == null ? '' : String(text)));
}

// Markdown links open in a new tab instead of navigating away from the app
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

function clarityIcon() {
  return '<svg class="spark" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#4a4d3c"/></svg>';
}

// status is for short-lived system lines like "Thinking" - grey text, never markdown
// Shared by addAssistantMessage and updateAssistantMessage, so the two can't drift apart
function messageBodyHtml(text, { actionsHtml = '', hintHtml = '', markdown = false, status = false } = {}) {
  return `
    <div${status ? ' class="msg-status"' : ''}>${markdown ? renderMarkdown(text) : escapeHtml(text)}</div>
    ${actionsHtml}
    ${hintHtml}
  `;
}

function addAssistantMessage(text, { actionsHtml = '', hintHtml = '', markdown = false, status = false } = {}) {
  const row = document.createElement('div');
  row.className = 'msg-row assistant';
  row.innerHTML = `
    <div class="msg-assistant">
      ${clarityIcon()}
      <div>
        ${messageBodyHtml(text, { actionsHtml, hintHtml, markdown, status })}
      </div>
    </div>
  `;
  chatLog.appendChild(row);
  scrollToBottom();
  return row;
}

// Re-appends the row so it stays in time order at the bottom of the chat
function updateAssistantMessage(
  row,
  text,
  { actionsHtml = '', hintHtml = '', markdown = false, status = false } = {}
) {
  row.querySelector('.msg-assistant > div').innerHTML = messageBodyHtml(text, {
    actionsHtml,
    hintHtml,
    markdown,
    status
  });
  chatLog.appendChild(row);
  scrollToBottom();
}

function addUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'msg-row user';
  row.innerHTML = `<div class="msg-user">${escapeHtml(text)}</div>`;
  chatLog.appendChild(row);
  scrollToBottom();
  return row;
}

function createButton(text, className, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.textContent = text;
  btn.addEventListener('click', onClick, { once: true });
  return btn;
}


// onboarding - connecting Notion doubles as sign-in and copies the template as part of
// its own login screen, so nothing else needs setting up separately

function updateAccountBadge() {
  const label = document.getElementById('account-label');
  const avatar = document.getElementById('avatar');
  const accountBtn = document.getElementById('account-btn');
  if (appState.notionConnected && appState.email) {
    if (appState.name) {
      label.textContent = appState.name;
    } else {
      const localPart = appState.email.split('@')[0];
      label.textContent = localPart.charAt(0).toUpperCase() + localPart.slice(1);
    }
    avatar.classList.add('connected');
    if (appState.avatarUrl) {
      avatar.classList.add('has-photo');
      avatar.innerHTML = `<img src="${escapeHtml(appState.avatarUrl)}" alt="" />`;
    } else {
      avatar.classList.remove('has-photo');
      avatar.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    }
    accountBtn.setAttribute('aria-label', 'Notion connected');
  } else {
    label.textContent = 'Not connected';
    avatar.classList.remove('connected', 'has-photo');
    accountBtn.setAttribute('aria-label', 'Notion not connected');
  }
}

async function startChat() {
  updateAccountBadge();
  if (appState.notionConnected) {
    await continueAfterNotionConnect();
  } else {
    appState.stage = 'onboarding';
    startNotionConnect();
  }
}

// Data source ids are asked for once, right after connecting, then skipped
async function continueAfterNotionConnect() {
  try {
    const { hasDatabaseRefs } = await api.getDatabaseRefs(appState.email);
    if (hasDatabaseRefs) {
      startGoalChat();
    } else {
      beginDataSourceSetupStage();
    }
  } catch (_error) {
    startGoalChat();
  }
}

function startNotionConnect() {
  renderWelcome();
}

function renderWelcome(errorMessage) {
  const content = {
    actionsHtml: `
      <div class="inline-actions">
        <button type="button" class="pill-solid" id="connect-notion-btn">Connect Notion</button>
      </div>
    `,
    hintHtml: errorMessage
      ? `<p class="step-hint step-hint-error">${escapeHtml(errorMessage)}</p>`
      : ''
  };
  const text = "Hi, I’m Clarity. I’m here to help you turn any goal into a clear, actionable plan. Let’s get started.";
  if (appState.connectRow) {
    updateAssistantMessage(appState.connectRow, text, content);
  } else {
    appState.connectRow = addAssistantMessage(text, content);
  }
  document
    .getElementById('connect-notion-btn')
    .addEventListener('click', handleConnectNotionClick, { once: true });
}

async function handleConnectNotionClick() {
  clearError();
  try {
    const { authUrl } = await api.startNotionAuth();
    window.location.href = authUrl;
  } catch (error) {
    renderWelcome(error.message);
  }
}


// free text chat and plan refinement

function startGoalChat() {
  appState.stage = 'chat';
  addAssistantMessage("All set. What's a goal you're excited to make real?");
  showComposer('Describe what you want to achieve');
}

function showComposer(placeholder) {
  composer.classList.remove('hidden');
  chatInput.value = '';
  chatInput.placeholder = placeholder || 'Describe what you want to achieve';
  chatInput.focus();
}

function hideComposer() {
  composer.classList.add('hidden');
}

function enableComposer() {
  chatInput.disabled = false;
  document.getElementById('send-btn').disabled = false;
  chatInput.focus();
}

// Shared by both branches of sendMessage below - only the extra args and refinementNote
// bookkeeping differ between a refinement turn and a normal chat turn
async function runChatTurn(message, refining) {
  const thinkingRow = addAssistantMessage('Thinking', { status: true });
  try {
    let data;
    if (refining) {
      data = await api.sendChatMessage(
        appState.email,
        appState.sessionId,
        message,
        'refine',
        appState.refinementHistory
      );
    } else {
      data = await api.sendChatMessage(appState.email, appState.sessionId, message);
    }

    if (refining) {
      appState.refinementHistory = data.conversationHistory;
    } else {
      appState.conversationHistory = data.conversationHistory;
    }

    if (data.reply && data.reply.trim()) {
      updateAssistantMessage(thinkingRow, data.reply, { markdown: true });
    } else {
      thinkingRow.remove();
    }

    if (data.readyToGenerate) {
      if (refining) {
        // Fold in the confirming message too, in case it narrows the request further
        appState.refinementNote = appState.refinementNote
          ? `${appState.refinementNote} ${message}`
          : message;
      }
      hideComposer();
      await generatePlan();
    } else if (refining) {
      appState.refinementNote = data.reply;
    }
  } catch (error) {
    thinkingRow.remove();
    showError(error.message);
  } finally {
    enableComposer();
  }
}

// Routes by appState.stage - refining, datasource-setup, or a normal chat turn
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  clearError();
  addUserMessage(message);
  chatInput.value = '';
  chatInput.disabled = true;
  document.getElementById('send-btn').disabled = true;

  if (appState.stage === 'datasource-setup') {
    try {
      await handleDataSourceId(message);
    } finally {
      enableComposer();
    }
    return;
  }

  await runChatTurn(message, appState.stage === 'refining');
}


// Plan generation, the hierarchy card, Notion reconnect, and data source setup live in
// plan.js. Speech to text and read aloud live in speech.js.

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('mic-btn').addEventListener('click', toggleSpeechToText);
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});
document.getElementById('plan-new-goal-btn').addEventListener('click', startNewGoal);


// boot

(function initializeApp() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('connected') === 'true') {
    // The OAuth redirect is the only place identity is learned from
    const email = params.get('email');
    if (email) {
      appState.email = email;
      localStorage.setItem(storageKeys.email, email);
    }

    const name = params.get('name');
    if (name) {
      appState.name = name;
      localStorage.setItem(storageKeys.name, name);
    }

    const avatarUrl = params.get('avatarUrl');
    if (avatarUrl) {
      appState.avatarUrl = avatarUrl;
      localStorage.setItem(storageKeys.avatarUrl, avatarUrl);
    }
    appState.notionConnected = true;
    localStorage.setItem(storageKeys.notionConnected, 'true');
    try {
      window.history.replaceState({}, '', '/');
    } catch (_error) {
      /* some environments (e.g. file://) disallow rewriting the URL */
    }
  }
  if (params.get('notion_error')) {
    showError("We couldn't finish connecting Notion. Please try connecting again.");
  }

  appState.sessionId = localStorage.getItem(storageKeys.sessionId) || createSessionId();
  localStorage.setItem(storageKeys.sessionId, appState.sessionId);

  updateAccountBadge();
  // A plan from an earlier visit picks up where it left off - see plan.js
  const savedPlan = loadSavedPlan();
  if (savedPlan) {
    applySavedPlan(savedPlan);
  } else {
    startChat();
  }
})();

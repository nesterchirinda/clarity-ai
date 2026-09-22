// Plan generation (the 3 tier breakdown), the plan review card, and the Notion sync flow (FR06, FR08, FR09, FR10)
// Shares the global appState object and the DOM helpers from client.js


// saving and restoring plan state - only reviewing/approved/synced survive a refresh
function savePlanState() {
  if (!appState.hierarchy) return;
  localStorage.setItem(
    storageKeys.planState,
    JSON.stringify({
      hierarchy: appState.hierarchy,
      stage: appState.stage,
      currentMilestoneIndex: appState.currentMilestoneIndex,
      goalPageId: appState.goalPageId || null
    })
  );
}

function clearPlanState() {
  localStorage.removeItem(storageKeys.planState);
}

// A query - answers a question, touches nothing else. Command Query Separation (Martin)
// Called once on page load, see initializeApp() in client.js
function loadSavedPlan() {
  const raw = localStorage.getItem(storageKeys.planState);
  if (!raw) return null;

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch (_error) {
    clearPlanState();
    return null;
  }
  if (!saved || !saved.hierarchy) {
    clearPlanState();
    return null;
  }

  return saved;
}

// A command - does something, hands nothing back. Command Query Separation (Martin)
function applySavedPlan(saved) {
  appState.hierarchy = saved.hierarchy;
  appState.stage = saved.stage || 'reviewing';
  appState.currentMilestoneIndex = saved.currentMilestoneIndex || 0;
  appState.goalPageId = saved.goalPageId || null;

  if (appState.stage === 'synced') {
    renderPlan();
    renderSyncSuccess({ goalPageId: appState.goalPageId });
  } else {
    addAssistantMessage('Welcome back. Picking up where you left off.');
    renderPlan();
    renderPlanButtons();
  }
}


// plan generation: goal+milestones in one call, then tasks per milestone,
// then subtasks per task - the last two run concurrently
async function generatePlan() {
  clearError();
  const statusRow = addAssistantMessage('Building your plan…', { status: true });

  try {
    const { goal, milestones } = await api.generateMilestones(
      appState.email,
      appState.sessionId,
      appState.refinementNote
    );
    const hierarchy = {
      goal,
      milestones: milestones.map((milestone) => ({ ...milestone, tasks: [] }))
    };

    // Concurrent calls, each given sibling titles to avoid duplicate tasks
    const allMilestoneTitles = hierarchy.milestones.map((milestone) => milestone.title);

    // Task window = previous milestone's due date (or today) through this one's own due date
    const today = new Date().toISOString().slice(0, 10);
    let windowStart = today;

    await Promise.all(
      hierarchy.milestones.map(async (milestone, position) => {
        const otherMilestoneTitles = allMilestoneTitles.filter((_title, i) => i !== position);
        const thisWindowStart = windowStart;
        const thisWindowEnd = milestone.dueDate || '';
        if (thisWindowEnd) windowStart = thisWindowEnd;

        const { tasks } = await api.generateTasks({
          milestone,
          refinementNote: appState.refinementNote,
          otherMilestoneTitles,
          windowStart: thisWindowStart,
          windowEnd: thisWindowEnd
        });
        milestone.tasks = tasks.map((task) => ({ ...task, subtasks: [] }));
      })
    );

    const allTasks = hierarchy.milestones.flatMap((milestone) => milestone.tasks);
    await Promise.all(
      allTasks.map(async (task) => {
        const { subtasks } = await api.generateSubtasks(task, appState.refinementNote);
        task.subtasks = subtasks;
      })
    );

    appState.hierarchy = hierarchy;
    appState.currentMilestoneIndex = 0;
    appState.planCardWrap = null;
    appState.planActionsWrap = null;
    chatLog.innerHTML = '';
    addAssistantMessage("Here's your plan. Take a look and let me know if anything needs adjusting.");
    renderPlan();
    appState.stage = 'reviewing';
    renderPlanButtons();
    savePlanState();
  } catch (error) {
    statusRow.remove();
    showComposer();
    showError(error.message);
  }
}


// plan review card - shows one milestone at a time, with buttons to move between them
function buildSubtaskList(subtasks) {
  return `
    <ol class="subtask-list">
      ${subtasks
        .map((subtask) => `
          <li class="subtask-row">
            <div class="subtask-content">
              <span class="subtask-label">${escapeHtml(subtask.title)}</span>
              ${subtask.description ? `<div class="subtask-description">${renderMarkdown(subtask.description)}</div>` : ''}
            </div>
          </li>
        `)
        .join('')}
    </ol>
  `;
}

const taskIcon =
  '<svg class="task-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';

function buildTaskList(tasks) {
  return `
    <ul class="task-list">
      ${tasks
        .map((task) => {
          const hasSubtasks = task.subtasks && task.subtasks.length > 0;
          const hasDetail = Boolean(task.description) || hasSubtasks;
          const labelHtml = `<span class="task-label">${escapeHtml(task.title)}</span>`;

          if (!hasDetail) {
            return `
              <li class="task-item">
                <div class="task-summary task-summary-inert">
                  ${taskIcon}
                  ${labelHtml}
                </div>
              </li>
            `;
          }

          return `
            <li class="task-item">
              <details>
                <summary class="task-summary">
                  ${taskIcon}
                  ${labelHtml}
                </summary>
                ${task.description ? `<div class="task-description">${renderMarkdown(task.description)}</div>` : ''}
                ${hasSubtasks ? buildSubtaskList(task.subtasks) : ''}
              </details>
            </li>
          `;
        })
        .join('')}
    </ul>
  `;
}

// Used by both plan.js and speech.js instead of each reaching into appState separately - Law of Demeter
function getCurrentMilestone() {
  return appState.hierarchy.milestones[appState.currentMilestoneIndex];
}

function renderMilestone() {
  const milestones = appState.hierarchy.milestones;
  const index = appState.currentMilestoneIndex;
  const milestone = getCurrentMilestone();

  appState.planCardWrap.querySelector('#milestone-content').innerHTML = `
    <h3 class="milestone-title">${escapeHtml(milestone.title)}</h3>
    ${milestone.description ? `<p class="milestone-description">${renderMarkdown(milestone.description)}</p>` : ''}
    ${buildTaskList(milestone.tasks)}
  `;
  appState.planCardWrap.querySelector('#milestone-pager-label').textContent = `Milestone ${index + 1} of ${milestones.length}`;
  appState.planCardWrap.querySelector('#milestone-prev-btn').disabled = index === 0;
  appState.planCardWrap.querySelector('#milestone-next-btn').disabled = index === milestones.length - 1;
  scrollToBottom();
}

function changeMilestone(delta) {
  const total = appState.hierarchy.milestones.length;
  const next = appState.currentMilestoneIndex + delta;
  if (next < 0 || next >= total) return;
  appState.currentMilestoneIndex = next;
  renderMilestone();
  savePlanState();
}

// Built once and reused - re-adding it on every render would duplicate the card
function renderPlan() {
  let wrap = appState.planCardWrap;
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'plan-card-wrap';
    wrap.innerHTML = `
      <div class="plan-card" id="plan-card">
        <h2 class="goal-title">${escapeHtml(appState.hierarchy.goal.title)}</h2>
        <div class="milestone-pager">
          <button type="button" class="pager-btn" id="milestone-prev-btn" aria-label="Previous milestone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span class="milestone-pager-label" id="milestone-pager-label"></span>
          <button type="button" class="pager-btn" id="milestone-next-btn" aria-label="Next milestone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div id="milestone-content"></div>
      </div>
    `;
    chatLog.appendChild(wrap);
    appState.planCardWrap = wrap;
    wrap.querySelector('#milestone-prev-btn').addEventListener('click', () => changeMilestone(-1));
    wrap.querySelector('#milestone-next-btn').addEventListener('click', () => changeMilestone(1));
  }

  renderMilestone();
  return wrap;
}

// Rebuilt fresh each call so the buttons always sit under the latest message
function renderPlanButtons() {
  if (appState.planActionsWrap) {
    appState.planActionsWrap.remove();
  }

  const actions = document.createElement('div');
  actions.className = 'plan-actions';
  actions.appendChild(makeReadAloudButton());
  if (appState.stage === 'approved') {
    actions.appendChild(createButton('Sync to Notion', 'pill-solid', handleSyncToNotion));
  } else {
    actions.appendChild(createButton("I'm happy with this", 'pill-solid', handleApprovePlan));
    actions.appendChild(createButton('I want to refine it', 'pill', handleRefinePlan));
  }

  chatLog.appendChild(actions);
  appState.planActionsWrap = actions;
  scrollToBottom();
}

function handleApprovePlan() {
  addUserMessage("I'm happy with this");
  addAssistantMessage('Great - I will write this into your Notion planner when you are ready.');
  appState.stage = 'approved';
  renderPlanButtons();
  savePlanState();
}

function clearPlanActions() {
  if (appState.planActionsWrap) {
    appState.planActionsWrap.remove();
    appState.planActionsWrap = null;
  }
}

function handleRefinePlan() {
  addUserMessage('I want to refine it');
  addAssistantMessage("No problem - tell me what you'd like to change, and I'll update your plan.");
  appState.stage = 'refining';
  appState.refinementHistory = [];
  clearPlanActions();
  showComposer();
}

// Shared by handleSyncToNotion() and the data-source retry path - rethrows so each caller reacts differently
async function syncPlan() {
  const statusRow = addAssistantMessage('Syncing to Notion…', { status: true });
  try {
    const data = await api.syncToNotion(appState.email, appState.sessionId, appState.hierarchy);
    statusRow.remove();
    appState.stage = 'synced';
    appState.goalPageId = data.goalPageId || null;
    renderSyncSuccess(data);
    savePlanState();
  } catch (error) {
    statusRow.remove();
    throw error;
  }
}

async function handleSyncToNotion() {
  clearError();
  clearPlanActions();
  try {
    await syncPlan();
  } catch (error) {
    if (error.data && error.data.requiresConnection) {
      startNotionReconnect();
    } else if (error.data && error.data.requiresDatabaseSetup) {
      beginDataSourceSetupStage();
    } else {
      showError(error.message);
      renderPlanButtons();
    }
  }
}

function renderSyncSuccess(result) {
  Array.from(chatLog.children).forEach((child) => {
    if (child !== appState.planCardWrap) child.remove();
  });
  appState.planActionsWrap = null;

  const notionUrl = result.goalPageId
    ? `https://notion.so/${result.goalPageId.replace(/-/g, '')}`
    : null;

  const wrap = document.createElement('div');
  wrap.className = 'synced-panel';
  wrap.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#4A4D3C"/></svg>
    <p>Your plan is now in Notion, good luck!</p>
    <div class="actions"></div>
  `;

  const actions = wrap.querySelector('.actions');
  if (notionUrl) {
    const link = document.createElement('a');
    link.className = 'pill-solid';
    link.href = notionUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open in Notion';
    actions.appendChild(link);
  }
  actions.appendChild(createButton('Plan a new goal', 'pill', startNewGoal));
  chatLog.appendChild(wrap);
  scrollToBottom();
}

function startNotionReconnect() {
  const wrap = document.createElement('div');
  wrap.className = 'setup-card';
  wrap.innerHTML = '<p>Your Notion workspace isn\'t connected yet.</p>';
  wrap.appendChild(createButton('Connect Notion', 'pill-solid', handleConnectNotionClick));
  chatLog.appendChild(wrap);
  scrollToBottom();
}


// data source setup - one-time entry of the four planner ids, asked as ordinary chat turns
const dataSourceFields = [
  { key: 'goalDataSourceId', label: 'Goals', question: "What's your Goal data source ID?" },
  { key: 'milestoneDataSourceId', label: 'Milestones', question: "What's your Milestone data source ID?" },
  { key: 'taskDataSourceId', label: 'Tasks', question: "What's your Task data source ID?" },
  { key: 'subtaskDataSourceId', label: 'Subtasks', question: "What's your Subtask data source ID?" }
];

function askForDataSourceId() {
  const field = dataSourceFields[appState.dataSourceStepIndex];
  addAssistantMessage(field.question);
  showComposer(`Paste the ${field.label} data source ID`);
}

// Pulls a 32 character id out of a bare id or a pasted Notion URL
function getDataSourceId(raw) {
  const match = raw.replace(/-/g, '').match(/[0-9a-f]{32}/i);
  return match ? match[0] : null;
}

function beginDataSourceSetupStage() {
  appState.stage = 'datasource-setup';
  appState.dataSourceDraft = {};
  appState.dataSourceStepIndex = 0;
  askForDataSourceId();
}

async function handleDataSourceId(message) {
  const field = dataSourceFields[appState.dataSourceStepIndex];
  const id = getDataSourceId(message);
  if (!id) {
    addAssistantMessage(
      `That doesn't look like a data source ID - it's the 32-character ID from your ${field.label} database. Paste it directly, or paste the full Notion URL for that database and I'll pull the ID out of it.`
    );
    askForDataSourceId();
    return;
  }
  appState.dataSourceDraft[field.key] = id;

  if (appState.dataSourceStepIndex < dataSourceFields.length - 1) {
    appState.dataSourceStepIndex += 1;
    askForDataSourceId();
    return;
  }

  const statusRow = addAssistantMessage('Checking Notion access…', { status: true });
  try {
    await api.saveDatabaseRefs(appState.email, appState.dataSourceDraft);
    statusRow.remove();
  } catch (error) {
    statusRow.remove();
    addAssistantMessage(error.message);
    const failedIndex = dataSourceFields.findIndex((f) => f.key === (error.data && error.data.field));
    appState.dataSourceStepIndex = failedIndex >= 0 ? failedIndex : 0;
    askForDataSourceId();
    return;
  }

  if (appState.hierarchy) {
    hideComposer();
    try {
      await syncPlan();
    } catch (error) {
      showError(error.message);
    }
  } else {
    chatLog.innerHTML = '';
    startGoalChat();
  }
}

function startNewGoal() {
  appState.sessionId = createSessionId();
  localStorage.setItem(storageKeys.sessionId, appState.sessionId);
  appState.hierarchy = null;
  appState.conversationHistory = [];
  appState.refinementNote = null;
  appState.refinementHistory = [];
  appState.connectRow = null;
  appState.planCardWrap = null;
  appState.planActionsWrap = null;
  appState.currentMilestoneIndex = 0;
  appState.goalPageId = null;
  clearPlanState();
  chatLog.innerHTML = '';
  clearError();
  if (appState.notionConnected) {
    startGoalChat();
  } else {
    appState.stage = 'onboarding';
    startNotionConnect();
  }
}

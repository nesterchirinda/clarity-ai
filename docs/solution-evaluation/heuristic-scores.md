# Heuristic Evaluation

Eleven heuristics scored against five ClarityAI screen-states, roughly split between general
usability heuristics (Nielsen, 1994; ISO 9241-210:2019) and heuristics adapted from ADHD-specific
literature. Heuristic evaluation as a method follows Nielsen and Molich (1990); the specific list
of ten general heuristics scored against here is the later, separate Nielsen (1994) source.

Screens: **Onboarding** (the Notion-connect welcome screen), **Conversational input** (the open-ended
goal chat, including the one-time data-source-ID setup asked as chat turns), **Plan review — collapsed**
(the milestone card with tasks closed, the default state), **Plan review — expanded** (a task's `<details>`
opened to show its description and subtasks), **Synced confirmation** (the panel shown after a
successful Notion write).

<br>

## 1. Heuristics

**General**

- **G1. Visibility of system status** (Nielsen, 1994) — does the system show the user, within
  reasonable time, that an action is in progress or has completed? Matters here because a silent
  wait reads as "did that click even register," which invites a repeat click or drop-off.
- **G2. User control and freedom** (Nielsen, 1994) — can the user back out of, cancel, or reverse
  the current state without cost? Matters because a dead end forces the user to redo earlier work
  from scratch, which is a high-cost ask for a population prone to task-initiation fatigue.
- **G3. Error prevention, diagnosis, and recovery** (Nielsen, 1994) — does the system stop likely
  mistakes before they happen, and when something fails anyway, does it say what happened and what
  to do next? Matters because a dead-end error with no next step forces the user to guess.
- **G4. Recognition rather than recall** (Nielsen, 1994) — is the information needed for the current
  decision visible, rather than something the user must remember from an earlier screen? Matters
  doubly here given the working-memory constraints in [[A2]] below.
- **G5. Match between the system and the real world** (Nielsen, 1994) — does every element that
  looks like a real-world control (an icon, a button) actually behave like one? Matters because a
  convention that doesn't pay off (a paperclip that does nothing) costs a click and a moment of
  doubt about whether the app is broken.
- **G6. Fit to the user's actual context of use** (ISO 9241-210:2019) — does the task match how
  the target user actually works in the moment (single window, own pace), rather than assuming an
  idealised session? Matters because a task that demands leaving the app and returning is a natural
  drop-off point.

**ADHD-specific**

- **A1. Minimise extraneous cognitive load through chunking and progressive disclosure**
  (Sweller, 1988) — is complex content broken into small units shown one at a time, with detail
  hidden until asked for? Cognitive Load Theory holds that extraneous load competes directly with
  the germane load needed to actually process content, and ADHD-linked working memory constraints
  ([[A2]]) shrink the budget available before that competition starts mattering.
- **A2. Externalise memory across multi-step flows** (Kofler et al., 2024) — does the system carry
  forward what the user already entered or reviewed, rather than expecting them to hold it in mind
  across steps or sessions? Kofler et al.'s review found working memory deficits are the more
  consistent executive-function impairment in ADHD (more so than inhibition), making any point where
  the interface silently relies on the user's memory a specific failure point for this population.
- **A3. Low-friction task initiation: one concrete next action** (Deshmukh, 2025) — at each stage,
  is there exactly one obvious, concrete next action, rather than an open-ended blank state or
  several undifferentiated options? Deshmukh's framework identifies task-initiation paralysis —
  executive dysfunction specifically in "getting started" — as a primary barrier this population
  faces with conventional productivity tools.
- **A4. Calm, non-blocking interruption for status and errors** (Deshmukh, 2025) — when the system
  needs the user's attention, is it delivered as a low-intensity, inline signal rather than a
  blocking modal or alert? Deshmukh's framework favours "soft interventions" over intrusive
  notifications, aligned with what ADHD users report wanting from an assistive tool, distinct from
  simply having error messaging at all ([[G3]]).
- **A5. Visible capacity-matching cues (time, energy, priority)** (Deshmukh, 2025) — can the user
  see, at the point of review, how long a task takes, what energy it needs, and how urgent it is?
  Deshmukh's framework names time blindness and mismatched task-to-capacity as core ADHD barriers
  that conventional tools fail to surface — this is the specific mechanism FR17–FR19 exist to serve.

<br>

## 2. Scored Table

0 = violates · 1 = partially meets · 2 = meets

| Screen | G1 | G2 | G3 | G4 | G5 | G6 | A1 | A2 | A3 | A4 | A5 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Onboarding | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Conversational input | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 1 | 2 | 2 | 2 |
| Plan review — collapsed | 2 | 0 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 0 |
| Plan review — expanded | 2 | 0 | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 0 |
| Synced confirmation | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |

<br>

## 3. Notable Strengths

| Screen | Heuristic | Where (file:line) | What's there |
|---|---|---|---|
| Plan review — collapsed / expanded | A2 (Kofler et al., 2024) | [plan.js:6-59](../../frontend/plan.js#L6-L59) | `savePlanState()` writes the full hierarchy, current stage, and milestone index to `localStorage` on every change; `loadSavedPlan()`/`applySavedPlan()` restore that exact position on return.<br>The user can close the tab mid-review and pick up later without reconstructing anything from memory — a direct answer to the working-memory constraint A2 tests for. |
| Synced confirmation | G3 (Nielsen, 1994) | [plan.js:310-325](../../frontend/plan.js#L310-L325) | `handleSyncToNotion()` branches a failed sync into three distinct, named recovery paths — `requiresConnection` re-opens Notion connect, `requiresDatabaseSetup` re-opens the data-source wizard, anything else shows the message and restores the action buttons for a retry.<br>None of the three leaves the user at a dead end. |
| All screens | A4 (Deshmukh, 2025) | [client.js:41-51](../../frontend/client.js#L41-L51), [style.css:183-186](../../frontend/style.css#L183-L186) | Every error path in the app — connect failure, chat failure, sync failure — resolves to the same inline, muted-colour `.chat-error` row via `showError()`. There is no `alert()`, no modal, and no blocking dialog anywhere in the codebase; the one prior error is always cleared before a new one is shown, so they never stack. |

<br>

## 4. Weaknesses

| Screen | Heuristic | Score | Where (file:line) | What's there |
|---|---|:---:|---|---|
| Plan review — collapsed | A5 (Sev 3) | 0 | [plan.js:150-186](../../frontend/plan.js#L150-L186), [plan.js:130-145](../../frontend/plan.js#L130-L145) | `buildTaskList()` renders only `task.title` and `task.description`; `buildSubtaskList()` renders only `subtask.title` and `subtask.description`.<br>`task.energyLevel`, `task.estimatedTime`, `task.priority` (assigned in [generate-tasks.js:11-28](../../backend/generate-tasks.js#L11-L28)) and `subtask.estimatedTime` are all present on the objects held in `appState.hierarchy` but none are read anywhere in the render path. `milestone.dueDate` is used only internally as a task-generation window ([plan.js:82-90](../../frontend/plan.js#L82-L90)), never shown. |
| Plan review — expanded | A5 (Sev 3) | 0 | [plan.js:170-186](../../frontend/plan.js#L170-L186) | Same gap persists once a task is opened — the expanded `<details>` block still surfaces only description and subtasks, not the time/energy/priority data sitting on the same object. This is the screen where FR17–FR19's capacity-matching data would be reviewed before sync, and it is the one place it never appears. |
| Plan review — collapsed | G2 (Sev 3) | 0 | [plan.js:250-268](../../frontend/plan.js#L250-L268), [plan.js:441-462](../../frontend/plan.js#L441-L462) | `renderPlanButtons()` shows "I want to refine it" only while `stage !== 'approved'`; once the user approves, that branch renders just a single "Sync to Notion" button, and the refine action is never rebuilt again for this plan.<br>The only remaining route back to conversational refinement is `startNewGoal()` via the header's "Plan a new goal" pill, which clears `appState.hierarchy` entirely and restarts the whole three-tier generation from an empty chat. |
| Plan review — expanded | G2 (Sev 3) | 0 | [plan.js:250-268](../../frontend/plan.js#L250-L268) | Same lockout — task disclosure state doesn't change the action bar underneath it. |
| Conversational input | G2 | 1 | [client.js:269-315](../../frontend/client.js#L269-L315), [plan.js:63-126](../../frontend/plan.js#L63-L126) | Neither `runChatTurn()` nor `generatePlan()` exposes a cancel/abort action while a request is in flight — `chatInput` and `#send-btn` are simply disabled ([client.js:322-326](../../frontend/client.js#L322-L326)) until the fetch resolves or throws. A user who wants to stop and rephrase has to wait it out. |
| Conversational input | G3 | 1 | [plan.js:121-125](../../frontend/plan.js#L121-L125), [PlanValidator.js:29-45](../../backend/application/decomposition/PlanValidator.js#L29-L45) | Every shape-validation failure from `PlanValidator` (missing title, malformed item, empty list) collapses to the same generic `'Something went wrong. Try again.'`, shown as-is by `generatePlan()`'s catch block. This contrasts with the specific, actionable guidance given a step away for a bad data-source paste ([plan.js:397-406](../../frontend/plan.js#L397-L406)). |
| Conversational input | G4 | 1 | [plan.js:371-395](../../frontend/plan.js#L371-L395) | The four-question data-source-ID sequence (`dataSourceFields`, `askForDataSourceId()`) shows only the current question and its placeholder — no running list of which of the four IDs are already captured or which remain, unlike the milestone pager's "Milestone X of Y" pattern used elsewhere in the same app. |
| Conversational input | G5 | 1 | [index.html:66-82](../../frontend/index.html#L66-L82) | The `.attach-icon` paperclip sits in the composer beside the working mic and send buttons, styled like a control, but is a non-interactive `<span aria-hidden="true">` — the code comment reads "Decorative only for now - PDF upload isn't implemented." `aria-hidden` at least keeps it out of the accessibility tree, but a sighted user has no such signal that it does nothing. |
| Conversational input | G6 (ISO) | 1 | [plan.js:378-395](../../frontend/plan.js#L378-L395), [client.js:192-203](../../frontend/client.js#L192-L203) | The one-time data-source setup asks the user to alt-tab into Notion, locate up to four separate databases, and paste each 32-character ID or URL back, one at a time. It is asked only once per account (`continueAfterNotionConnect()`) and accepts a pasted full URL rather than demanding the bare ID, but it is still a multi-window, multi-step task dropped into the middle of an otherwise single-window chat flow. |
| Conversational input | A2 | 1 | [plan.js:371-395](../../frontend/plan.js#L371-L395) | Same data-source sequence: `conversationHistory`/`refinementHistory` are carried forward for the model ([client.js:269-315](../../frontend/client.js#L269-L315)), but the user reviewing their own already-entered IDs has nothing but chat scrollback to check against. |
| Plan review — expanded | A1 | 1 | [plan.js:170-181](../../frontend/plan.js#L170-L181) | Each task's `<details>` is an independent, uncontrolled native element — nothing stops every task in a milestone being opened at once, and there is no "collapse all" to return to the low-load default. A milestone with several detailed tasks can end up with every description and numbered subtask list stacked on screen simultaneously. |

<br>

## References

* International Organization for Standardization (2019) *ISO 9241-210:2019, Ergonomics of
  human-system interaction — Part 210: Human-centred design for interactive systems*. Geneva: ISO.
* Kofler, M.J., Soto, E.F., Singh, L.J., Harmon, S.L., Jaisle, E., Smith, J.N., Feeney, K.E. and
  Musser, E.D. (2024) 'Executive function deficits in attention-deficit/hyperactivity disorder and
  autism spectrum disorder', *Nature Reviews Psychology*, 3(10), pp. 701-719.
* Deshmukh, R. (2025) 'Toward Neurodivergent-Aware Productivity: A Systems and AI-Based
  Human-in-the-Loop Framework for ADHD-Affected Professionals', *arXiv:2507.06864 [cs.HC]*.
* Nielsen, J. and Molich, R. (1990) 'Heuristic evaluation of user interfaces', *Proceedings of the
  ACM CHI'90 Conference*, Seattle, WA, 1-5 April, pp. 249-256.
* Nielsen, J. (1994) 'Enhancing the explanatory power of usability heuristics', *Proceedings of the
  ACM CHI'94 Conference*, Boston, MA, pp. 152-158.
* Sweller, J. (1988) 'Cognitive load during problem solving: Effects on learning', *Cognitive
  Science*, 12(2), pp. 257-285.

<br>

**Summary:** 11 heuristics (6 general — Nielsen 1994 and ISO 9241-210 — and 5 ADHD-specific, drawn
from Sweller, Kofler et al., and Deshmukh) scored across 5 screen-states. The pattern: the
happy-path screens (onboarding, synced confirmation) and the core review layout are solid, and
memory/state persistence across sessions is a genuine strength. The concentration of weaknesses sits
in two places — the conversational-input screen, where the one-time data-source-ID setup carries
most of the friction found anywhere in the app, and the plan review screens, where the generated
time/energy/priority data (FR17–FR19) and the post-approval refine path are both present in the code
but not reachable by the user in-app.

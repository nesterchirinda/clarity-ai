# ADR12: AI Planning Pipeline

* Status: Proposed

## Context and Problem Statement

Clarity rethinks the sub-goals and tasks under one of a user's intentions through
conversation (Intention → Sub-goal → Task → Subtask, which maps onto Goal → Milestone
→ Task → Subtask). The prototype sent one long prompt and the whole conversation to
the model from the browser, asked it to "reply with only JSON", and had it rewrite the
entire plan on every change. In testing this caused:

* replies cut off mid-plan, which broke parsing (refine failed this way);
* agreed sub-goals disappearing when the model rewrote the plan;
* rules that only held some of the time, with no way to tell;
* planner data pasted in by hand instead of read from the user's Notion;
* mechanical mistakes the model is poor at (weekday dates, dates past 31 December,
  counting hours).

How should the AI be structured so plans are reliable for any user?

## Decision Drivers

* NFR09: the provider stays swappable (ADR10).
* Plans must hold the product's rules (results by 31 December, only what the user
  controls, no duplicates, realistic weekly load).
* Refining must never lose agreed work, and the user can go back to any earlier message.
* Quality has to be measurable before and after a prompt change.

## Considered Options

* One prompt, model returns the whole plan as text (the prototype)
* A free-running agent with tools
* A pipeline orchestrated by code, with a structured output per stage

## Decision Outcome

Chosen option: a pipeline orchestrated by code. Code decides the order of steps; the
model does the judgement inside each step.

| Stage | Model | Output |
|---|---|---|
| Classify a message (task, sub-goal or intention) | fast tier | `classifySchema` |
| Interview, until it understands (max 4 questions) | planning tier, medium effort | `interviewSchema` |
| Propose sub-goals | planning tier, high effort | `subgoalsSchema` |
| Plan tasks, one call per sub-goal, in parallel | planning tier, high effort | `tasksSchema` |
| Refine | planning tier, edit tools on the draft | short message |
| Check rules, fix mechanical problems, expand repeats | code (`PlanChecker`, `repeatDates`) | fixed plan + violations |

Key parts, all in `backend/application/rethink/`:

* **Structured outputs** (`schemas.js`): every stage returns JSON that matches a schema,
  so replies always parse. Streaming with a high `max_tokens` stops cut-offs.
* **The plan is data** (`PlanDraft.js`): stored in `rethink_sessions`, versioned before
  every user message. Refine uses small edit tools (`refineTools.js`: add, replace,
  remove, move a task, reword a sub-goal); agreed sub-goals are locked, so they can't
  disappear. "Go back" restores a saved version.
* **Checks before the user sees anything** (`PlanChecker.js`): mechanical problems are
  fixed in code; judgement problems (outcomes others control, support work as a
  sub-goal, dates past the year, "your" in to-dos, duplicates, weekly load) are sent
  back to the model once to repair. Anything left is returned as a warning.
* **Dates are code's job** (`repeatDates.js`): the model gives days and a range; code
  creates one dated task per occurrence, never past 31 December.
* **Context from the user's own planner** (`NotionPlannerReader.js`,
  `plannerContext.js`): intentions, sub-goals, open tasks, and routines detected from
  the user's history (a task name repeated 3+ times in 8 weeks). Every list can be
  empty, so it works for new users.
* **Prompt caching**: the system prompt (`rethinkPrompts.js`) is identical for everyone
  and cached; user data goes in the messages.
* **Evals** (`backend/evals/`): made-up users scored by code checks and a Claude judge
  against a rubric. `npm run eval` before and after any prompt change.

### Consequences

* Good, because a malformed or cut-off reply can no longer reach the user.
* Good, because refining changes only what it names, and nothing agreed is lost.
* Good, because rules are enforced in code where possible and measured where not.
* Good, because each stage is small, testable and replaceable.
* Bad, because there are more model calls per plan (one per sub-goal for tasks), so
  more cost and latency than one call; parallel calls keep the wait down.
* Bad, because code checks are heuristics (for example, verb detection) and can
  occasionally flag good wording; they repair once and then warn rather than block.

### Not yet built

* Wiring the frontend to `/.netlify/functions/rethink`.
* Writing the agreed plan to Notion (task per repeat date, linked to its sub-goal),
  reusing `NotionAdapter` with a plan-item-to-page mapping so re-syncs don't duplicate.
* Reading task templates from Notion (currently passed in as an empty list).
* Model-driven reading tools (`get_tasks`, `get_week_load`) for questions the prefetched
  context doesn't answer.
* A user profile and facts carried across intentions.

## Pros and Cons of the Options

### Pipeline orchestrated by code (chosen)

Reliable, testable and measurable; each step can use the cheapest model that does it
well. Costs more calls than a single prompt.

### One prompt returning the whole plan

Fewest calls and simplest code, but output can be cut off or malformed, agreed work can
vanish on a rewrite, and rules can't be enforced.

### Free-running agent with tools

Flexible, but the steps of this task are known in advance, so letting the model choose
them adds cost, latency and unpredictability without adding quality.

// The draft plan is data, not text (ADR12)
// Claude never rewrites the whole plan. It proposes sub-goals once, then tasks per
// sub-goal, and refines through small edit operations applied here. Agreed sub-goals
// are locked, so a refine can't drop or rename them. Every change is versioned, so
// "go back to an earlier message" is restoring a version.

const { verdicts } = require('./schemas.js');

const inactiveVerdicts = ['Done', 'Close', 'Park', 'Next year'];

class DraftError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DraftError';
  }
}

let idCounter = 0;
function newId(prefix) {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}`;
}

function cleanTask(task) {
  return {
    id: task.id || newId('t'),
    name: String(task.name || '').trim(),
    due: task.due || null,
    repeat: task.repeat || null,
    template: task.template || '',
    existing: Boolean(task.existing),
    hours: typeof task.hours === 'number' && task.hours >= 0 ? task.hours : 0,
    subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(String) : []
  };
}

class PlanDraft {
  constructor(state = {}) {
    this.state = {
      intention: state.intention || null,
      subgoals: state.subgoals || [],
      locked: Boolean(state.locked),
      versions: state.versions || []
    };
  }

  static fromJSON(json) {
    return new PlanDraft(json || {});
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Sub-goals still being worked on this year (not parked, closed, done or next year)
  activeSubgoals() {
    return this.state.subgoals.filter((subgoal) => !inactiveVerdicts.includes(subgoal.verdict));
  }

  findSubgoal(subgoalId) {
    const subgoal = this.state.subgoals.find((item) => item.id === subgoalId);
    if (!subgoal) throw new DraftError(`No sub-goal with id ${subgoalId}`);
    return subgoal;
  }

  findTask(taskId) {
    for (const subgoal of this.state.subgoals) {
      const task = subgoal.tasks.find((item) => item.id === taskId);
      if (task) return { subgoal, task };
    }
    throw new DraftError(`No task with id ${taskId}`);
  }

  // Saves a copy before a change, labelled with what caused it (e.g. a message id)
  checkpoint(label) {
    const { versions, ...rest } = this.state;
    this.state.versions = [...versions, { label, at: new Date().toISOString(), state: JSON.parse(JSON.stringify(rest)) }];
  }

  // Back to the version saved just before `label`, dropping everything after it
  restore(label) {
    const index = this.state.versions.findIndex((version) => version.label === label);
    if (index === -1) throw new DraftError(`No saved version called ${label}`);
    const { state } = this.state.versions[index];
    this.state = { ...JSON.parse(JSON.stringify(state)), versions: this.state.versions.slice(0, index) };
  }

  setSubgoals(items) {
    if (this.state.locked) throw new DraftError('Sub-goals are agreed and locked');
    this.state.subgoals = items.map((item) => {
      if (!verdicts.includes(item.verdict)) throw new DraftError(`Unknown verdict ${item.verdict}`);
      return { id: newId('sg'), verdict: item.verdict, was: item.was || '', now: item.now, why: item.why || '', tasks: [] };
    });
  }

  lockSubgoals() {
    this.state.locked = true;
  }

  setTasks(subgoalId, tasks) {
    const subgoal = this.findSubgoal(subgoalId);
    subgoal.tasks = tasks.map(cleanTask);
  }

  // ---- edit operations, exposed to Claude as tools during refine ----

  addTask(subgoalId, task) {
    const subgoal = this.findSubgoal(subgoalId);
    if (inactiveVerdicts.includes(subgoal.verdict)) throw new DraftError('That sub-goal has no tasks this year');
    const created = cleanTask(task);
    subgoal.tasks.push(created);
    return created;
  }

  updateTask(taskId, changes) {
    const { task } = this.findTask(taskId);
    const allowed = ['name', 'due', 'repeat', 'template', 'existing', 'hours', 'subtasks'];
    for (const key of Object.keys(changes)) {
      if (!allowed.includes(key)) throw new DraftError(`Can't change ${key}`);
    }
    Object.assign(task, cleanTask({ ...task, ...changes, id: task.id }));
    return task;
  }

  removeTask(taskId) {
    const { subgoal, task } = this.findTask(taskId);
    subgoal.tasks = subgoal.tasks.filter((item) => item.id !== task.id);
    return task;
  }

  moveTask(taskId, toSubgoalId) {
    const target = this.findSubgoal(toSubgoalId);
    const task = this.removeTask(taskId);
    target.tasks.push(task);
    return task;
  }

  // Wording and why can change after agreement; the list of sub-goals can't
  updateSubgoal(subgoalId, changes) {
    const subgoal = this.findSubgoal(subgoalId);
    for (const key of Object.keys(changes)) {
      if (!['now', 'why'].includes(key)) throw new DraftError(`Can't change ${key} of a sub-goal`);
    }
    Object.assign(subgoal, changes);
    return subgoal;
  }
}

module.exports = { PlanDraft, DraftError, inactiveVerdicts };

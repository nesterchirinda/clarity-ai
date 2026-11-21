// Edit tools Claude uses to refine an agreed plan (ADR12)
// Small operations on the draft instead of rewriting the plan: a refine can only
// touch what it names, and agreed sub-goals can't disappear.

const { taskItem } = require('./schemas.js');

const refineToolDefinitions = [
  {
    name: 'add_task',
    description: 'Add a task to a sub-goal. Use the sub-goal id from the plan.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { subgoal_id: { type: 'string' }, task: taskItem },
      required: ['subgoal_id', 'task'],
      additionalProperties: false
    }
  },
  {
    name: 'replace_task',
    description: 'Replace an existing task with a corrected version. Send the whole task, including fields that stay the same.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { task_id: { type: 'string' }, task: taskItem },
      required: ['task_id', 'task'],
      additionalProperties: false
    }
  },
  {
    name: 'remove_task',
    description: 'Remove a task from the plan.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { task_id: { type: 'string' } },
      required: ['task_id'],
      additionalProperties: false
    }
  },
  {
    name: 'move_task',
    description: 'Move a task to a different sub-goal.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { task_id: { type: 'string' }, to_subgoal_id: { type: 'string' } },
      required: ['task_id', 'to_subgoal_id'],
      additionalProperties: false
    }
  },
  {
    name: 'reword_subgoal',
    description: 'Change the wording or why of an agreed sub-goal. Sub-goals can\'t be added or removed here.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { subgoal_id: { type: 'string' }, now: { type: 'string' }, why: { type: 'string' } },
      required: ['subgoal_id', 'now', 'why'],
      additionalProperties: false
    }
  }
];

// Each handler returns a short result Claude can read; errors become is_error results
function refineToolHandlers(draft) {
  return {
    add_task: ({ subgoal_id: subgoalId, task }) => {
      const created = draft.addTask(subgoalId, task);
      return `Added task ${created.id}.`;
    },
    replace_task: ({ task_id: taskId, task }) => {
      draft.updateTask(taskId, task);
      return `Replaced task ${taskId}.`;
    },
    remove_task: ({ task_id: taskId }) => {
      draft.removeTask(taskId);
      return `Removed task ${taskId}.`;
    },
    move_task: ({ task_id: taskId, to_subgoal_id: toSubgoalId }) => {
      draft.moveTask(taskId, toSubgoalId);
      return `Moved task ${taskId}.`;
    },
    reword_subgoal: ({ subgoal_id: subgoalId, now, why }) => {
      draft.updateSubgoal(subgoalId, { now, why });
      return `Reworded sub-goal ${subgoalId}.`;
    }
  };
}

module.exports = { refineToolDefinitions, refineToolHandlers };

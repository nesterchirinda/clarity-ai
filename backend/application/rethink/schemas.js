// JSON schemas for each pipeline stage (ADR12)
// Sent as structured outputs (output_config.format) so every reply is valid JSON
// in exactly this shape - no "reply with only JSON" instructions, no parse errors.
// Every object lists all its properties as required and sets additionalProperties
// to false, as structured outputs require.

const verdicts = ['New', 'Keep', 'Sharpen', 'Adjust', 'Focus', 'Done', 'Close', 'Park', 'Next year'];
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const stringList = { type: 'array', items: { type: 'string' } };

const classifySchema = {
  type: 'object',
  properties: {
    kind: { type: 'string', enum: ['task', 'subgoal', 'intention'] },
    intention_id: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    reason: { type: 'string' }
  },
  required: ['kind', 'intention_id', 'reason'],
  additionalProperties: false
};

const interviewSchema = {
  type: 'object',
  properties: {
    kind: { type: 'string', enum: ['question', 'ready'] },
    message: { type: 'string' },
    options: stringList,
    facts: stringList
  },
  required: ['kind', 'message', 'options', 'facts'],
  additionalProperties: false
};

const subgoalItem = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: verdicts },
    was: { type: 'string' },
    now: { type: 'string' },
    why: { type: 'string' }
  },
  required: ['verdict', 'was', 'now', 'why'],
  additionalProperties: false
};

const subgoalsSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    items: { type: 'array', items: subgoalItem },
    result: { type: 'string' }
  },
  required: ['message', 'items', 'result'],
  additionalProperties: false
};

const repeatRule = {
  type: 'object',
  properties: {
    days: { type: 'array', items: { type: 'string', enum: weekdays } },
    from: { type: 'string', format: 'date' },
    until: { type: 'string', format: 'date' },
    skip: { type: 'array', items: { type: 'string', format: 'date' } }
  },
  required: ['days', 'from', 'until', 'skip'],
  additionalProperties: false
};

const taskItem = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    due: { anyOf: [{ type: 'string', format: 'date' }, { type: 'null' }] },
    repeat: { anyOf: [repeatRule, { type: 'null' }] },
    template: { type: 'string' },
    existing: { type: 'boolean' },
    hours: { type: 'number' },
    subtasks: stringList
  },
  required: ['name', 'due', 'repeat', 'template', 'existing', 'hours', 'subtasks'],
  additionalProperties: false
};

const tasksSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    tasks: { type: 'array', items: taskItem }
  },
  required: ['message', 'tasks'],
  additionalProperties: false
};

module.exports = {
  verdicts,
  weekdays,
  classifySchema,
  interviewSchema,
  subgoalsSchema,
  tasksSchema,
  taskItem,
  repeatRule
};

// Adapter Pattern (GoF) - reads a user's planner from Notion for the rethink pipeline (ADR12)
// Uses the same four data sources as the rest of the app:
//   goal = intention, milestone = sub-goal, task, subtask
// Property types are detected rather than hard-coded where possible, so it copes with
// both the Clarity AI template and the ClarityWorks template. Relation property names
// can be overridden with environment variables.

const { detectRoutines } = require('../application/rethink/plannerContext.js');

const subgoalParentRelation = process.env.NOTION_SUBGOAL_PARENT_RELATION || 'Goal';
const taskParentRelation = process.env.NOTION_TASK_PARENT_RELATION || 'Milestone';

function titleOf(page) {
  const property = Object.values(page.properties || {}).find((item) => item.type === 'title');
  return property ? property.title.map((part) => part.plain_text || part.text?.content || '').join('').trim() : '';
}

function firstOfType(page, type) {
  return Object.values(page.properties || {}).find((item) => item.type === type) || null;
}

function relationIds(page, name) {
  const property = page.properties?.[name];
  return property && property.type === 'relation' ? property.relation.map((item) => item.id) : [];
}

function isDone(page) {
  const done = page.properties?.Done;
  if (done && done.type === 'checkbox') return done.checkbox;
  const status = firstOfType(page, 'status');
  return Boolean(status && status.status && /done|complete/i.test(status.status.name));
}

class NotionPlannerReader {
  // notion: a NotionAdapter; refs: { goalDataSourceId, milestoneDataSourceId, taskDataSourceId }
  constructor(notion, refs) {
    this.notion = notion;
    this.refs = refs;
  }

  async listIntentions() {
    const pages = await this.notion.queryDataSource(this.refs.goalDataSourceId);
    return pages.map((page) => ({ id: page.id, name: titleOf(page) })).filter((item) => item.name);
  }

  // Everything plannerContext needs for one intention
  async loadForIntention(intentionId, { today = new Date() } = {}) {
    const [intentions, subgoalPages, taskPages] = await Promise.all([
      this.listIntentions(),
      this.notion.queryDataSource(this.refs.milestoneDataSourceId),
      this.notion.queryDataSource(this.refs.taskDataSourceId, { sorts: [{ timestamp: 'created_time', direction: 'descending' }] })
    ]);

    const intention = intentions.find((item) => item.id === intentionId) || null;
    const subgoals = subgoalPages
      .filter((page) => relationIds(page, subgoalParentRelation).includes(intentionId))
      .map((page) => ({ id: page.id, name: titleOf(page), status: isDone(page) ? 'done' : 'open' }));
    const subgoalIds = new Set(subgoals.map((item) => item.id));

    const tasks = taskPages.map((page) => {
      const date = firstOfType(page, 'date');
      return {
        id: page.id,
        name: titleOf(page),
        createdAt: page.created_time,
        due: date && date.date ? date.date.start : null,
        done: isDone(page),
        parentIds: relationIds(page, taskParentRelation)
      };
    });

    const openTasks = tasks.filter((task) => !task.done && task.parentIds.some((id) => subgoalIds.has(id)));
    return {
      intention,
      intentions,
      subgoals,
      openTasks,
      routines: detectRoutines(tasks, { today }),
      existingTaskNames: tasks.filter((task) => !task.done).map((task) => task.name)
    };
  }
}

module.exports = { NotionPlannerReader, titleOf };

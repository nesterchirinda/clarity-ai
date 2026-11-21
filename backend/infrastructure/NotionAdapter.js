// Adapter Pattern (GoF) - only file that knows Notion's page and property format
//
// Property names (must match each Notion database exactly):
//   Goal:      Name, Description, Target Date
//   Milestone: Name, Description, Due Date, Goal (relation)
//   Task:      Name, Description, Due Date, Priority, Energy Level, Estimated Time,
//              Milestone (relation)
//   Subtask:   Name, Description, Estimated Time, Task (relation)

const { timeInMinutes, defaultMinutes, getTimeEstimate } = require('../application/decomposition/estimatedTime.js');

const notionBaseUrl = 'https://api.notion.com/v1';
const notionVersion = process.env.NOTION_API_VERSION || '2026-03-11';

class NotionAdapter {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  // Sanity-checks a data source is reachable before anything gets written to it
  async getDataSource(dataSourceId) {
    return this._request(`/data_sources/${dataSourceId}`);
  }

  async _request(path, options = {}) {
    const response = await fetch(`${notionBaseUrl}${path}`, {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Notion-Version': notionVersion,
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('[NotionAdapter] notion api error:', path, response.status, data?.message);
      throw new Error(data?.message || `Notion API error (${response.status})`);
    }
    return data;
  }


  // property builders - turn plain data into Notion's property shape
  _title(value) {
    return { title: [{ text: { content: value } }] };
  }

  _richText(value) {
    return { rich_text: [{ text: { content: value || '' } }] };
  }

  _select(value) {
    return { select: value ? { name: value } : null };
  }

  _date(isoDate) {
    return { date: isoDate ? { start: isoDate } : null };
  }

  _relation(pageIds) {
    return { relation: pageIds.map((id) => ({ id })) };
  }

  _goalProperties(goal) {
    const properties = {
      Name: this._title(goal.title),
      Description: this._richText(goal.description)
    };
    if (goal.targetDate) properties['Target Date'] = this._date(goal.targetDate);
    return properties;
  }

  _milestoneProperties(milestone, number) {
    const properties = {
      Name: this._title(`${number}. ${milestone.title}`),
      Description: this._richText(milestone.description)
    };
    if (milestone.dueDate) properties['Due Date'] = this._date(milestone.dueDate);
    return properties;
  }

  // Falls back to the task's own AI guess only until it has real subtasks to sum
  _resolveTaskEstimatedTime(task) {
    const hasSubtasks = Array.isArray(task.subtasks) && task.subtasks.length > 0;
    if (!hasSubtasks) return task.estimatedTime || '';
    const totalMinutes = task.subtasks.reduce(
      (sum, subtask) => sum + (timeInMinutes[subtask.estimatedTime] ?? defaultMinutes),
      0
    );
    return getTimeEstimate(totalMinutes);
  }

  _taskProperties(task, number) {
    const properties = {
      Name: this._title(`${number}. ${task.title}`),
      Description: this._richText(task.description),
      Priority: this._select(task.priority),
      'Energy Level': this._select(task.energyLevel)
    };
    if (task.dueDate) properties['Due Date'] = this._date(task.dueDate);
    const estimatedTime = this._resolveTaskEstimatedTime(task);
    if (estimatedTime) properties['Estimated Time'] = this._select(estimatedTime);
    return properties;
  }

  // Named "task position.subtask position" so a flat Notion list still shows what belongs to what
  _subtaskProperties(subtask, taskNumber, number) {
    const properties = {
      Name: this._title(`${taskNumber}.${number} ${subtask.title}`),
      Description: this._richText(subtask.description)
    };
    if (subtask.estimatedTime) properties['Estimated Time'] = this._select(subtask.estimatedTime);
    return properties;
  }


  // page writing
  // Optionally links the new page to a parent via a relation property
  async _createPage(dataSourceId, properties, parent) {
    const finalProperties = { ...properties };
    if (parent && parent.parentPageId) {
      finalProperties[parent.relationProperty] = this._relation([parent.parentPageId]);
    }
    return this._request('/pages', {
      method: 'POST',
      body: {
        parent: { type: 'data_source_id', data_source_id: dataSourceId },
        properties: finalProperties
      }
    });
  }

  // Writes the goal/milestone/task/subtask tree page by page, in hierarchy order
  async syncHierarchy(dataSourceRefs, hierarchy) {
    let milestoneCount = 0;
    let taskCount = 0;
    let subtaskCount = 0;
    const goalPage = await this._createPage(
      dataSourceRefs.goalDataSourceId,
      this._goalProperties(hierarchy.goal)
    );

    for (const [milestoneIndex, milestone] of hierarchy.milestones.entries()) {
      const milestonePage = await this._createPage(
        dataSourceRefs.milestoneDataSourceId,
        this._milestoneProperties(milestone, milestoneIndex + 1),
        { relationProperty: 'Goal', parentPageId: goalPage.id }
      );
      milestoneCount += 1;

      for (const [taskIndex, task] of milestone.tasks.entries()) {
        const taskPage = await this._createPage(
          dataSourceRefs.taskDataSourceId,
          this._taskProperties(task, taskIndex + 1),
          { relationProperty: 'Milestone', parentPageId: milestonePage.id }
        );
        taskCount += 1;

        for (const [subtaskIndex, subtask] of task.subtasks.entries()) {
          await this._createPage(
            dataSourceRefs.subtaskDataSourceId,
            this._subtaskProperties(subtask, taskIndex + 1, subtaskIndex + 1),
            { relationProperty: 'Task', parentPageId: taskPage.id }
          );
          subtaskCount += 1;
        }
      }
    }

    return { goalPageId: goalPage.id, milestoneCount, taskCount, subtaskCount };
  }
}

module.exports = { NotionAdapter };

// Custom error type so callers can tell a bad-shape answer apart from any other error
class ValidationError extends Error {
  constructor(userMessage) {
    super(userMessage);
    this.name = 'ValidationError';
    this.userMessage = userMessage;
  }
}

// Checks the shape of the model's answer before it moves to the next step
class PlanValidator {
  validateMilestones(milestones) {
    this._validateItems(milestones, 'milestone');
    return milestones;
  }

  validateTasks(tasks) {
    this._validateItems(tasks, 'task');
    return tasks;
  }

  // Can be empty, unlike milestones or tasks - a task can be a single clear action
  validateSubtasks(subtasks) {
    this._validateItems(subtasks, 'subtask', true);
    return subtasks;
  }

  // Shared by all three above - must be a list, and every item needs a title
  _validateItems(items, tierLabel, allowEmpty = false) {
    if (!Array.isArray(items) || (!allowEmpty && items.length === 0)) {
      console.error(`[PlanValidator] no ${tierLabel}s returned`);
      throw new ValidationError('Something went wrong. Try again.');
    }

    items.forEach((item, position) => {
      if (!item || typeof item !== 'object') {
        console.error(`[PlanValidator] ${tierLabel} ${position + 1} came back malformed`);
        throw new ValidationError('Something went wrong. Try again.');
      }
      if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
        console.error(`[PlanValidator] ${tierLabel} ${position + 1} missing a title`);
        throw new ValidationError('Something went wrong. Try again.');
      }
    });
  }
}

module.exports = { PlanValidator, ValidationError };

// The shared "build prompt -> ask the model -> parse the answer" flow every decomposition
// step follows, plus the four step configs (prompt + buildPrompt + parseResponse) that use it

const { parseJsonObject, parseJsonArray } = require('./parseJson.js');
const { normalizeOption } = require('./normalizeOption.js');
const { estimatedTimeOptions } = require('./estimatedTime.js');
const { goalPrompt } = require('../prompts/goalPrompt.js');
const { milestonePrompt } = require('../prompts/milestonePrompt.js');
const { energyLevelOptions, taskPrompt } = require('../prompts/taskPrompt.js');
const { subtaskPrompt } = require('../prompts/subtaskPrompt.js');

async function runDecompositionStep(planningService, step, input) {
  const prompt = step.buildPrompt(input);
  const text = await planningService.complete(prompt, { systemPrompt: step.systemPrompt });
  return step.parseResponse(text, input);
}

// Turns the saved conversation into one Goal, the first step before any milestones exist
const goalStep = {
  systemPrompt: goalPrompt,
  buildPrompt({ conversationHistory }) {
    const transcript = conversationHistory
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');
    return `Conversation:\n${transcript}\n\nReturn the goal JSON object now.`;
  },
  parseResponse(text) {
    return parseJsonObject(text, 'Failed to parse the goal as JSON');
  }
};

// Turns one Goal into a list of Milestones using the model
const milestoneStep = {
  systemPrompt: milestonePrompt,
  buildPrompt({ goal, conversationHistory, refinementNote }) {
    let contextBlock = '';
    if (conversationHistory && conversationHistory.length) {
      const transcript = conversationHistory
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n');
      contextBlock = `Conversation so far:\n${transcript}`;
    }

    const today = new Date().toISOString().slice(0, 10);
    return [
      `Goal: ${goal.title}`,
      goal.description ? `Details: ${goal.description}` : '',
      `Today's date: ${today}`,
      goal.targetDate ? `Goal target date: ${goal.targetDate}` : "No target date was given for this goal.",
      contextBlock,
      // Kept on its own line so it doesn't get lost inside the conversation block
      refinementNote
        ? `The user's most recent request for this regeneration: "${refinementNote}". Apply it.`
        : '',
      'Return the milestone JSON array now.'
    ]
      .filter(Boolean)
      .join('\n\n');
  },
  parseResponse(text, { goal }) {
    return parseJsonArray(text, `Failed to parse milestone breakdown for goal "${goal.title}" as JSON`);
  }
};

// Turns one Milestone into a list of Tasks
const taskStep = {
  systemPrompt: taskPrompt,
  buildPrompt({ milestone, refinementNote, otherMilestoneTitles, windowStart, windowEnd }) {
    return [
      `Milestone: ${milestone.title}`,
      milestone.description ? `Details: ${milestone.description}` : '',
      otherMilestoneTitles && otherMilestoneTitles.length
        ? `The goal's other milestones (not this one): ${otherMilestoneTitles.join(', ')}`
        : '',
      windowStart && windowEnd
        ? `This milestone's tasks must fit between ${windowStart} (window start) and ${windowEnd} (this milestone's own due date).`
        : "No dated window was given for this milestone - leave every task's dueDate as an empty string.",
      // Kept on its own line so a redo reacts to the actual complaint, not a fresh guess
      refinementNote
        ? `The user's most recent request for this regeneration: "${refinementNote}". Apply it if it's relevant to this milestone's tasks.`
        : '',
      'Return the task JSON object now.'
    ]
      .filter(Boolean)
      .join('\n\n');
  },
  // Also normalizes energyLevel/estimatedTime against the fixed option lists
  parseResponse(text, { milestone }) {
    const parsed = parseJsonObject(
      text,
      `Failed to parse task breakdown for milestone "${milestone.title}" as JSON`
    );
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    tasks.forEach((task) => {
      task.energyLevel = normalizeOption(task.energyLevel, energyLevelOptions) ?? '';
      task.estimatedTime = normalizeOption(task.estimatedTime, estimatedTimeOptions) ?? '';
    });
    return { tasks };
  }
};

// Turns one Task into a list of Subtasks using the model
const subtaskStep = {
  systemPrompt: subtaskPrompt,
  buildPrompt({ task, refinementNote }) {
    return [
      `Task: ${task.title}`,
      task.description ? `Details: ${task.description}` : '',
      refinementNote
        ? `The user's most recent request for this regeneration: "${refinementNote}". Apply it if it's relevant to this task's subtasks.`
        : '',
      'Return the subtask JSON array now.'
    ]
      .filter(Boolean)
      .join('\n\n');
  },
  // Also normalizes estimatedTime against the fixed option list
  parseResponse(text, { task }) {
    const subtasks = parseJsonArray(
      text,
      `Failed to parse subtask breakdown for task "${task.title}" as JSON`
    );
    subtasks.forEach((subtask) => {
      subtask.estimatedTime = normalizeOption(subtask.estimatedTime, estimatedTimeOptions) ?? '';
    });
    return subtasks;
  }
};

module.exports = { runDecompositionStep, goalStep, milestoneStep, taskStep, subtaskStep };

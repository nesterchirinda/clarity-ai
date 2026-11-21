// Checks a plan against the rules code can verify (ADR12)
// Two kinds of result:
//   - fixes: mechanical problems corrected here, silently (no model call needed)
//   - violations: judgement problems sent back to Claude once to repair
// Rules that need judgement ("would a mentor do this?") belong in the evals, not here.

const { expandRepeat, parseIsoDay, yearEndFor, startOfDayUtc } = require('./repeatDates.js');
const { inactiveVerdicts } = require('./PlanDraft.js');

const months = 'january|february|march|april|may|june|july|august|september|october|november|december';

// Outcomes decided by other people or luck - plan the inputs instead
const outsideControl = new RegExp(
  [
    '\\bbe (offered|hired|selected|accepted|chosen|promoted)\\b',
    '\\b(get|land|receive|secure|win) (an? |the )?(offer|job|role|interview|place|promotion)s?\\b',
    '\\baccept (an? |the )?(offer|role|job)\\b',
    '\\b(complete|attend|secure|get) \\d+ (interviews?|screening calls?)\\b',
    '\\bstart (an? |the )?(new )?(role|job)\\b'
  ].join('|'),
  'i'
);

// Support work belongs inside the sub-goal it supports, not as its own sub-goal
const supportSubgoal = /^(track|record|review|monitor|reflect|set up|plan|check in|reward)\b/i;

const pronoun = /\byour\b/i;
const startsLikeAVerb = /^[A-Z][a-z']+\b/;
const notAVerb = /^(your|my|the|a|an|this|that|weekly|daily|monthly|first|new|one|two|three)\b/i;

function mentionsNextYear(text, today) {
  const year = today.getUTCFullYear();
  const later = String(text).match(/\b(20\d{2})\b/g) || [];
  return later.some((found) => Number(found) > year);
}

function mentionsAnyDate(text) {
  return new RegExp(`\\b(\\d{1,2} (${months})|(${months}) \\d{1,2}|20\\d{2}|by (the )?end of)\\b`, 'i').test(text);
}

function checkSubgoals(items, { today = new Date() } = {}) {
  const todayUtc = startOfDayUtc(today);
  const violations = [];
  const thisYear = items.filter((item) => !inactiveVerdicts.includes(item.verdict));

  if (thisYear.length < 1) violations.push({ rule: 'focus', message: 'There are no sub-goals for this year.' });
  if (thisYear.length > 5) violations.push({ rule: 'focus', message: `There are ${thisYear.length} sub-goals for this year; keep 2 to 5 and park the rest.` });

  items.forEach((item) => {
    const where = `Sub-goal "${item.now}"`;
    if (item.verdict === 'Next year') {
      if (mentionsAnyDate(item.now)) violations.push({ rule: 'next-year-undated', message: `${where} is for next year, so it must have no date.` });
      return;
    }
    if (inactiveVerdicts.includes(item.verdict)) return;
    if (mentionsNextYear(item.now, todayUtc)) violations.push({ rule: 'year-end', message: `${where} reaches into next year; it must finish by 31 December or move to Next year.` });
    if (outsideControl.test(item.now)) violations.push({ rule: 'in-control', message: `${where} depends on other people's decisions; plan the user's own actions instead.` });
    if (supportSubgoal.test(item.now)) violations.push({ rule: 'support-inside', message: `${where} is support work; make it tasks inside the sub-goal it supports.` });
    if (pronoun.test(item.now)) violations.push({ rule: 'todo-wording', message: `${where} uses "your"; write it like the user's own to-do list.` });
  });

  return { violations };
}

// tasks: the tasks for one sub-goal. ctx.existingTaskNames: names already in the planner.
function checkTasks(tasks, { today = new Date(), existingTaskNames = [], weeklyHourLimit = null } = {}) {
  const todayUtc = startOfDayUtc(today);
  const yearEnd = yearEndFor(todayUtc);
  const fixes = [];
  const violations = [];
  const seen = new Set();
  const existing = new Set(existingTaskNames.map((name) => name.toLowerCase().trim()));

  const fixed = tasks.map((original) => {
    const task = { ...original, subtasks: [...(original.subtasks || [])] };
    const where = `Task "${task.name}"`;

    // mechanical fixes
    if (task.template && task.subtasks.length) {
      task.subtasks = [];
      fixes.push(`${where}: removed subtasks because the template holds the steps`);
    }
    if (task.repeat && parseIsoDay(task.repeat.until) > yearEnd) {
      task.repeat = { ...task.repeat, until: yearEnd.toISOString().slice(0, 10) };
      fixes.push(`${where}: repeat now ends on 31 December`);
    }
    if (task.repeat && task.due) {
      task.due = null;
      fixes.push(`${where}: a repeating task has no single due date`);
    }

    // judgement problems
    const due = parseIsoDay(task.due);
    if (due && due > yearEnd) violations.push({ rule: 'year-end', message: `${where} is due after 31 December.` });
    if (due && due < todayUtc) violations.push({ rule: 'past-date', message: `${where} is due in the past.` });
    if (!task.repeat && !task.due && !task.existing) violations.push({ rule: 'dated', message: `${where} needs a due date or a repeat rule.` });
    if (task.repeat && expandRepeat(task.repeat, { today: todayUtc }).length === 0) violations.push({ rule: 'dated', message: `${where} repeats but no dates fall before 31 December.` });
    if (!startsLikeAVerb.test(task.name) || notAVerb.test(task.name)) violations.push({ rule: 'verb-first', message: `${where} should start with a verb.` });
    if (pronoun.test(task.name) || task.subtasks.some((step) => pronoun.test(step))) violations.push({ rule: 'todo-wording', message: `${where} uses "your"; write it like the user's own to-do list.` });
    if (outsideControl.test(task.name)) violations.push({ rule: 'in-control', message: `${where} depends on other people's decisions.` });
    if (task.existing && !existing.has(task.name.toLowerCase().trim())) violations.push({ rule: 'existing', message: `${where} is marked existing but isn't in the planner; use the exact name or create it as new.` });

    const key = task.name.toLowerCase().trim();
    if (seen.has(key)) violations.push({ rule: 'duplicate', message: `${where} appears twice.` });
    seen.add(key);
    return task;
  });

  if (weeklyHourLimit) {
    const hours = weeklyNewHours(fixed, todayUtc);
    if (hours > weeklyHourLimit) {
      violations.push({ rule: 'capacity', message: `These tasks add about ${hours.toFixed(1)} hours a week; keep new work under ${weeklyHourLimit} hours a week.` });
    }
  }

  return { tasks: fixed, fixes, violations };
}

// Busiest-week estimate of new hours: repeats count per occurrence, one-offs once
function weeklyNewHours(tasks, today) {
  const byWeek = new Map();
  const add = (iso, hours) => {
    const date = parseIsoDay(iso);
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    byWeek.set(key, (byWeek.get(key) || 0) + hours);
  };
  tasks.forEach((task) => {
    if (task.existing || !task.hours) return;
    if (task.repeat) expandRepeat(task.repeat, { today }).forEach((iso) => add(iso, task.hours));
    else if (task.due) add(task.due, task.hours);
  });
  return byWeek.size ? Math.max(...byWeek.values()) : 0;
}

function describeViolations(violations) {
  return violations.map((violation) => `- ${violation.message}`).join('\n');
}

module.exports = { checkSubgoals, checkTasks, weeklyNewHours, describeViolations };

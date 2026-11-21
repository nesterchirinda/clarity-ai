// Builds what Claude knows about this user's planner (ADR12)
// Works for any user: every list can be empty, and routines are detected from the
// user's own tasks rather than assumed.

const { startOfDayUtc } = require('./repeatDates.js');

// Replace Magic Number with Named Constant (Martin)
const routineMinCount = 3;
const routineWindowDays = 56;

// A routine is a task name the user has created at least 3 times in the last 8 weeks
function detectRoutines(tasks, { today = new Date() } = {}) {
  const cutoff = startOfDayUtc(today);
  cutoff.setUTCDate(cutoff.getUTCDate() - routineWindowDays);
  const counts = new Map();
  tasks.forEach((task) => {
    const created = task.createdAt ? new Date(task.createdAt) : null;
    if (!created || created < cutoff || !task.name) return;
    const key = task.name.trim();
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()]
    .filter(([, count]) => count >= routineMinCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

function list(items, empty) {
  return items && items.length ? items.join('; ') : empty;
}

// data: { today, intention, intentions, subgoals, openTasks, routines, templates, profile, facts }
function buildPlannerContext(data) {
  const today = data.today || new Date();
  const yearEnd = new Date(Date.UTC(today.getUTCFullYear(), 11, 31));
  const weeksLeft = Math.max(1, Math.round((yearEnd - startOfDayUtc(today)) / (7 * 24 * 3600 * 1000)));
  const lines = [
    `Today is ${today.toISOString().slice(0, 10)} (${today.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' })}). About ${weeksLeft} weeks remain in the year.`,
    data.intention ? `Intention we are working on: "${data.intention.name}" (life domain: ${data.intention.domain || 'unknown'}).` : null,
    data.intentions ? `All intentions: ${list(data.intentions.map((item) => `${item.id}: ${item.name}`), 'none')}.` : null,
    `Existing sub-goals under this intention: ${list((data.subgoals || []).map((item) => `"${item.name}"${item.status ? ` (${item.status})` : ''}`), 'none')}.`,
    `Open tasks related to this intention: ${list((data.openTasks || []).map((item) => `"${item.name}"${item.due ? ` due ${item.due}` : ''}`), 'none')}.`,
    `Routines the user currently repeats: ${list(data.routines, 'none yet')}.`,
    `Task templates the user has: ${list(data.templates, 'none, so leave template empty')}.`,
    data.profile ? `About the user: ${data.profile}` : null,
    data.facts && data.facts.length ? `Facts learned in earlier conversations: ${data.facts.join('; ')}.` : null
  ];
  return lines.filter(Boolean).join('\n');
}

module.exports = { detectRoutines, buildPlannerContext };

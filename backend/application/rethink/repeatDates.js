// Turns a repeat rule from the model into real dates (ADR12)
// The model says which days and between which dates; code works out the dates,
// so a wrong weekday or a date in next year can never reach the planner.

const dayNumbers = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

// Replace Magic Number with Named Constant (Martin) - a safety cap on runaway rules
const maxOccurrences = 120;

function parseIsoDay(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function toIsoDay(date) {
  return date.toISOString().slice(0, 10);
}

function startOfDayUtc(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function yearEndFor(today) {
  return new Date(Date.UTC(today.getUTCFullYear(), 11, 31));
}

// repeat: { days: ['Mon','Thu'], from: 'YYYY-MM-DD', until: 'YYYY-MM-DD', skip: ['YYYY-MM-DD'] }
// Returns ISO dates, never before today and never after 31 December of this year.
function expandRepeat(repeat, { today = new Date() } = {}) {
  if (!repeat || !Array.isArray(repeat.days)) return [];
  const todayUtc = startOfDayUtc(today);
  const yearEnd = yearEndFor(todayUtc);

  let from = parseIsoDay(repeat.from) || todayUtc;
  let until = parseIsoDay(repeat.until) || yearEnd;
  if (from < todayUtc) from = todayUtc;
  if (until > yearEnd) until = yearEnd;

  const wanted = new Set(
    repeat.days
      .map((day) => dayNumbers[String(day).slice(0, 3).toLowerCase()])
      .filter((day) => day !== undefined)
  );
  const skipped = new Set((repeat.skip || []).map((day) => String(day).slice(0, 10)));

  const dates = [];
  for (let day = new Date(from); day <= until && dates.length < maxOccurrences; day.setUTCDate(day.getUTCDate() + 1)) {
    const iso = toIsoDay(day);
    if (wanted.has(day.getUTCDay()) && !skipped.has(iso)) dates.push(iso);
  }
  return dates;
}

module.exports = { expandRepeat, parseIsoDay, toIsoDay, yearEndFor, startOfDayUtc };

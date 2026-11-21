// Unit tests for the parts of the rethink pipeline that run in code (ADR12)
// Arrange, Act, Assert - no network, no model calls

const { expandRepeat } = require('../application/rethink/repeatDates.js');
const { checkSubgoals, checkTasks, weeklyNewHours } = require('../application/rethink/PlanChecker.js');
const { PlanDraft, DraftError } = require('../application/rethink/PlanDraft.js');
const { detectRoutines, buildPlannerContext } = require('../application/rethink/plannerContext.js');

const today = new Date(Date.UTC(2026, 10, 21)); // Saturday 21 November 2026

const task = (overrides = {}) => ({ name: 'Book the GP appointment', due: '2026-11-25', repeat: null, template: '', existing: false, hours: 0.5, subtasks: [], ...overrides });


describe('expandRepeat', () => {
  test('should create one date per matching weekday until 31 December', () => {
    // ACT
    const dates = expandRepeat({ days: ['Mon'], from: '2026-11-23', until: '2027-02-01', skip: [] }, { today });

    // ASSERT
    expect(dates).toEqual(['2026-11-23', '2026-11-30', '2026-12-07', '2026-12-14', '2026-12-21', '2026-12-28']);
  });

  test('should never start before today and should leave out skipped dates', () => {
    const dates = expandRepeat({ days: ['Fri', 'Sat'], from: '2026-11-01', until: '2026-12-31', skip: ['2026-12-26'] }, { today });

    expect(dates[0]).toBe('2026-11-21');
    expect(dates).not.toContain('2026-12-26');
    expect(dates).toContain('2026-12-25');
  });

  test('should return no dates for a rule with no valid days', () => {
    expect(expandRepeat({ days: ['Someday'], from: '2026-11-23', until: '2026-12-31', skip: [] }, { today })).toEqual([]);
  });
});


describe('checkSubgoals', () => {
  test('should flag outcomes other people decide', () => {
    const { violations } = checkSubgoals([{ verdict: 'New', now: 'Complete 3 interviews by 31 December' }], { today });

    expect(violations.map((item) => item.rule)).toContain('in-control');
  });

  test('should flag a next-year item that has a date', () => {
    const { violations } = checkSubgoals([
      { verdict: 'New', now: 'Send 15 tailored applications by 31 December' },
      { verdict: 'Next year', now: 'Build muscle definition by 30 June 2027' }
    ], { today });

    expect(violations.map((item) => item.rule)).toEqual(['next-year-undated']);
  });

  test('should flag support work written as a sub-goal and "your" in wording', () => {
    const { violations } = checkSubgoals([
      { verdict: 'New', now: 'Record and review your progress until 31 December (ongoing)' }
    ], { today });

    expect(violations.map((item) => item.rule)).toEqual(expect.arrayContaining(['support-inside', 'todo-wording']));
  });

  test('should accept a focused, controllable plan', () => {
    const { violations } = checkSubgoals([
      { verdict: 'New', now: 'See the GP by 5 December' },
      { verdict: 'New', now: 'Train 3 times a week until 31 December (ongoing)' },
      { verdict: 'Park', now: 'Park the rest' },
      { verdict: 'Next year', now: 'Build visible muscle definition' }
    ], { today });

    expect(violations).toEqual([]);
  });
});


describe('checkTasks', () => {
  test('should fix mechanical problems without asking the model', () => {
    const { tasks, fixes, violations } = checkTasks([
      task({ name: 'Lower body day', due: '2026-11-30', template: 'Lower body day', subtasks: ['Warm up'], repeat: { days: ['Mon'], from: '2026-11-23', until: '2027-03-01', skip: [] } })
    ], { today });

    expect(tasks[0].subtasks).toEqual([]);
    expect(tasks[0].repeat.until).toBe('2026-12-31');
    expect(tasks[0].due).toBeNull();
    expect(fixes).toHaveLength(3);
    expect(violations).toEqual([]);
  });

  test('should flag dates after the year, missing dates, pronouns, duplicates and unknown existing tasks', () => {
    const { violations } = checkTasks([
      task({ due: '2027-01-10' }),
      task({ name: 'Measure your waist', due: null }),
      task({ name: 'Book the GP appointment' }),
      task({ name: 'Reflect & Plan next week', due: null, existing: true })
    ], { today, existingTaskNames: ['Weekly Finances audit'] });

    expect(violations.map((item) => item.rule)).toEqual(expect.arrayContaining(['year-end', 'dated', 'todo-wording', 'duplicate', 'existing']));
  });

  test('should flag tasks that do not start with a verb', () => {
    const { violations } = checkTasks([task({ name: 'Weekly walk', due: '2026-11-26' })], { today });

    expect(violations.map((item) => item.rule)).toEqual(['verb-first']);
  });

  test('should flag too many new hours in a week', () => {
    const { violations } = checkTasks([
      task({ name: 'Run 5k', due: null, hours: 2, repeat: { days: ['Mon', 'Wed', 'Fri', 'Sun'], from: '2026-11-23', until: '2026-12-31', skip: [] } })
    ], { today, weeklyHourLimit: 6 });

    expect(violations.map((item) => item.rule)).toEqual(['capacity']);
  });

  test('weeklyNewHours should count the busiest week, ignoring existing tasks', () => {
    const hours = weeklyNewHours([
      task({ hours: 1, due: '2026-11-24' }),
      task({ name: 'Walk', hours: 1, due: null, repeat: { days: ['Tue', 'Thu'], from: '2026-11-23', until: '2026-12-31', skip: [] } }),
      task({ name: 'Reflect & Plan next week', hours: 3, due: null, existing: true })
    ], today);

    expect(hours).toBe(3);
  });
});


describe('PlanDraft', () => {
  function draftWithSubgoals() {
    const draft = new PlanDraft({ intention: { id: 'i1', name: "I'm strong" } });
    draft.setSubgoals([
      { verdict: 'New', was: '', now: 'See the GP by 5 December', why: 'Overdue.' },
      { verdict: 'New', was: '', now: 'Train 3 times a week until 31 December (ongoing)', why: 'Start small.' },
      { verdict: 'Next year', was: '', now: 'Build muscle definition', why: 'Takes months.' }
    ]);
    return draft;
  }

  test('should only treat this year\'s sub-goals as active', () => {
    expect(draftWithSubgoals().activeSubgoals()).toHaveLength(2);
  });

  test('should refuse to replace sub-goals once they are agreed', () => {
    const draft = draftWithSubgoals();
    draft.lockSubgoals();

    expect(() => draft.setSubgoals([])).toThrow(DraftError);
  });

  test('should add, update, move and remove tasks by id', () => {
    const draft = draftWithSubgoals();
    const [gp, train] = draft.activeSubgoals();
    const created = draft.addTask(gp.id, task());

    draft.updateTask(created.id, { name: 'Call the surgery at 8am' });
    expect(draft.findTask(created.id).task.name).toBe('Call the surgery at 8am');

    draft.moveTask(created.id, train.id);
    expect(draft.findTask(created.id).subgoal.id).toBe(train.id);

    draft.removeTask(created.id);
    expect(() => draft.findTask(created.id)).toThrow(DraftError);
  });

  test('should not add tasks to a next-year sub-goal or change a sub-goal\'s verdict', () => {
    const draft = draftWithSubgoals();
    const nextYear = draft.toJSON().subgoals[2];

    expect(() => draft.addTask(nextYear.id, task())).toThrow(DraftError);
    expect(() => draft.updateSubgoal(nextYear.id, { verdict: 'New' })).toThrow(DraftError);
  });

  test('should go back to the version saved before a message', () => {
    const draft = draftWithSubgoals();
    const [gp] = draft.activeSubgoals();
    draft.checkpoint('u4');
    draft.addTask(gp.id, task());
    draft.checkpoint('u6');
    draft.addTask(gp.id, task({ name: 'Write down questions' }));

    draft.restore('u4');

    expect(draft.activeSubgoals()[0].tasks).toHaveLength(0);
    expect(draft.toJSON().versions).toHaveLength(0);
  });

  test('should survive a round trip through JSON', () => {
    const draft = draftWithSubgoals();
    expect(PlanDraft.fromJSON(draft.toJSON()).toJSON()).toEqual(draft.toJSON());
  });
});


describe('plannerContext', () => {
  test('detectRoutines should find task names repeated 3 or more times in 8 weeks', () => {
    const created = (daysAgo) => new Date(today.getTime() - daysAgo * 86400000).toISOString();
    const tasks = [
      { name: 'Weekly Finances audit', createdAt: created(3) },
      { name: 'Weekly Finances audit', createdAt: created(10) },
      { name: 'Weekly Finances audit', createdAt: created(17) },
      { name: 'Old habit', createdAt: created(70) },
      { name: 'Old habit', createdAt: created(71) },
      { name: 'Old habit', createdAt: created(72) },
      { name: 'One-off', createdAt: created(1) }
    ];

    expect(detectRoutines(tasks, { today })).toEqual(['Weekly Finances audit']);
  });

  test('buildPlannerContext should say so when a new user has nothing yet', () => {
    const text = buildPlannerContext({ today, intention: { name: "I'm calm", domain: 'Health' } });

    expect(text).toContain('Routines the user currently repeats: none yet');
    expect(text).toContain('none, so leave template empty');
    expect(text).toContain('2026-11-21');
  });
});

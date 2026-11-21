// Made-up users for measuring plan quality (ADR12)
// Each persona has a planner, scripted answers for the interview, and checks a good
// mentor's plan would pass. Code checks are exact; `rubric` is graded by a Claude judge.

const personas = [
  {
    id: 'career-failed-probation',
    planner: {
      intention: { id: 'i-career', name: "I'm a trusted, confident professional", domain: 'Career' },
      subgoals: [{ name: 'Pass graduate probation', status: 'open' }],
      openTasks: [{ name: 'Update professional CV' }, { name: 'Finish AI Academy module 1' }],
      routines: [],
      templates: []
    },
    answers: [
      'Landing the right role',
      'I failed probation at my last job and have to find another job. I think I want product owner or business analyst roles.',
      "I'm not sure what skills I'm missing for product roles"
    ],
    mustMention: [/reflect|feedback|what went wrong|direction/i, /cv|linkedin/i, /appl/i, /skill|learn|study|course|practi[cs]e/i],
    mustNotMention: [/\binterviews? (offered|booked)\b|\bget (an? )?offer\b|accept (an? )?(offer|role)/i],
    rubric: 'Probation is closed as not passed, not achieved. Reflection and choosing a direction come before mass applying. Upskilling for product roles is planned with specific topics. Nothing depends on employers\' decisions.'
  },
  {
    id: 'health-motivation',
    planner: {
      intention: { id: 'i-health', name: "I'm strong, healthy and I love my body", domain: 'Health' },
      subgoals: [],
      openTasks: [{ name: 'GP Appointment', due: '2026-11-12' }],
      routines: ['Reflect & Plan next week', 'Meal Plan, Shopping & Prep', 'Lower body day'],
      templates: ['Lower body day', 'Core & upper body', 'Full body Friday', 'Reflect & Plan next week']
    },
    answers: ['Feeling proud of my body and seeing a visible change', 'My motivation dips after a few weeks', 'I can do 3 short sessions a week'],
    mustMention: [/gp|doctor/i],
    mustNotMention: [/\b(4|four|5|five) times a week\b/i],
    rubric: 'The overdue GP appointment comes first. Training starts at a level kept on a bad week. Tracking and rewards are tasks, not sub-goals. Existing routines are reused, not duplicated. Weekly load is spread across days.'
  },
  {
    id: 'new-user-no-data',
    planner: {
      intention: { id: 'i-speak', name: "I'm a confident public speaker", domain: 'Personal Development' },
      subgoals: [],
      openTasks: [],
      routines: [],
      templates: []
    },
    answers: ['Speaking up in meetings without panicking', 'I have a team presentation on 15 December', 'Evenings are busy, mornings are free'],
    mustMention: [/practi[cs]e|rehears/i, /15 december|presentation/i],
    mustNotMention: [],
    rubric: 'Works with no planner data. Builds up to the 15 December presentation with practice. Uses mornings. Nothing depends on other people\'s reactions.'
  },
  {
    id: 'finances-lost-income',
    planner: {
      intention: { id: 'i-money', name: "I'm financially stable and in control of my money", domain: 'Finances' },
      subgoals: [{ name: 'Pay off 50% of credit card debt', status: 'open' }, { name: 'Save first £500 of emergency fund', status: 'open' }],
      openTasks: [{ name: 'Return Tkmaxx purchases' }],
      routines: ['Weekly Finances audit'],
      templates: ['Money Mondays']
    },
    answers: ['Knowing where my money goes and having a safety net', "I've just lost my only income and have £3,000 in savings", 'About £1,000 a month on essentials'],
    mustMention: [/paid work|any work|temp|part-time|income/i, /budget|track/i],
    mustNotMention: [/pay off 50%.*31 december/i],
    rubric: 'Any paid work comes first and sits under Finances. Paying off half the card this year is moved to next year. The plan reasons about how long £3,000 lasts at £1,000 a month. The weekly finances audit is reused.'
  },
  {
    id: 'student-result-after-year-end',
    planner: {
      intention: { id: 'i-grad', name: "I'm a first-class graduate", domain: 'Personal Development' },
      subgoals: [{ name: 'Submit dissertation', status: 'open' }],
      openTasks: [],
      routines: [],
      templates: []
    },
    answers: ['Getting a first', 'My dissertation is due on 20 January and marks come out in March', 'I have written about a third of it'],
    mustMention: [/draft|chapter|write/i],
    mustNotMention: [/get (a )?first by 31 december/i],
    rubric: 'Getting a first is not a this-year outcome (marks come in March); this year is about drafting progress the student controls, with a realistic word count per week.'
  }
];

module.exports = { personas };

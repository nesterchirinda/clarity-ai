// The fixed time buckets shown to the user, and how many minutes each roughly means
const estimatedTimeOptions = ['5 min', '15 min', '30 min', '1 hr+'];

const timeInMinutes = {
  '5 min': 5,
  '15 min': 15,
  '30 min': 30,
  '1 hr+': 90
};

// Used when a subtask has no time set, so one gap does not zero out the total
const defaultMinutes = 15;

// Round a total number of minutes back to the nearest bucket above
function getTimeEstimate(totalMinutes) {
  if (totalMinutes <= timeInMinutes['5 min']) return '5 min';
  if (totalMinutes <= timeInMinutes['15 min']) return '15 min';
  if (totalMinutes <= timeInMinutes['30 min']) return '30 min';
  return '1 hr+';
}

module.exports = { estimatedTimeOptions, timeInMinutes, defaultMinutes, getTimeEstimate };

// Matches the model's answer to one of the fixed options, ignoring case and spaces
function normalizeOption(raw, options) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return options.find((option) => option.toLowerCase() === trimmed.toLowerCase()) ?? null;
}

module.exports = { normalizeOption };

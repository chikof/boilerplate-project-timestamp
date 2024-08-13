
// dateStr can be a date or a timestamp
function isValidDate(dateStr) {
  const date = parseDate(dateStr);
  return !isNaN(date.getTime());
}

function parseDate(dateStr) {
  const timestamp = parseInt(dateStr, 10);
  const str = isNaN(timestamp) ? dateStr : timestamp;
  return new Date(str);
}

module.exports = { isValidDate, parseDate }

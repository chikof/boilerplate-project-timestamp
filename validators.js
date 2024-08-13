
// dateStr can be a date or a timestamp
function isValidDate(dateStr) {
  const date = parseDate(dateStr);
  return !isNaN(date.getTime());
}

function isValidUrl(url) {
  try {
    const urlObject = new URL(url);
    return ["http:", "https:"].includes(urlObject.protocol);
  } catch {
    return false;
  }
}

function parseDate(dateStr) {
  const timestamp = Number(dateStr);
  const str = !isNaN(timestamp) ? timestamp : dateStr;
  return new Date(str);
}

module.exports = { isValidDate, parseDate, isValidUrl }

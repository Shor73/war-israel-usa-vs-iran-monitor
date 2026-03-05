// War time utilities — generates military DTG strings relative to current time
// All timestamps are dynamic: every page load reflects "right now"

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

// Military DTG format: DDHHMM Z MON YYYY — e.g. "051837ZMAR2026"
export function militaryDTG(offsetMinutes = 0): string {
  const d = new Date(Date.now() - offsetMinutes * 60 * 1000)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const h   = String(d.getUTCHours()).padStart(2, '0')
  const m   = String(d.getUTCMinutes()).padStart(2, '0')
  const mon = MONTHS[d.getUTCMonth()]
  return `${day}${h}${m}Z${mon}${d.getUTCFullYear()}`
}

// ISO string for "hoursAgo hours ago" — for alert simulation dates
export function warISODate(hoursAgo = 0): string {
  return new Date(Date.now() - hoursAgo * 3_600_000).toISOString()
}

// Short human-readable format: "05 MAR 2026 18:37Z"
export function shortUTCDate(offsetMinutes = 0): string {
  const d = new Date(Date.now() - offsetMinutes * 60 * 1000)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const h   = String(d.getUTCHours()).padStart(2, '0')
  const m   = String(d.getUTCMinutes()).padStart(2, '0')
  return `${day} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${h}:${m}Z`
}

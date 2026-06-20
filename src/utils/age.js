/**
 * Age math — exact years/months/days between two dates + next-birthday countdown.
 */

/**
 * @param {string|Date} dob  - Date of birth
 * @param {string|Date} asOf - Reference date (defaults to now)
 * @returns {{
 *   years: number, months: number, days: number,
 *   totalDays: number, totalWeeks: number, totalHours: number,
 *   nextBirthday: { date: Date, daysAway: number, dayOfWeek: string } | null
 * } | null}
 */
export function calculateAge(dob, asOf = new Date()) {
  const birth = dob instanceof Date ? dob : new Date(dob)
  const ref = asOf instanceof Date ? asOf : new Date(asOf)

  if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime())) return null
  if (birth > ref) return null

  let years = ref.getFullYear() - birth.getFullYear()
  let months = ref.getMonth() - birth.getMonth()
  let days = ref.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    // Days in the previous month relative to ref
    const prevMonthLastDay = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate()
    days += prevMonthLastDay
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  // Total days lived
  const msPerDay = 1000 * 60 * 60 * 24
  const totalDays = Math.floor((ref - birth) / msPerDay)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = Math.floor((ref - birth) / (1000 * 60 * 60))

  // Next birthday
  const nextBirthday = nextBirthdayDate(birth, ref)

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    nextBirthday,
  }
}

function nextBirthdayDate(birth, ref) {
  const month = birth.getMonth()
  const day = birth.getDate()
  let year = ref.getFullYear()
  let candidate = new Date(year, month, day)
  if (candidate <= ref) {
    year += 1
    candidate = new Date(year, month, day)
  }
  // Handle Feb 29 → Mar 1 in non-leap years
  if (candidate.getMonth() !== month) {
    candidate = new Date(year, month + 1, 0)
  }
  const msPerDay = 1000 * 60 * 60 * 24
  const daysAway = Math.ceil((candidate - ref) / msPerDay)
  return {
    date: candidate,
    daysAway,
    dayOfWeek: candidate.toLocaleDateString('en-US', { weekday: 'long' }),
  }
}

/**
 * @param {string} dob
 * @param {string} asOf
 * @returns {{ valid: boolean, errors: { dob?: string, asOf?: string } }}
 */
export function validateAgeInputs({ dob, asOf }) {
  const errors = {}
  if (!dob) {
    errors.dob = 'Date of birth is required.'
  } else if (Number.isNaN(new Date(dob).getTime())) {
    errors.dob = 'Please enter a valid date.'
  }
  if (!asOf) {
    errors.asOf = 'Reference date is required.'
  } else if (Number.isNaN(new Date(asOf).getTime())) {
    errors.asOf = 'Please enter a valid date.'
  }
  if (!errors.dob && !errors.asOf) {
    const d = new Date(dob)
    const r = new Date(asOf)
    if (d > r) errors.dob = 'Date of birth cannot be in the future.'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export function formatDate(d) {
  if (!d) return '—'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
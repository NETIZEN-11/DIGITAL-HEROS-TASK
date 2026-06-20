/**
 * Cryptographically-secure password generator.
 *
 * Uses `crypto.getRandomValues` (Web Crypto API) — available in all modern browsers
 * and Node 19+. Avoids `Math.random` entirely because Math.random is NOT secure.
 */

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>/?~',
}

/**
 * Generate a password with the given options.
 *
 * @param {object} opts
 * @param {number} opts.length
 * @param {boolean} [opts.upper]
 * @param {boolean} [opts.lower]
 * @param {boolean} [opts.digits]
 * @param {boolean} [opts.symbols]
 * @returns {string|null} password, or null if no sets selected or length too small
 */
export function generatePassword({ length, upper, lower, digits, symbols }) {
  const L = parseInt(length, 10)
  if (!Number.isFinite(L) || L < 6 || L > 128) return null

  const selected = []
  if (upper) selected.push(SETS.upper)
  if (lower) selected.push(SETS.lower)
  if (digits) selected.push(SETS.digits)
  if (symbols) selected.push(SETS.symbols)

  if (selected.length === 0) return null
  // Need at least one character per selected set; otherwise the "guaranteed
  // inclusion" guarantee below would have nothing to pull from.
  if (L < selected.length) return null

  // Pick one char from each selected set first (guaranteed inclusion).
  const chars = selected.map((set) => set[secureRandomInt(set.length)])
  const pool = selected.join('')

  while (chars.length < L) {
    chars.push(pool[secureRandomInt(pool.length)])
  }

  // Fisher–Yates shuffle so the guaranteed ones aren't always at the start.
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

/**
 * Estimate password entropy in bits: log2(pool^length).
 * @param {string} password
 * @param {{ upper?: boolean, lower?: boolean, digits?: boolean, symbols?: boolean }} sets
 * @returns {number}
 */
export function estimateEntropy(password, sets) {
  if (!password) return 0
  let pool = 0
  if (sets.upper) pool += 26
  if (sets.lower) pool += 26
  if (sets.digits) pool += 10
  if (sets.symbols) pool += 30
  if (pool === 0) return 0
  return password.length * Math.log2(pool)
}

/**
 * Map entropy (bits) to a strength label.
 * @param {number} bits
 * @returns {'Weak'|'Fair'|'Good'|'Strong'|'Excellent'}
 */
export function strengthLabel(bits) {
  if (bits < 40) return 'Weak'
  if (bits < 60) return 'Fair'
  if (bits < 80) return 'Good'
  if (bits < 100) return 'Strong'
  return 'Excellent'
}

/**
 * Map strength label to Tailwind color class.
 * @param {string} label
 */
export function strengthColor(label) {
  return {
    Weak: 'bg-red-500',
    Fair: 'bg-orange-500',
    Good: 'bg-amber-500',
    Strong: 'bg-emerald-500',
    Excellent: 'bg-emerald-600',
  }[label] || 'bg-slate-300'
}

/**
 * Securely pick an integer in [0, max).
 * @param {number} max
 */
function secureRandomInt(max) {
  if (max <= 0) return 0
  // Use rejection sampling for uniform distribution.
  const buf = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  let r
  do {
    crypto.getRandomValues(buf)
    r = buf[0]
  } while (r >= limit)
  return r % max
}
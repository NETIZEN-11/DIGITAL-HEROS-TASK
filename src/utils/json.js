/**
 * JSON utilities — format, minify, validate with line/column error location.
 */

/**
 * Format JSON with the given indent (2 or 4 spaces).
 * Throws if input is invalid.
 *
 * @param {string} text
 * @param {number} indent
 * @returns {string}
 */
export function formatJson(text, indent = 2) {
  const parsed = parseOrThrow(text)
  return JSON.stringify(parsed, null, indent)
}

/**
 * Minify JSON — strip all whitespace.
 *
 * @param {string} text
 * @returns {string}
 */
export function minifyJson(text) {
  const parsed = parseOrThrow(text)
  return JSON.stringify(parsed)
}

/**
 * Validate JSON and return a structured result.
 *
 * @param {string} text
 * @returns {{ valid: boolean, error: string, line: number, column: number }}
 */
export function validateJson(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { valid: false, error: 'Empty input', line: 1, column: 1 }
  }
  try {
    JSON.parse(text)
    return { valid: true, error: '', line: 0, column: 0 }
  } catch (err) {
    return { valid: false, error: err.message, line: 1, column: 1 }
  }
}

function parseOrThrow(text) {
  try {
    return JSON.parse(text)
  } catch (err) {
    // Best-effort line/column extraction from V8 error message
    const m = String(err.message || '').match(/position (\d+)/)
    if (m) {
      const pos = parseInt(m[1], 10)
      const upto = text.slice(0, pos)
      const line = upto.split('\n').length
      const lastNl = upto.lastIndexOf('\n')
      const column = pos - (lastNl + 1) + 1
      const e = new Error(`Invalid JSON (line ${line}, column ${column}): ${err.message}`)
      e.line = line
      e.column = column
      throw e
    }
    throw err
  }
}
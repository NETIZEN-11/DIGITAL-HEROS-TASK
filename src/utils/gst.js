/**
 * GST math + validation.
 *
 * India GST model: tax splits into CGST + SGST (intra-state) or IGST (inter-state).
 * For a "calculator" we expose the simpler breakdown the user actually wants:
 *   - Add GST: given Base, add GST% → Total
 *   - Remove GST: given Total (GST-inclusive), back out Base + GST
 *
 * Outputs are rounded to 2 decimals (currency).
 */

export const GST_PRESETS = [5, 12, 18, 28]

/**
 * @param {'add'|'remove'} mode
 * @param {number} amount
 * @param {number} rate
 * @returns {{ base: number, gst: number, total: number, cgst: number, sgst: number } | null}
 */
export function calculateGST(mode, amount, rate) {
  const a = Number(amount)
  const r = Number(rate)
  if (!Number.isFinite(a) || a <= 0) return null
  if (!Number.isFinite(r) || r < 0 || r > 100) return null

  if (mode === 'add') {
    const base = round2(a)
    const gst = round2((a * r) / 100)
    const total = round2(base + gst)
    return { base, gst, total, cgst: round2(gst / 2), sgst: round2(gst / 2) }
  }

  // 'remove' — amount is GST-inclusive
  const total = round2(a)
  const base = round2((a * 100) / (100 + r))
  const gst = round2(total - base)
  return { base, gst, total, cgst: round2(gst / 2), sgst: round2(gst / 2) }
}

export function validateGSTInputs({ amount, rate }) {
  const errors = {}
  const a = parseFloat(amount)
  if (amount === '' || amount === null || amount === undefined) {
    errors.amount = 'Amount is required.'
  } else if (Number.isNaN(a)) {
    errors.amount = 'Please enter a valid number.'
  } else if (a <= 0) {
    errors.amount = 'Amount must be greater than 0.'
  }

  const r = parseFloat(rate)
  if (rate === '' || rate === null || rate === undefined) {
    errors.rate = 'GST rate is required.'
  } else if (Number.isNaN(r)) {
    errors.rate = 'Please enter a valid number.'
  } else if (r < 0) {
    errors.rate = 'GST rate cannot be negative.'
  } else if (r > 100) {
    errors.rate = 'GST rate cannot exceed 100%.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

function round2(v) {
  return Math.round(v * 100) / 100
}
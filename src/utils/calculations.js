/**
 * EMI Calculation Utilities
 *
 * Formula:
 *   EMI = [P × R × (1 + R)^N] / [(1 + R)^N − 1]
 *
 * Where:
 *   P = Principal loan amount
 *   R = Monthly interest rate (annual rate / 12 / 100)
 *   N = Loan tenure in months
 */

/**
 * Calculate EMI, total interest, total payment and a yearly amortization.
 *
 * Throws on invalid input rather than silently returning zeros — that way a
 * caller bug (e.g. validation bypassed) fails loud instead of producing a
 * misleading "0 / 0 / 0" result.
 *
 * @param {number|string} principal  - Loan amount in currency units
 * @param {number|string} annualRate - Annual interest rate (e.g. 8.5 for 8.5%)
 * @param {number|string} years      - Tenure in years (whole years expected)
 * @returns {{
 *   emi: number,
 *   totalInterest: number,
 *   totalPayment: number,
 *   amortization: Array<{ year: number, principal: number, interest: number, balance: number }>
 * }}
 */
export function calculateEMI(principal, annualRate, years) {
  const P = Number(principal)
  const annualR = Number(annualRate)
  const rawY = Number(years)

  if (!Number.isFinite(P) || P <= 0) {
    throw new TypeError('calculateEMI: principal must be a positive finite number')
  }
  if (!Number.isFinite(annualR) || annualR < 0) {
    throw new TypeError('calculateEMI: annualRate must be a non-negative finite number')
  }
  if (!Number.isFinite(rawY) || rawY <= 0) {
    throw new TypeError('calculateEMI: years must be a positive finite number')
  }

  // Years are expected to be whole numbers — validateInputs() already rejects
  // fractions at the form layer. `Math.floor` here is a defensive fallback in
  // case calculateEMI is called programmatically; without it, 4.9 years would
  // silently produce a 4-year amortization schedule.
  const Y = Math.floor(rawY)
  const N = Y * 12
  const R = annualR / 12 / 100

  // Edge case: 0% interest — straight-line division
  if (R === 0) {
    const emi = N > 0 ? P / N : 0
    const amortization = []
    let balance = P
    for (let year = 1; year <= Y; year += 1) {
      const principalPaid = emi * 12
      balance -= principalPaid
      amortization.push({
        year,
        principal: Math.max(0, principalPaid),
        interest: 0,
        balance: Math.max(0, balance),
      })
    }
    return {
      emi: roundTo(emi, 2),
      totalInterest: 0,
      totalPayment: roundTo(P, 2),
      amortization,
    }
  }

  const pow = Math.pow(1 + R, N)
  const emi = (P * R * pow) / (pow - 1)
  const totalPayment = emi * N
  const totalInterest = totalPayment - P

  // Build yearly amortization schedule
  const amortization = []
  let balance = P
  for (let year = 1; year <= Y; year += 1) {
    let interestThisYear = 0
    let principalThisYear = 0
    for (let m = 0; m < 12; m += 1) {
      const interestForMonth = balance * R
      const principalForMonth = emi - interestForMonth
      interestThisYear += interestForMonth
      principalThisYear += principalForMonth
      balance -= principalForMonth
    }
    amortization.push({
      year,
      principal: roundTo(principalThisYear, 2),
      interest: roundTo(interestThisYear, 2),
      balance: roundTo(Math.max(0, balance), 2),
    })
  }

  return {
    emi: roundTo(emi, 2),
    totalInterest: roundTo(totalInterest, 2),
    totalPayment: roundTo(totalPayment, 2),
    amortization,
  }
}

/**
 * Format a number as currency.
 *
 * @param {number} value
 * @param {string} [currency='INR']
 * @param {string} [locale='en-IN']
 * @returns {string}
 */
export function formatCurrency(value, currency = 'INR', locale = 'en-IN') {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Validate user input for the EMI form.
 *
 * @param {{principal: string, rate: string, years: string}} values
 * @returns {{ valid: boolean, errors: { principal?: string, rate?: string, years?: string } }}
 */
export function validateInputs({ principal, rate, years }) {
  const errors = {}

  const P = parseFloat(principal)
  if (principal === '' || principal === null || principal === undefined) {
    errors.principal = 'Loan amount is required.'
  } else if (Number.isNaN(P)) {
    errors.principal = 'Please enter a valid number.'
  } else if (P <= 0) {
    errors.principal = 'Loan amount must be greater than 0.'
  } else if (P > 1000000000) {
    errors.principal = 'Loan amount looks too large.'
  }

  const R = parseFloat(rate)
  if (rate === '' || rate === null || rate === undefined) {
    errors.rate = 'Interest rate is required.'
  } else if (Number.isNaN(R)) {
    errors.rate = 'Please enter a valid number.'
  } else if (R < 0) {
    errors.rate = 'Interest rate cannot be negative.'
  } else if (R > 100) {
    errors.rate = 'Interest rate seems unrealistic (>100%).'
  }

  const Y = parseFloat(years)
  if (years === '' || years === null || years === undefined) {
    errors.years = 'Loan tenure is required.'
  } else if (Number.isNaN(Y)) {
    errors.years = 'Please enter a valid number.'
  } else if (Y < 1) {
    errors.years = 'Tenure must be at least 1 year.'
  } else if (Y > 50) {
    errors.years = 'Tenure cannot exceed 50 years.'
  } else if (!Number.isInteger(Y)) {
    errors.years = 'Tenure must be a whole number of years.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

function roundTo(value, decimals) {
  const f = 10 ** decimals
  return Math.round(value * f) / f
}
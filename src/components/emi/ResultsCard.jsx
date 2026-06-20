import React from 'react'
import { formatCurrency } from '../../utils/calculations.js'

/**
 * ResultsCard — Shows EMI, total interest and total payment.
 *
 * @param {{
 *   result: { emi: number, totalInterest: number, totalPayment: number, amortization: Array } | null,
 *   principal: number,
 * }} props
 */
export default function ResultsCard({ result, principal }) {
  if (!result) {
    return (
      <div className="card p-6 sm:p-8 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-brand-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No results yet</h3>
        <p className="text-sm text-slate-500">
          Enter your loan details and click <span className="font-semibold">Calculate EMI</span> to see your monthly payment breakdown.
        </p>
      </div>
    )
  }

  const { emi, totalInterest, totalPayment } = result

  // Use the SAME unrounded ratio everywhere — bar widths, label, and pct — so
  // the bar and caption never disagree because of independent rounding.
  const interestRatioRaw = totalPayment > 0 ? totalInterest / totalPayment : 0
  const principalRatioRaw = 1 - interestRatioRaw
  const interestPct = Math.round(interestRatioRaw * 100)
  const principalPct = 100 - interestPct

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">Your Loan Breakdown</h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
          Calculated
        </span>
      </div>

      {/* Primary EMI result */}
      <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/30">
        <p className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
          Monthly EMI
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {formatCurrency(emi)}
        </p>
        <p className="text-xs text-white/80 mt-1.5">
          For {principal > 0 ? formatCurrency(principal) : 'your loan'}
        </p>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="stat-card bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
              Total Interest
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-900">
            {formatCurrency(totalInterest)}
          </p>
          <p className="text-xs text-orange-600 mt-1 font-medium">{interestPct}% of total payment</p>
        </div>

        <div className="stat-card bg-emerald-50 border-emerald-200">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Total Payment
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-900">
            {formatCurrency(totalPayment)}
          </p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Principal + Interest</p>
        </div>
      </div>

      {/* Visual ratio bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            Principal ({principalPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            Interest ({interestPct}%)
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden bg-slate-100 flex">
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
            style={{ width: `${(principalRatioRaw * 100).toFixed(2)}%` }}
            aria-label={`Principal ${principalPct}%`}
          />
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700"
            style={{ width: `${(interestRatioRaw * 100).toFixed(2)}%` }}
            aria-label={`Interest ${interestPct}%`}
          />
        </div>
      </div>
    </div>
  )
}
import React from 'react'

/**
 * EmptyState — friendly prompt shown when a tool has no result yet.
 */
export default function EmptyState({ title = 'Nothing to show yet', message, icon = 'info' }) {
  const ICONS = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    calculate: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  }

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
          <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[icon] || ICONS.info} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      {message && <p className="text-sm text-slate-500 max-w-xs mx-auto">{message}</p>}
    </div>
  )
}

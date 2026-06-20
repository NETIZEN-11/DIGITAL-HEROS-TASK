import React, { useState } from 'react'
import { formatCurrency } from '../../utils/calculations.js'
import { calculateGST, validateGSTInputs, GST_PRESETS } from '../../utils/gst.js'
import CopyButton from '../shared/CopyButton.jsx'

const INITIAL = { amount: '', rate: '18' }

export default function GSTCalculator() {
  const [mode, setMode] = useState('add')
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  // Tracks which mode the current `result` was computed in. If the user
  // switches modes without recalculating, the result card dims and shows
  // a "stale" badge so the breakdown doesn't silently misrepresent inputs.
  const [resultMode, setResultMode] = useState(null)

  function switchMode(next) {
    if (next === mode) return
    setMode(next)
  }

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: nextErrors } = validateGSTInputs(values)
    setErrors(nextErrors)
    if (!valid) return
    const r = calculateGST(mode, values.amount, values.rate)
    if (r) {
      setResult(r)
      setResultMode(mode)
    }
  }

  function handleReset() {
    setValues(INITIAL)
    setErrors({})
    setResult(null)
    setResultMode(null)
  }

  const isStale = result && resultMode && resultMode !== mode

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <section className="lg:col-span-2" aria-label="GST input form">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-600" />
            <h2 className="text-xl font-bold text-slate-900">GST Details</h2>
          </div>

          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 mb-5 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => switchMode('add')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === 'add' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Add GST
            </button>
            <button
              type="button"
              onClick={() => switchMode('remove')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === 'remove' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Remove GST
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="amount" className="label-text">
                {mode === 'add' ? 'Base Amount' : 'Total Amount (incl. GST)'}
                <span className="text-slate-400 font-normal ml-1">(₹)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder={mode === 'add' ? 'e.g. 1000' : 'e.g. 1180'}
                  value={values.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`input-field pl-9 ${errors.amount ? 'error' : ''}`}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="rate" className="label-text">
                GST Rate
                <span className="text-slate-400 font-normal ml-1">(% per year)</span>
              </label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {GST_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handleChange('rate', String(preset))}
                    className={`py-2 text-sm font-bold rounded-lg transition-all ${
                      String(preset) === values.rate
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  id="rate"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  max="100"
                  placeholder="Custom rate"
                  value={values.rate}
                  onChange={(e) => handleChange('rate', e.target.value)}
                  className={`input-field pr-10 ${errors.rate ? 'error' : ''}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
              </div>
              {errors.rate && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.rate}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" className="btn-primary sm:flex-[2] bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/30 hover:shadow-amber-500/40">
                {mode === 'add' ? 'Calculate Total' : 'Calculate Base'}
              </button>
              <button type="button" onClick={handleReset} className="btn-secondary sm:flex-1">Reset</button>
            </div>
          </form>
        </div>
      </section>

      <section className="lg:col-span-3" aria-label="GST result">
        {result ? (
          <div className="space-y-6">
            <div className={`card p-6 sm:p-8 animate-slide-up transition-opacity ${isStale ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900">Breakdown</h3>
                <div className="flex items-center gap-2">
                  {isStale && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                      Stale — click Calculate
                    </span>
                  )}
                  <CopyButton
                    text={`Base: ${formatCurrency(result.base)}\nGST: ${formatCurrency(result.gst)}\nTotal: ${formatCurrency(result.total)}\nCGST: ${formatCurrency(result.cgst)}\nSGST: ${formatCurrency(result.sgst)}`}
                    label="Copy all"
                  />
                </div>
              </div>

              <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-lg">
                <p className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">
                  {mode === 'add' ? 'Total (incl. GST)' : 'Base Amount'}
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {formatCurrency(mode === 'add' ? result.total : result.base)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="stat-card bg-blue-50 border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">Base Amount</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-900">{formatCurrency(result.base)}</p>
                </div>
                <div className="stat-card bg-orange-50 border-orange-200">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1.5">Total GST</p>
                  <p className="text-lg sm:text-xl font-bold text-orange-900">{formatCurrency(result.gst)}</p>
                </div>
                <div className="stat-card bg-emerald-50 border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1.5">Total</p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-900">{formatCurrency(result.total)}</p>
                </div>
              </div>

              <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">CGST / SGST Split (intra-state)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-semibold text-slate-700">CGST</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(result.cgst)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-semibold text-slate-700">SGST</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(result.sgst)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 sm:p-8 text-center animate-fade-in">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-6 0l6 6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No calculation yet</h3>
            <p className="text-sm text-slate-500">Enter an amount and pick a GST rate to see the breakdown.</p>
          </div>
        )}
      </section>
    </div>
  )
}
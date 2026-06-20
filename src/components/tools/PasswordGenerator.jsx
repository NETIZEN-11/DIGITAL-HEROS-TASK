import React, { useEffect, useState } from 'react'
import { generatePassword, estimateEntropy, strengthLabel, strengthColor } from '../../utils/password.js'
import CopyButton from '../shared/CopyButton.jsx'

const DEFAULTS = {
  length: 16,
  upper: true,
  lower: true,
  digits: true,
  symbols: true,
}

export default function PasswordGenerator() {
  const [opts, setOpts] = useState(DEFAULTS)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function regenerate(nextOpts = opts) {
    const p = generatePassword(nextOpts)
    if (!p) {
      setError('Pick at least one character set and length ≥ 6.')
      setPassword('')
    } else {
      setError('')
      setPassword(p)
    }
  }

  // Generate one on mount
  useEffect(() => {
    regenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function update(field, value) {
    const next = { ...opts, [field]: value }
    setOpts(next)
    regenerate(next)
  }

  const bits = estimateEntropy(password, opts)
  const label = strengthLabel(bits)
  const color = strengthColor(label)
  // Width of the strength bar: 0–128 bits → 0–100%
  const widthPct = Math.min(100, Math.max(2, (bits / 128) * 100))

  const selectedCount = [opts.upper, opts.lower, opts.digits, opts.symbols].filter(Boolean).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <section className="lg:col-span-3" aria-label="Password output">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-600" />
            <h2 className="text-xl font-bold text-slate-900">Your Password</h2>
          </div>

          <div className="p-5 bg-slate-900 rounded-2xl mb-5">
            <p className="font-mono text-xl sm:text-2xl text-white break-all select-all min-h-[2.5rem]">
              {password || '—'}
            </p>
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Strength: <span className="text-slate-900">{label}</span></span>
              <span>{Math.round(bits)} bits</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${widthPct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => regenerate()} className="btn-primary bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30 hover:shadow-rose-500/40">
              Regenerate
            </button>
            <CopyButton text={password} label="Copy" className="py-3 text-sm !bg-slate-100 !text-slate-700 hover:!bg-slate-200" />
          </div>

          {error && <p className="text-xs text-red-600 mt-3 font-medium">{error}</p>}
        </div>
      </section>

      <section className="lg:col-span-2" aria-label="Password options">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-600" />
            <h2 className="text-xl font-bold text-slate-900">Options</h2>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="length" className="text-sm font-semibold text-slate-700">Length</label>
              <span className="text-sm font-bold text-brand-700">{opts.length}</span>
            </div>
            <input
              id="length"
              type="range"
              min="6"
              max="64"
              value={opts.length}
              onChange={(e) => update('length', parseInt(e.target.value, 10))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              ['upper', 'Uppercase (A–Z)'],
              ['lower', 'Lowercase (a–z)'],
              ['digits', 'Numbers (0–9)'],
              ['symbols', 'Symbols (!@#…)'],
            ].map(([key, labelText]) => (
              <label key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                <span className="text-sm font-medium text-slate-700">{labelText}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={opts[key]}
                  onClick={() => update(key, !opts[key])}
                  className={`relative w-11 h-6 rounded-full transition-colors ${opts[key] ? 'bg-rose-500' : 'bg-slate-300'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${opts[key] ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </label>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-5 text-center">
            {selectedCount === 0 ? '⚠ Select at least one character set' : `Generated using ${selectedCount} character set${selectedCount > 1 ? 's' : ''} • cryptographically secure`}
          </p>
        </div>
      </section>
    </div>
  )
}
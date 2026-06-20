import React, { useEffect, useState, useMemo } from 'react'
import { calculateAge, validateAgeInputs, formatDate } from '../../utils/age.js'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function AgeCalculator() {
  const [dob, setDob] = useState('1995-06-15')
  const [asOf, setAsOf] = useState(todayISO())
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  // Ticking state — re-renders once a minute so the next-birthday countdown
  // stays current if the tab is left open across a day boundary.
  const [, setNow] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNow((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const result = useMemo(() => {
    if (!touched) return null
    if (!dob || !asOf) return null
    return calculateAge(dob, asOf)
  }, [dob, asOf, touched])

  function handleCalculate(e) {
    e.preventDefault()
    const { valid, errors: nextErrors } = validateAgeInputs({ dob, asOf })
    setErrors(nextErrors)
    setTouched(true)
    if (!valid) return
  }

  function handleReset() {
    setDob('')
    setAsOf(todayISO())
    setErrors({})
    setTouched(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <section className="lg:col-span-2" aria-label="Age input form">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />
            <h2 className="text-xl font-bold text-slate-900">Dates</h2>
          </div>

          <form onSubmit={handleCalculate} noValidate className="space-y-5">
            <div>
              <label htmlFor="dob" className="label-text">Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`input-field ${errors.dob ? 'error' : ''}`}
                max={todayISO()}
              />
              {errors.dob && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.dob}</p>}
            </div>

            <div>
              <label htmlFor="asof" className="label-text">
                As of Date
                <button
                  type="button"
                  onClick={() => setAsOf(todayISO())}
                  className="ml-2 text-xs text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Use today
                </button>
              </label>
              <input
                id="asof"
                type="date"
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
                className={`input-field ${errors.asOf ? 'error' : ''}`}
              />
              {errors.asOf && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.asOf}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" className="btn-primary sm:flex-[2] bg-gradient-to-r from-indigo-500 to-violet-600 shadow-indigo-500/30 hover:shadow-indigo-500/40">Calculate</button>
              <button type="button" onClick={handleReset} className="btn-secondary sm:flex-1">Reset</button>
            </div>
          </form>
        </div>
      </section>

      <section className="lg:col-span-3" aria-label="Age result">
        {result ? (
          <div className="card p-6 sm:p-8 animate-slide-up">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Your Age</h3>

            <div className="mb-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white shadow-lg">
              <p className="text-xs uppercase tracking-widest text-white/80 font-semibold mb-1">You are</p>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {result.years} years, {result.months} months, {result.days} days
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="stat-card bg-indigo-50 border-indigo-200 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-900">{result.totalDays.toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mt-1">Total days</p>
              </div>
              <div className="stat-card bg-violet-50 border-violet-200 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-900">{result.totalWeeks.toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mt-1">Weeks</p>
              </div>
              <div className="stat-card bg-purple-50 border-purple-200 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-900">{result.totalHours.toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mt-1">Hours</p>
              </div>
            </div>

            {result.nextBirthday && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-xl">🎂</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Next birthday in {result.nextBirthday.daysAway} day{result.nextBirthday.daysAway !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-slate-600">
                      {result.nextBirthday.dayOfWeek}, {formatDate(result.nextBirthday.date)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-6 sm:p-8 text-center animate-fade-in">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Enter your dates</h3>
            <p className="text-sm text-slate-500">Pick a date of birth and reference date, then click Calculate.</p>
          </div>
        )}
      </section>
    </div>
  )
}
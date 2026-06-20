import React from 'react'

/**
 * EMIForm — Controlled inputs for principal, rate and tenure.
 *
 * @param {{
 *   values: { principal: string, rate: string, years: string },
 *   errors: { principal?: string, rate?: string, years?: string },
 *   onChange: (field: string, value: string) => void,
 *   onSubmit: (e: React.FormEvent) => void,
 *   onReset: () => void,
 *   hasResult: boolean,
 * }} props
 */
export default function EMIForm({ values, errors, onChange, onSubmit, onReset, hasResult }) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="principal" className="label-text">
          Loan Amount
          <span className="text-slate-400 font-normal ml-1">(₹)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold pointer-events-none">
            ₹
          </span>
          <input
            id="principal"
            name="principal"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2500000"
            value={values.principal}
            onChange={(e) => onChange('principal', e.target.value)}
            className={`input-field pl-9 ${errors.principal ? 'error' : ''}`}
            aria-invalid={Boolean(errors.principal)}
            aria-describedby={errors.principal ? 'principal-error' : undefined}
            autoComplete="off"
          />
        </div>
        {errors.principal ? (
          <p id="principal-error" className="text-xs text-red-600 mt-1.5 font-medium">
            {errors.principal}
          </p>
        ) : (
          <p className="helper-text">Total amount you want to borrow.</p>
        )}
      </div>

      <div>
        <label htmlFor="rate" className="label-text">
          Annual Interest Rate
          <span className="text-slate-400 font-normal ml-1">(% per year)</span>
        </label>
        <div className="relative">
          <input
            id="rate"
            name="rate"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="any"
            placeholder="e.g. 8.5"
            value={values.rate}
            onChange={(e) => onChange('rate', e.target.value)}
            className={`input-field pr-10 ${errors.rate ? 'error' : ''}`}
            aria-invalid={Boolean(errors.rate)}
            aria-describedby={errors.rate ? 'rate-error' : undefined}
            autoComplete="off"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold pointer-events-none">
            %
          </span>
        </div>
        {errors.rate ? (
          <p id="rate-error" className="text-xs text-red-600 mt-1.5 font-medium">
            {errors.rate}
          </p>
        ) : (
          <p className="helper-text">Yearly rate offered by your lender.</p>
        )}
      </div>

      <div>
        <label htmlFor="years" className="label-text">
          Loan Tenure
          <span className="text-slate-400 font-normal ml-1">(years)</span>
        </label>
        <div className="relative">
          <input
            id="years"
            name="years"
            type="number"
            inputMode="numeric"
            min="1"
            max="50"
            step="1"
            placeholder="e.g. 20"
            value={values.years}
            onChange={(e) => onChange('years', e.target.value)}
            className={`input-field pr-20 ${errors.years ? 'error' : ''}`}
            aria-invalid={Boolean(errors.years)}
            aria-describedby={errors.years ? 'years-error' : undefined}
            autoComplete="off"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold pointer-events-none">
            years
          </span>
        </div>
        {errors.years ? (
          <p id="years-error" className="text-xs text-red-600 mt-1.5 font-medium">
            {errors.years}
          </p>
        ) : (
          <p className="helper-text">How long you will repay the loan.</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button type="submit" className="btn-primary sm:flex-[2]">
          {hasResult ? 'Recalculate' : 'Calculate EMI'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary sm:flex-1"
          aria-label="Reset form"
        >
          Reset
        </button>
      </div>
    </form>
  )
}
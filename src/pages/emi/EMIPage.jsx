import React, { useCallback, useState } from 'react'
import { getToolByPath } from '../../data/tools.js'
import ToolPage from '../../components/shared/ToolPage.jsx'
import EMIForm from '../../components/emi/EMIForm.jsx'
import ResultsCard from '../../components/emi/ResultsCard.jsx'
import EMIChart from '../../components/emi/EMIChart.jsx'
import EmptyState from '../../components/shared/EmptyState.jsx'
import { calculateEMI, validateInputs } from '../../utils/calculations.js'

const INITIAL_VALUES = { principal: '', rate: '', years: '' }
const INITIAL_ERRORS = {}

export default function EMIPage() {
  const tool = getToolByPath('/tools/emi')
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [result, setResult] = useState(null)

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const { valid, errors: nextErrors } = validateInputs(values)
      setErrors(nextErrors)
      if (!valid) return
      try {
        const r = calculateEMI(values.principal, values.rate, values.years)
        setResult(r)
      } catch (err) {
        console.error(err)
        setErrors({ principal: 'Calculation error — please check inputs.' })
      }
    },
    [values]
  )

  const handleReset = useCallback(() => {
    setValues(INITIAL_VALUES)
    setErrors(INITIAL_ERRORS)
    setResult(null)
  }, [])

  return (
    <ToolPage tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <section className="lg:col-span-2" aria-label="Loan input form">
          <div className="card p-6 sm:p-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-brand-500 to-purple-600" />
              <h2 className="text-xl font-bold text-slate-900">Loan Details</h2>
            </div>
            <EMIForm
              values={values}
              errors={errors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              hasResult={Boolean(result)}
            />
          </div>
        </section>

        <section className="lg:col-span-3 space-y-6" aria-label="Results">
          {result ? (
            <>
              <ResultsCard result={result} principal={parseFloat(values.principal) || 0} />
              {result.amortization && result.amortization.length > 0 && (
                <EMIChart amortization={result.amortization} />
              )}
            </>
          ) : (
            <EmptyState
              title="No results yet"
              message="Enter your loan details and click Calculate EMI to see your monthly payment breakdown."
              icon="calculate"
            />
          )}
        </section>
      </div>
    </ToolPage>
  )
}

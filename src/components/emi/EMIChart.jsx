import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '../../utils/calculations.js'

/**
 * EMIChart — Yearly amortization bar chart (principal vs interest).
 *
 * @param {{
 *   amortization: Array<{ year: number, principal: number, interest: number, balance: number }>,
 * }} props
 */
export default function EMIChart({ amortization }) {
  if (!amortization || amortization.length === 0) return null

  const data = amortization.map((row) => ({
    year: `Yr ${row.year}`,
    Principal: Math.round(row.principal),
    Interest: Math.round(row.interest),
    balance: row.balance,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-bold text-slate-900 mb-1.5">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Year-wise Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">Principal vs Interest paid each year</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            Principal
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            Interest
          </span>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              stroke="#cbd5e1"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              stroke="#cbd5e1"
              tickFormatter={(v) => {
                if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`
                if (v >= 100000) return `${(v / 100000).toFixed(1)}L`
                if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
                return v
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(102, 126, 234, 0.08)' }}
            />
            <Legend wrapperStyle={{ display: 'none' }} />
            <Bar dataKey="Principal" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Interest" stackId="a" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Early years are dominated by interest payments. As tenure progresses, principal share grows.
      </p>
    </div>
  )
}
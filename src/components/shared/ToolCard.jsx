import React from 'react'
import { Link } from 'react-router-dom'

/**
 * ToolCard — used on the home page grid.
 *
 * @param {{ tool: { id: string, name: string, tagline: string, icon: string, path: string, color: string, badge?: string } }} props
 */
export default function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="group relative block p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/40 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
      aria-label={`Open ${tool.name}`}
    >
      {tool.badge && (
        <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full">
          {tool.badge}
        </span>
      )}

      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
        </svg>
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-brand-700 transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-slate-600 leading-snug">{tool.tagline}</p>

      <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
        Open tool
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  )
}

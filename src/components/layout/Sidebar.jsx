import React from 'react'
import { NavLink } from 'react-router-dom'
import { TOOLS } from '../../data/tools.js'

/**
 * Sidebar — desktop navigation. Hidden < lg.
 */
export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 bg-white/95 backdrop-blur-sm border-r border-white/40">
      <div className="px-6 py-6 border-b border-slate-200/60">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-slate-900 leading-tight">Smart Tools</p>
            <p className="text-xs text-slate-500">{TOOLS.length} free utilities</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Primary">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </NavLink>

        <div className="pt-3 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Tools
        </div>

        {TOOLS.map((tool) => (
          <NavLink
            key={tool.id}
            to={tool.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-brand-50 to-purple-50 text-brand-700 border-l-2 border-brand-500'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <span
              className={`w-7 h-7 rounded-md bg-gradient-to-br ${tool.color} flex items-center justify-center shrink-0`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
              </svg>
            </span>
            <span className="truncate">{tool.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

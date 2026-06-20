import React from 'react'
import { Link } from 'react-router-dom'

/**
 * PageHeader — top of every tool page: back link + icon + title + tagline.
 *
 * @param {{ tool: { id: string, name: string, tagline: string, icon: string, color: string } }} props
 */
export default function PageHeader({ tool }) {
  return (
    <div className="mb-6 sm:mb-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All tools
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg shrink-0`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {tool.name}
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-0.5">{tool.tagline}</p>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import DocumentTitle from './DocumentTitle.jsx'

export default function NotFoundPage() {
  return (
    <div className="text-center py-16 animate-fade-in">
      <DocumentTitle title="Tool not found" />
      <p className="text-6xl sm:text-7xl font-extrabold text-white/90 mb-3">404</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tool not found</h1>
      <p className="text-white/80 mb-6 max-w-sm mx-auto">
        The tool you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to all tools
      </Link>
    </div>
  )
}

import React from 'react'
import { TOOLS } from '../../data/tools.js'
import ToolCard from '../shared/ToolCard.jsx'

export default function HeroSection() {
  return (
    <div className="space-y-10">
      <section className="text-center pt-6 sm:pt-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 tracking-tight text-balance">
          Smart Tools
        </h1>
        <p className="text-base sm:text-lg text-white/90 max-w-lg mx-auto text-balance">
          8 free utilities that run entirely in your browser. No sign-up, no upload, no tracking.
        </p>
      </section>

      <section aria-labelledby="all-tools">
        <h2 id="all-tools" className="sr-only">All tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="text-center text-white/80 text-sm pb-4">
        <p>🔒 All calculations happen locally in your browser. Nothing is ever uploaded.</p>
      </section>
    </div>
  )
}

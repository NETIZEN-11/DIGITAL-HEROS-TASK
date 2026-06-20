import React from 'react'

const DH_URL = 'https://digitalheroesco.com'
const AUTHOR_NAME = 'Nitesh Kumar'
const AUTHOR_EMAIL = 'kumarnitesh979875@gmail.com'

/**
 * Footer — Mandatory: name, email and the "Built for Digital Heroes" button.
 */
export default function Footer() {
  return (
    <footer className="mt-10 mb-6 text-center animate-fade-in">
      <a
        href={DH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-dh"
        aria-label="Built for Digital Heroes — open in new tab"
      >
        <span aria-hidden="true">✨</span>
        Built for Digital Heroes
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>

      <div className="mt-5 text-white/90 text-sm">
        <p className="font-semibold">{AUTHOR_NAME}</p>
        <a
          href={`mailto:${AUTHOR_EMAIL}`}
          className="inline-block mt-1 underline-offset-2 hover:underline font-medium"
        >
          {AUTHOR_EMAIL}
        </a>
      </div>

      <p className="mt-4 text-xs text-white/60">
        © {new Date().getFullYear()} Smart Tools Hub · All calculations run locally in your browser.
      </p>
    </footer>
  )
}
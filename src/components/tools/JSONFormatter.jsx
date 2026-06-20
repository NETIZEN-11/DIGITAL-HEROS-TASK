import React, { useState } from 'react'
import { formatJson, minifyJson, validateJson } from '../../utils/json.js'
import CopyButton from '../shared/CopyButton.jsx'

const SAMPLE = `{
  "name": "Smart Tools Hub",
  "stack": ["React", "Vite", "Tailwind"],
  "active": true,
  "version": 1
}`

export default function JSONFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [error, setError] = useState(null)

  function handleFormat() {
    try {
      setOutput(formatJson(input, indent))
      setError(null)
    } catch (err) {
      // Use ?? not || so a legitimate 0 from parseOrThrow isn't masked to 1.
      setError({ message: err.message, line: err.line ?? 1, column: err.column ?? 1 })
      setOutput('')
    }
  }

  function handleMinify() {
    try {
      setOutput(minifyJson(input))
      setError(null)
    } catch (err) {
      setError({ message: err.message, line: err.line ?? 1, column: err.column ?? 1 })
      setOutput('')
    }
  }

  function handleValidate() {
    const v = validateJson(input)
    if (v.valid) {
      setError({ message: '✓ Valid JSON', line: 0, column: 0, ok: true })
    } else {
      setError({ message: v.error, line: 1, column: 1 })
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError(null)
  }

  function loadSample() {
    setInput(SAMPLE)
    setOutput('')
    setError(null)
  }

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button onClick={handleFormat} className="btn-primary flex-1 sm:flex-none bg-gradient-to-r from-lime-500 to-green-600 shadow-lime-500/30 hover:shadow-lime-500/40">
          Format
        </button>
        <button onClick={handleMinify} className="btn-secondary flex-1 sm:flex-none">Minify</button>
        <button onClick={handleValidate} className="btn-secondary flex-1 sm:flex-none">Validate</button>
        <button onClick={loadSample} className="btn-secondary flex-1 sm:flex-none">Sample</button>
        <button onClick={handleClear} className="btn-secondary flex-1 sm:flex-none">Clear</button>

        <div className="flex items-center gap-1 ml-auto bg-slate-100 rounded-lg p-1">
          {[2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`px-3 py-1 text-xs font-bold rounded ${indent === n ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
            >
              {n} spaces
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="jsonin" className="text-sm font-bold text-slate-700">Input</label>
            <span className="text-xs text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            id="jsonin"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="input-field font-mono text-xs h-96 resize-y"
            placeholder="Paste JSON here…"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="jsonout" className="text-sm font-bold text-slate-700">Output</label>
            <CopyButton text={output} label="Copy" />
          </div>
          <textarea
            id="jsonout"
            value={output}
            readOnly
            spellCheck={false}
            className="input-field font-mono text-xs h-96 resize-y bg-slate-50"
            placeholder="Formatted JSON will appear here…"
          />
        </div>
      </div>

      {error && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm font-medium border-2 ${
            error.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {error.ok ? error.message : `${error.message}${error.line ? ` (line ${error.line}, column ${error.column})` : ''}`}
        </div>
      )}
    </div>
  )
}
import React, { useRef, useState } from 'react'
import { mergePdfs, getPdfPageCount } from '../../utils/pdf.js'
import DownloadButton from '../shared/DownloadButton.jsx'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function PDFMerger() {
  // Each entry: { id, file, pageCount }. We store pageCount on the same
  // object so it stays attached even after reorders — no key collisions when
  // the user picks the same file twice in a row.
  const [items, setItems] = useState([])
  const [mergedBlob, setMergedBlob] = useState(null)
  const [mergedName, setMergedName] = useState('merged.pdf')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [draggingIndex, setDraggingIndex] = useState(null)
  const inputRef = useRef(null)
  const idCounter = useRef(0)

  function nextId() {
    idCounter.current += 1
    return `f${idCounter.current}`
  }

  function handleFiles(picked) {
    const pdfFiles = Array.from(picked).filter(
      (f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name)
    )
    if (pdfFiles.length === 0) {
      setError('Please pick one or more PDF files.')
      return
    }
    setError('')
    setMergedBlob(null)
    const newItems = pdfFiles.map((f) => ({ id: nextId(), file: f, pageCount: null }))
    setItems((prev) => [...prev, ...newItems])
    // Read page counts in the background — each item updates itself.
    newItems.forEach((item) => {
      getPdfPageCount(item.file).then((c) => {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, pageCount: c } : it))
        )
      })
    })
  }

  function handleInputChange(e) {
    handleFiles(e.target.files)
    e.target.value = '' // allow re-selecting same file
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function removeFile(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setMergedBlob(null)
  }

  function moveFile(from, to) {
    if (to < 0 || to >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
    setMergedBlob(null)
  }

  function handleRowDragStart(index) {
    setDraggingIndex(index)
  }

  function handleRowDragOver(e) {
    e.preventDefault()
  }

  function handleRowDrop(targetIndex) {
    if (draggingIndex === null || draggingIndex === targetIndex) {
      setDraggingIndex(null)
      return
    }
    moveFile(draggingIndex, targetIndex)
    setDraggingIndex(null)
  }

  function clearAll() {
    setItems([])
    setMergedBlob(null)
    setError('')
  }

  async function handleMerge() {
    if (items.length < 1) {
      setError('Add at least one PDF file first.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const files = items.map((it) => it.file)
      const { blob, filename } = await mergePdfs(files)
      setMergedBlob(blob)
      setMergedName(filename)
    } catch (err) {
      setError(err.message || 'Failed to merge PDFs.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <section className="lg:col-span-3" aria-label="PDF list">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-600" />
              <h2 className="text-xl font-bold text-slate-900">Files ({items.length})</h2>
            </div>
            {items.length > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors">
                Clear all
              </button>
            )}
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-5"
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-semibold text-slate-700">Click to choose PDFs, or drag &amp; drop here</p>
            <p className="text-xs text-slate-500 mt-1">Files never leave your browser</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {items.length > 0 && (
            <ul className="space-y-2">
              {items.map((item, i) => {
                const pages = item.pageCount
                return (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={() => handleRowDragStart(i)}
                    onDragOver={handleRowDragOver}
                    onDrop={() => handleRowDrop(i)}
                    className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-move transition-all ${
                      draggingIndex === i ? 'opacity-50 border-red-300' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.file.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(item.file.size)}
                        {pages == null
                          ? ' • reading…'
                          : pages === 0
                            ? ' • invalid or unsupported'
                            : ` • ${pages} page${pages !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveFile(i, i - 1)}
                        disabled={i === 0}
                        className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(i, i + 1)}
                        disabled={i === items.length - 1}
                        className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"
                        aria-label="Remove file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {error && <p className="text-xs text-red-600 mt-3 font-medium">{error}</p>}
        </div>
      </section>

      <section className="lg:col-span-2" aria-label="Merge action">
        <div className="card p-6 sm:p-8 animate-slide-up sticky top-20">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-600" />
            <h2 className="text-xl font-bold text-slate-900">Merge</h2>
          </div>

          <p className="text-sm text-slate-600 mb-5">
            Combine all selected PDFs in the order shown. The merged file will contain all pages from all inputs.
          </p>

          <button
            type="button"
            onClick={handleMerge}
            disabled={items.length === 0 || busy}
            className="btn-primary bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30 hover:shadow-red-500/40 mb-3"
          >
            {busy ? 'Merging…' : 'Merge & Download'}
          </button>

          {mergedBlob && (
            <DownloadButton
              getBlob={() => mergedBlob}
              filename={mergedName}
              label={`Download ${mergedName}`}
              className="w-full"
            />
          )}

          <div className="mt-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              100% private
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Merging happens in your browser. Files are never uploaded to any server.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

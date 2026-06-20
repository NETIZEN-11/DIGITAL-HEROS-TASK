import React from 'react'

/**
 * DownloadButton — triggers a file download from an in-memory Blob.
 *
 * @param {{ getBlob: () => Blob | null | undefined, filename: string, label?: string, className?: string }} props
 */
export default function DownloadButton({ getBlob, filename, label = 'Download', className = '' }) {
  function handleDownload() {
    const blob = getBlob()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Release the object URL after a short delay to give the browser time to fetch it.
    // 3000ms is safer than 1000ms — on slow mobile networks (especially iOS Safari)
    // the download dialog can take >1s to start, and revoking too early yields a
    // 0-byte file.
    setTimeout(() => URL.revokeObjectURL(url), 3000)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-brand-600 to-purple-600 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {label}
    </button>
  )
}

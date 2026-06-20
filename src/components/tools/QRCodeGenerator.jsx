import React, { useEffect, useState } from 'react'
import { generateQR_SVG, generateQR_PNG, dataURLtoBlob, svgToBlob } from '../../utils/qrcode.js'
import DownloadButton from '../shared/DownloadButton.jsx'

const EC_LEVELS = [
  { value: 'L', label: 'Low (~7%)' },
  { value: 'M', label: 'Medium (~15%)' },
  { value: 'Q', label: 'Quartile (~25%)' },
  { value: 'H', label: 'High (~30%)' },
]

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://digitalheroesco.com')
  const [ecLevel, setECLevel] = useState('M')
  const [size, setSize] = useState(512)
  const [fg, setFg] = useState('#1f2c8c')
  const [bg, setBg] = useState('#ffffff')
  const [svg, setSvg] = useState('')
  const [pngURL, setPngURL] = useState('')
  const [error, setError] = useState('')

  // Regenerate on any input change
  useEffect(() => {
    let cancelled = false
    async function regen() {
      if (!text.trim()) {
        setSvg('')
        setPngURL('')
        setError('')
        return
      }
      try {
        const [s, p] = await Promise.all([
          generateQR_SVG(text, { fg, bg, errorCorrectionLevel: ecLevel }),
          generateQR_PNG(text, { width: size, fg, bg, errorCorrectionLevel: ecLevel }),
        ])
        if (cancelled) return
        setSvg(s)
        setPngURL(p)
        setError('')
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to generate QR code')
        setSvg('')
        setPngURL('')
      }
    }
    regen()
    return () => { cancelled = true }
  }, [text, fg, bg, ecLevel, size])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      <section className="lg:col-span-3" aria-label="QR input">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Content</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="qrtext" className="label-text">Text or URL</label>
              <textarea
                id="qrtext"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Enter text or a URL…"
                className="input-field resize-y font-mono text-sm"
              />
              <p className="helper-text">{text.length}/500 characters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eclevel" className="label-text">Error Correction</label>
                <select id="eclevel" value={ecLevel} onChange={(e) => setECLevel(e.target.value)} className="input-field">
                  {EC_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="size" className="label-text">PNG Size</label>
                <select id="size" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} className="input-field">
                  <option value={128}>128 × 128</option>
                  <option value={256}>256 × 256</option>
                  <option value={512}>512 × 512</option>
                  <option value={1024}>1024 × 1024</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fg" className="label-text">Foreground</label>
                <div className="flex gap-2">
                  <input id="fg" type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-12 w-12 rounded-lg cursor-pointer border-2 border-slate-200" />
                  <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="input-field flex-1 font-mono text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="bg" className="label-text">Background</label>
                <div className="flex gap-2">
                  <input id="bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-12 w-12 rounded-lg cursor-pointer border-2 border-slate-200" />
                  <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="input-field flex-1 font-mono text-sm" />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          </div>
        </div>
      </section>

      <section className="lg:col-span-2" aria-label="QR preview">
        <div className="card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Preview</h2>
          </div>

          <div className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 mb-5" style={{ minHeight: '320px' }}>
            {pngURL ? (
              <img
                src={pngURL}
                alt="Generated QR code preview"
                // Cap the on-screen preview at 480px regardless of the
                // selected size — the actual PNG download still uses the
                // requested size, so what you see is roughly what you get.
                style={{ width: `${Math.min(size, 480)}px`, height: `${Math.min(size, 480)}px` }}
                className="max-w-full h-auto"
              />
            ) : svg ? (
              <div
                className="max-w-full"
                style={{ width: `${Math.min(size, 480)}px`, height: `${Math.min(size, 480)}px` }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <p className="text-sm text-slate-400">Enter content to generate</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <DownloadButton
              getBlob={() => (svg ? svgToBlob(svg) : null)}
              filename="qrcode.svg"
              label="Download SVG"
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            />
            <DownloadButton
              getBlob={() => (pngURL ? dataURLtoBlob(pngURL) : null)}
              filename={`qrcode-${size}.png`}
              label={`Download ${size}px PNG`}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            />
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            🔒 Generated entirely in your browser. Nothing uploaded.
          </p>
        </div>
      </section>
    </div>
  )
}
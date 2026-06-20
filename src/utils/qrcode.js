/**
 * QR code generation — thin wrapper over the `qrcode` npm package.
 *
 * We keep the wrapper small so swapping libraries later only touches this file.
 */

import QRCode from 'qrcode'

/**
 * Generate a QR code as an SVG string.
 * @param {string} text
 * @param {{ fg?: string, bg?: string, errorCorrectionLevel?: 'L'|'M'|'Q'|'H', margin?: number }} [opts]
 * @returns {Promise<string>}
 */
export async function generateQR_SVG(text, opts = {}) {
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: opts.errorCorrectionLevel || 'M',
    margin: opts.margin ?? 2,
    color: { dark: opts.fg || '#1f2c8c', light: opts.bg || '#ffffff' },
  })
}

/**
 * Generate a QR code as a PNG data URL.
 * @param {string} text
 * @param {{ width?: number, fg?: string, bg?: string, errorCorrectionLevel?: 'L'|'M'|'Q'|'H', margin?: number }} [opts]
 * @returns {Promise<string>} data: URL
 */
export async function generateQR_PNG(text, opts = {}) {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: opts.errorCorrectionLevel || 'M',
    margin: opts.margin ?? 2,
    width: opts.width || 512,
    color: { dark: opts.fg || '#1f2c8c', light: opts.bg || '#ffffff' },
  })
}

/**
 * Convert a PNG data URL into a Blob (for download).
 * @param {string} dataURL
 * @returns {Blob}
 */
export function dataURLtoBlob(dataURL) {
  const [meta, b64] = dataURL.split(',')
  const mime = (meta.match(/data:(.*?);base64/) || [, 'image/png'])[1]
  const bin = atob(b64)
  const len = bin.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

/**
 * Convert an SVG string into a Blob for download.
 * @param {string} svg
 * @returns {Blob}
 */
export function svgToBlob(svg) {
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
}
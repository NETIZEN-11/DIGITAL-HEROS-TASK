/**
 * PDF utilities — merge multiple PDFs using pdf-lib. Runs entirely client-side.
 */

import { PDFDocument } from 'pdf-lib'

/**
 * Merge the given list of PDF files (in order) into one new PDF blob.
 *
 * @param {File[]} files
 * @returns {Promise<{ blob: Blob, pageCount: number, filename: string }>}
 */
export async function mergePdfs(files) {
  if (!files || files.length === 0) {
    throw new Error('No files to merge')
  }

  const merged = await PDFDocument.create()
  let totalPages = 0

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    let src
    try {
      src = await PDFDocument.load(bytes, { ignoreEncryption: true })
    } catch (err) {
      throw new Error(`"${file.name}" is not a valid or supported PDF.`)
    }
    const pageIndices = src.getPageIndices()
    const copied = await merged.copyPages(src, pageIndices)
    copied.forEach((page) => merged.addPage(page))
    totalPages += copied.length
  }

  const out = await merged.save()
  return {
    blob: new Blob([out], { type: 'application/pdf' }),
    pageCount: totalPages,
    filename: defaultMergeName(files),
  }
}

function defaultMergeName(files) {
  if (files.length === 1) {
    return files[0].name.replace(/\.pdf$/i, '') + '-merged.pdf'
  }
  return `merged-${new Date().toISOString().slice(0, 10)}.pdf`
}

/**
 * Read the first page of a PDF to extract its page count (used in the file list).
 * @param {File} file
 * @returns {Promise<number>}
 */
export async function getPdfPageCount(file) {
  try {
    const bytes = await file.arrayBuffer()
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    return doc.getPageCount()
  } catch {
    return 0
  }
}
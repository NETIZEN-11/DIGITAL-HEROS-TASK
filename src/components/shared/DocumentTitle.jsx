import { useEffect } from 'react'

/**
 * DocumentTitle — sets `document.title` for the lifetime of the component.
 *
 * Pass a `tool` (from TOOLS) to render "Tool Name — Smart Tools Hub".
 * Pass a literal `title` for non-tool pages (e.g. 404, home).
 */
const SUFFIX = 'Smart Tools Hub'

export default function DocumentTitle({ tool, title }) {
  useEffect(() => {
    const next = title ? `${title} — ${SUFFIX}` : `${tool.name} — ${SUFFIX}`
    document.title = next
  }, [tool, title])
  return null
}

import React from 'react'
import PageHeader from './PageHeader.jsx'
import DocumentTitle from './DocumentTitle.jsx'

/**
 * ToolPage — wrapper that combines PageHeader + content area + per-tool <title>.
 * Use as: <ToolPage tool={tool}>...content...</ToolPage>
 */
export default function ToolPage({ tool, children }) {
  return (
    <>
      <DocumentTitle tool={tool} />
      <PageHeader tool={tool} />
      <div className="space-y-6">{children}</div>
    </>
  )
}

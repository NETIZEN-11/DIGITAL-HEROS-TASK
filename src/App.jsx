import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import HomePage from './pages/HomePage.jsx'
import EMIPage from './pages/emi/EMIPage.jsx'
import NotFoundPage from './components/shared/NotFoundPage.jsx'
import ToolPage from './components/shared/ToolPage.jsx'
import { getToolById } from './data/tools.js'

// Lazy-load the 7 new tool pages so the home + EMI page stay light.
// They are tiny on their own but each pulls in a few KB of code (PDF / QR libs).
const GSTCalculator = lazy(() => import('./components/tools/GSTCalculator.jsx'))
const QRCodeGenerator = lazy(() => import('./components/tools/QRCodeGenerator.jsx'))
const ResumeBuilder = lazy(() => import('./components/tools/ResumeBuilder.jsx'))
const JSONFormatter = lazy(() => import('./components/tools/JSONFormatter.jsx'))
const PasswordGenerator = lazy(() => import('./components/tools/PasswordGenerator.jsx'))
const AgeCalculator = lazy(() => import('./components/tools/AgeCalculator.jsx'))
const PDFMerger = lazy(() => import('./components/tools/PDFMerger.jsx'))

// Single source of truth: each entry references the tool's id from `tools.js`,
// so the path is looked up automatically — no duplicated path strings.
const LAZY_TOOLS = [
  { id: 'gst', Component: GSTCalculator },
  { id: 'qrcode', Component: QRCodeGenerator },
  { id: 'resume', Component: ResumeBuilder },
  { id: 'json', Component: JSONFormatter },
  { id: 'password', Component: PasswordGenerator },
  { id: 'age', Component: AgeCalculator },
  { id: 'pdf', Component: PDFMerger },
]

function LazyTool({ tool, Component }) {
  return (
    <ToolPage tool={tool}>
      <Component />
    </ToolPage>
  )
}

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="/tools/emi" element={<EMIPage />} />
            {LAZY_TOOLS.map(({ id, Component }) => {
              const tool = getToolById(id)
              return (
                <Route
                  key={id}
                  path={tool.path}
                  element={<LazyTool tool={tool} Component={Component} />}
                />
              )
            })}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

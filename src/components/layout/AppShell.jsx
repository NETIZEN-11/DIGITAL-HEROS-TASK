import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import MobileNav from './MobileNav.jsx'
import Footer from '../Footer.jsx'

/**
 * AppShell — sidebar + content + footer layout used by every route.
 */
export default function AppShell() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />

        <main id="main-content" aria-label="Tool content" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 print:p-0">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}

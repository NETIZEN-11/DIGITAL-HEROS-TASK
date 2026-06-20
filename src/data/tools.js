// Single source of truth for the 8 tools.
// Sidebar, mobile nav, home grid, and 404 page all read from this list —
// adding a tool means adding one entry here and one route in App.jsx.

const ICONS = {
  emi: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  gst: 'M9 14l6-6m-6 0l6 6M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  qrcode: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
  resume: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  json: 'M10 20l-5-5 5-5M14 4l5 5-5 5',
  password: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  age: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  pdf: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
}

export const TOOLS = [
  {
    id: 'emi',
    name: 'EMI Calculator',
    tagline: 'Monthly installments for any loan',
    icon: ICONS.emi,
    path: '/tools/emi',
    color: 'from-brand-500 to-purple-600',
    badge: 'Popular',
  },
  {
    id: 'gst',
    name: 'GST Calculator',
    tagline: 'Add or remove GST instantly',
    icon: ICONS.gst,
    path: '/tools/gst',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    tagline: 'Generate & download QR codes',
    icon: ICONS.qrcode,
    path: '/tools/qr-code',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'resume',
    name: 'Resume Builder',
    tagline: 'Print a polished resume in minutes',
    icon: ICONS.resume,
    path: '/tools/resume',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'json',
    name: 'JSON Formatter',
    tagline: 'Format, minify & validate JSON',
    icon: ICONS.json,
    path: '/tools/json',
    color: 'from-lime-500 to-green-600',
  },
  {
    id: 'password',
    name: 'Password Generator',
    tagline: 'Cryptographically secure passwords',
    icon: ICONS.password,
    path: '/tools/password',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'age',
    name: 'Age Calculator',
    tagline: 'Exact age + next-birthday countdown',
    icon: ICONS.age,
    path: '/tools/age',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    id: 'pdf',
    name: 'PDF Merger',
    tagline: 'Combine PDFs locally — no upload',
    icon: ICONS.pdf,
    path: '/tools/pdf-merger',
    color: 'from-red-500 to-rose-600',
  },
]

export function getToolByPath(pathname) {
  return TOOLS.find((t) => t.path === pathname) || null
}

export function getToolById(id) {
  return TOOLS.find((t) => t.id === id) || null
}

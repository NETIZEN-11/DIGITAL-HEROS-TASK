# Smart Tools Hub

A modern, fast, and responsive workspace featuring **8 free browser-based utilities** built with **React 18 + Vite 5 + Tailwind CSS 3**. Designed with clean aesthetics, micro-animations, and full responsiveness, the hub focuses heavily on user privacy: all calculations and file processing happen 100% locally on the user's device.

🔗 **Live Site:** [https://github.com/NETIZEN-11/DIGITAL-HEROS-TASK](https://github.com/NETIZEN-11/DIGITAL-HEROS-TASK)

---

## ✨ Available Tools

### 1. 🧮 EMI Calculator (Equated Monthly Installment)
- **Features:** Instant monthly EMI, total interest, and total payment calculations. Includes interactive year-wise amortization charts (principal vs. interest) and input validation.
- **Tech/Libs:** `recharts` for visualization.

### 2. 📊 GST Calculator (Goods and Services Tax)
- **Features:** Instantly add or remove GST with one-click presets (5%, 12%, 18%, 28%) or custom tax rates. Provides a clear breakdown of CGST, SGST, and the final/base amount.

### 3. 📷 QR Code Generator
- **Features:** Generate customizable QR codes from text or URLs. Customize foreground/background colors and error correction level (L, M, Q, H). Download output as SVG or high-resolution PNG.
- **Tech/Libs:** `qrcode`.

### 4. 📄 Resume Builder
- **Features:** Enter details (personal info, experience, education, skills, projects) and instantly preview a clean, professional resume. Designed with print-optimized styling to save/print as a PDF.

### 5. 💻 JSON Formatter
- **Features:** Beautify (2 or 4 spaces indentation), minify, and validate JSON data. Highlights syntax errors with helpful line and column numbers.

### 6. 🔑 Password Generator
- **Features:** Create cryptographically secure random passwords. Configure lengths from 6 to 64 characters and toggle uppercase, lowercase, numbers, and symbols. Displays real-time entropy estimation in bits.

### 7. 📅 Age Calculator
- **Features:** Calculates your exact age in years, months, and days, along with a countdown showing the days and months remaining until your next birthday.

### 8. 📎 PDF Merger
- **Features:** Drag-and-drop or select multiple PDFs, reorder them using smooth drag-and-drop handles, and merge them into a single file completely offline.
- **Tech/Libs:** `pdf-lib` for client-side assembly.

---

## 🔒 Privacy First

No files, entries, or passwords ever leave your computer. 
- All calculations run locally in JavaScript.
- PDF merging and QR generation happen inside the browser sandbox.
- No analytics trackers or remote databases.

---

## 🛠 Tech Stack

- **Framework:** React 18 (with lazy loading for heavy tool dependencies)
- **Build Tool:** Vite 5 (optimized chunk sizes, fast HMR)
- **Styles:** Tailwind CSS 3 & custom modern glassmorphic theme
- **Icons:** SVG-based responsive vector paths
- **Deployment:** Vercel (SPA rewrite routing configured)

---

## 🚀 Run Locally

Ensure you have [Node.js](https://nodejs.org) installed.

```bash
# Clone the repository
git clone https://github.com/NETIZEN-11/DIGITAL-HEROS-TASK.git
cd DIGITAL-HEROS-TASK

# Install dependencies
npm install

# Run the development server
npm run dev      # http://localhost:5173

# Build production assets
npm run build    # output goes to ./dist

# Preview production build locally
npm run preview
```

---

## 📁 Directory Structure

```
smart-tools-hub/
├── public/                # Static assets (Favicons, OG Images)
├── src/
│   ├── components/
│   │   ├── emi/           # EMI Calculator parts (Chart, Form, ResultsCard)
│   │   ├── home/          # Homepage Hero grid
│   │   ├── layout/        # Sidebar, AppShell, Mobile Nav structure
│   │   ├── shared/        # Reusable buttons, Title handlers, Copy utilities
│   │   └── tools/         # Individual tool views (GST, PDF, QR, etc.)
│   ├── data/
│   │   └── tools.js       # Central tools registry & metadata
│   ├── utils/
│   │   └── *.js           # Native JS utility math & helper logic
│   ├── App.jsx            # Routing and React entry setup
│   ├── main.jsx           # ReactDOM root mount
│   └── index.css          # Tailwind and global overrides
├── index.html             # HTML Shell with SEO Meta Tags
├── tailwind.config.js     # Brand colors and custom transition keyframes
└── vercel.json            # Vercel client-side routing configs
```

---

## 👤 Author

**Nitesh Kumar** · [kumarnitesh979875@gmail.com](mailto:kumarnitesh979875@gmail.com)

> Built for [Digital Heroes](https://digitalheroesco.com)
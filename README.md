# Smart EMI Calculator

A modern, free, production-ready EMI (Equated Monthly Installment) calculator built with **React + Vite + Tailwind CSS**. Calculate monthly EMI, total interest, and total payment instantly. Includes a yearly amortization chart and full input validation.

## ✨ Features

- ⚡ **Instant calculations** — EMI, total interest, total payment
- 📊 **Year-wise amortization chart** — visualise principal vs interest
- 📱 **Fully responsive** — mobile-first, works on any screen
- 🎨 **Modern UI** — gradient backgrounds, smooth animations, card layouts
-  **Robust validation** — empty / invalid / out-of-range inputs caught
- 🔒 **Privacy-first** — all math runs locally in your browser, nothing sent anywhere
- ♿ **Accessible** — proper labels, ARIA attributes, keyboard friendly

## 🧮 Formula

```
EMI = [P × R × (1 + R)^N] / [(1 + R)^N − 1]

P = Principal loan amount
R = Monthly interest rate = Annual Rate / 12 / 100
N = Loan tenure in months
```

## 🛠 Tech Stack

- **React 18** — UI
- **Vite 5** — dev server + build
- **Tailwind CSS 3** — styling
- **Recharts** — amortization chart

## 🚀 Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → ./dist
npm run preview  # preview the production build
```

## 📁 Project structure

```
smart-emi-calculator/
├── public/favicon.svg
├── src/
│   ├── components/   (Header, EMIForm, ResultsCard, EMIChart, Footer)
│   ├── utils/        (calculations.js — EMI math + validation)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

## 🌐 Deploy on Vercel

1. Push the repo to GitHub.
2. Import the repo in Vercel (https://vercel.com/new).
3. Vercel auto-detects Vite — no config needed (a `vercel.json` is included as a safety net).
4. Click **Deploy**. Live in ~30s.

## 👤 Author

**Nitesh Kumar** · `kumarnitesh979875@gmail.com`

> Built for [Digital Heroes](https://digitalheroesco.com)
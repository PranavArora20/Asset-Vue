# AssetVue — Real‑time Portfolio Tracker

Track your investments with live data, beautiful visuals, and actionable insights. AssetVue lets you add holdings, see real‑time performance, compare asset classes, and understand the time value of your returns — all with a clean, dark‑mode friendly UI.

## Introduction
AssetVue is a React + Redux portfolio tracker powered by Firebase Realtime Database. It helps you:
- Add/remove holdings (stocks, bonds, crypto)
- Sync changes in real‑time across sessions
- Auto‑fetch current prices and compute gain/loss
- Filter by asset type and visualize your portfolio with charts
- Analyze Time Value of Money (inflation‑adjusted returns)

It’s built with a modern, maintainable architecture and attention to accessibility and dark‑mode styling.

## Project Type
Frontend (with BAAS(Backend As a Service): Firebase Realtime Database)

## Deployed App
- Frontend: [View](https://asset-vue.netlify.app/)

Tip: After you deploy (e.g., Netlify/Vercel), add the VITE_ environment variables in the hosting platform settings.

## Directory Structure
```
AssetVue/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ AssetChart.jsx         # Recharts pie/bar charts
│  │  ├─ AssetForm.jsx          # Add a new asset
│  │  ├─ Navbar.jsx,            # App header
│  │  ├─ ThemeSwitch.jsx,       # Dark mode toggle
│  │  └─ portfolio.css          # Light/Dark styles, gain/loss, TVM styles
│  ├─ Pages/
│  │  ├─ Home.jsx,              # Landing screen that orients the user and links into the app
│  │  ├─ Portfolio.jsx,         # Main portfolio view: filters, totals, charts, TVM
│  │  └─ Compare.jsx            # Compare stocks/bonds/crypto performance
│  ├─ redux/
│  │  ├─ store.js               # A Single Source Of Truth (Redux store)
│  │  └─ PortfolioSlice.js      # assets state + setAssets reducer
│  │  └─ ThemeSlice.js          # Centralizes theme state in Redux
│  ├─ services/
│  │  ├─ apiService.js          # Price fetching utilities
│  │  └─ firebaseService.js     # RTDB add/delete/subscribe
│  ├─ utils/
│  │  └─ firebase.js            # Firebase init (uses env variables)
│  ├─ App.jsx,                  # Global layout and routing
│  ├─ main.jsx                  # Bootstraps the app
│  └─ index.css
├─ .gitignore
├─ package.json
└─ README.md
```

## Video Walkthrough of the project
- 1–3 minutes demo:
  - Toggle dark mode in the navbar
  - Add an asset in Portfolio → see totals update in real‑time
  - Apply filters (All/Stocks/Bonds/Crypto)
  - View charts (allocation pie, invested vs current bar)
  - Open Time Value of Money analysis, set year, see inflation‑adjusted results
  - Remove a holding, watch the UI sync instantly

## Video Walkthrough of the codebase
- 1–5 minutes overview:
  - App.jsx: Firebase RTDB subscription → Redux `setAssets`
  - `firebaseService.js`: add/delete/subscribe helpers
  - `Portfolio.jsx`: derived metrics with `useMemo`, gain/loss compute, TVM
  - `AssetChart.jsx`: Recharts setup
  - `portfolio.css`: light/dark theme, accessible color tokens

## Features
- Real‑time data: Firebase RTDB streams updates into Redux
- Add/remove assets with instant UI sync
- Auto price fetching and per‑asset gain/loss
- Filter by asset type (Stocks/Bonds/Crypto)
- Charts: allocation (pie), invested vs current (bar)
- Time Value of Money analysis (inflation‑adjusted returns)
- Dark mode with high‑contrast profit/loss styling

## Design decisions & assumptions
- Chose Firebase RTDB for speed, simplicity, and real‑time updates (no custom backend needed).
- Memoized portfolio computations (`useMemo`) to keep UI snappy on data changes.
- Price fetching is abstracted in `apiService.js` so you can swap out data sources easily.
- Light mode uses subtle colors; dark mode uses high‑contrast colors for readability.

## Installation & Getting started
Prereqs: Node 18+, Firebase project with Realtime Database enabled.

1) Clone & install
```
git clone https://github.com/your-username/AssetVue.git
cd AssetVue
npm install
```

2) Environment variables (create `.env` in project root)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=asset-vue
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=https://asset-vue-default-rtdb.firebaseio.com
```

Do not commit your `.env` file. `.gitignore` already ignores it.

3) Run
```
npm run dev
```
Open the printed URL in your browser.

## Usage
- Add assets from the Portfolio page (symbol, type, purchase price, quantity).
- Use filters to focus on Stocks/Bonds/Crypto.
- Review totals and per‑asset gain/loss.
- Explore charts for a visual breakdown.
- Use the Time Value of Money panel to see inflation‑adjusted results.
- Remove holdings with the “Remove” button.


## Credentials
Not required (no auth flow). If you fork and enable Firebase rules, document any demo credentials here.

## APIs Used
- Firebase Realtime Database: stores portfolio assets and streams live updates.
- Finnhub: fetches real-time stock prices.
- CoinGecko: fetches crypto prices.
- Financial Modeling Prep: fetches bond/treasury prices.

## Technology Stack
- React (Vite), Redux Toolkit
- Firebase Realtime Database
- Recharts (visualizations)
- CSS (custom, with dark mode)
- AntDesign (UI components)
- UiVerse (animations)

# 📄 Invoice Management App

A fully functional, responsive Invoice Management Application built with React + Vite. Supports full CRUD, status tracking, dark/light mode, filtering by status, and data persistence via localStorage.

---

## 🚀 Live Demo

> 

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 8+

### Install & Run

```bash
# Clone the repo
git clone <your-repo-url>
cd hng-invoice-app

# Install dependencies
npm install

# Start development server
npm run dev
```

App will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
# Output in /dist — deploy this folder
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## 🏗 Architecture

```
src/
├── components/
│   ├── form/
│   │   └── InvoiceForm.jsx     # Slide-out drawer form (create + edit)
│   ├── invoice/
│   │   ├── InvoiceCard.jsx     # Single invoice card (list item)
│   │   ├── InvoiceList.jsx     # List renderer with filter logic
│   │   └── StatusBadge.jsx     # Paid / Pending / Draft badge
│   ├── layout/
│   │   └── Sidebar.jsx         # Navigation sidebar (vertical desktop, top bar mobile)
│   └── ui/
│       └── DeleteModal.jsx     # Accessible confirmation modal
├── context/
│   ├── InvoiceContext.jsx      # Global invoice state + localStorage persistence
│   └── ThemeContext.jsx        # Dark/light theme state + localStorage persistence
├── data/
│   └── invoices.json           # Seed data — 7 sample invoices
├── hooks/
│   ├── useLocalStorage.js      # Generic localStorage hook
│   └── useResponsive.ts        # Breakpoint detection hook
├── pages/
│   ├── Invoices.jsx            # Invoice list page (home)
│   └── InvoiceDetails.jsx      # Invoice detail view
├── styles/
│   ├── global.css              # CSS variables, reset, base styles
│   ├── Sidebar.css             # Sidebar layout
│   ├── Invoices.css            # List page + filter + header
│   ├── InvoiceDetails.css      # Detail page + delete modal
│   ├── InvoiceForm.css         # Form drawer styles
│   ├── InvoiceCard.css         # Card styles
│   └── StatusBadge.css         # Badge colours
└── utils/
    └── validation.js           # Email regex, required field, positive number checks
```

### Data Flow

1. `ThemeProvider` — reads `localStorage('hng-invoice-theme')` on load, applies `.dark-theme` to `<body>`
2. `InvoiceProvider` — reads `localStorage('hng-invoice-app-invoices')` on load; seeds from `invoices.json` if empty
3. All CRUD operations update React state → `useEffect` persists to `localStorage`
4. Components consume context via `useContext(InvoiceContext)` and `useContext(ThemeContext)`

---

## ⚖️ Trade-offs

| Decision | Rationale |
|---|---|
| **localStorage over IndexedDB** | Simple key-value persistence is sufficient for invoice data at this scale; no async complexity |
| **Seed data from JSON** | Ensures every new device gets working sample data without a backend |
| **CSS modules (custom CSS)** | Maximum control over dark mode, animations, and responsive layout without Tailwind utility class clutter |
| **Single-file pages** | Keeps related logic co-located; smaller pages stay readable without over-engineering |
| **No TypeScript in .jsx files** | Mixing `.tsx` and `.jsx` was causing import confusion; pure JSX is simpler for this scope |

---

## ♿ Accessibility Notes

- **Semantic HTML**: `<header>`, `<main>`, `<aside>`, `<nav>`, `<article>`, `<address>` used throughout
- **Form labels**: Every `<input>` and `<select>` has a corresponding `<label htmlFor="...">`
- **Buttons**: All interactive elements are `<button>` or `tabIndex={0}` divs with `onKeyDown`
- **Delete Modal**:
  - `role="dialog"` + `aria-modal="true"` + `aria-labelledby` / `aria-describedby`
  - **ESC key** closes the modal
  - **Focus trap**: Tab cycles only between Cancel and Delete buttons
  - Focus is moved to Cancel button on open
- **Status Badge**: `aria-label` includes "Status: paid/pending/draft"
- **Invoice Card**: `aria-label` describes invoice ID, client name, amount and status
- **Filter**: `aria-expanded`, `aria-haspopup`, `aria-controls` on the filter trigger
- **Color contrast**: All text/background combinations pass WCAG AA (4.5:1 minimum)
- **Focus visible**: Custom `:focus-visible` outline on all interactive elements

---

## ✨ Features Beyond Requirements

- **Seed data** — 7 sample invoices load on any fresh device (no empty state on first visit)
- **Filter counter badge** — shows how many filters are active
- **Animated empty state** — floating SVG illustration
- **Smooth animations** — form drawer slides in, modal pops in, dropdown fades in
- **League Spartan font** — matches the original Figma design font
- **Keyboard navigation** — full keyboard support on cards, sidebar logo, modal
- **Skip link** (global.css) — hidden skip-to-content link for screen readers
- **Print styles** — sidebar hidden on print
- **Custom scrollbar** — subtle webkit scrollbar styling

---

## 📋 Status Logic

| Current Status | Can Mark as Paid | Can Edit | Can Delete |
|---|---|---|---|
| Draft | ✅ | ✅ | ✅ |
| Pending | ✅ | ✅ | ✅ |
| Paid | ❌ (already paid) | ✅ | ✅ |

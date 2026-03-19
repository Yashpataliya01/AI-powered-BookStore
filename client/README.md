# 📚 Folio — Online Bookstore

A modern, minimal, and responsive online bookstore built with **React**, **Redux Toolkit**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- 🏠 **Homepage** — Hero section, category browser, bestsellers, featured banner, new arrivals, testimonials
- 🛍️ **Shop Page** — Full catalog with sidebar filters (category, rating), search, and sort
- 📖 **Book Detail Page** — Rich product page with related books
- 🛒 **Cart Drawer** — Slide-in cart with quantity controls
- ❤️ **Wishlist** — Save books for later
- 💳 **Checkout** — Multi-step: Shipping → Payment → Review → Confirmation
- 🏷️ **Categories Page** — Visual category grid
- ⭐ **Bestsellers & New Arrivals** pages
- 🌗 **Dark / Light Mode** — Warm editorial palette
- 🔍 **Search Modal** — Live search with results
- 📱 **Fully Responsive** — Mobile-first design

---

## 🛠️ Tech Stack

| Tech | Purpose |
|---|---|
| React 18 | UI framework |
| Redux Toolkit | State management (cart, wishlist, filters, UI) |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Vite | Build tool |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx        # Root layout wrapper
│   │   ├── Navbar.tsx        # Sticky nav with cart, search, theme toggle
│   │   ├── Footer.tsx        # Footer with newsletter
│   │   ├── CartDrawer.tsx    # Slide-in cart
│   │   └── SearchModal.tsx   # Search overlay
│   └── ui/
│       └── BookCard.tsx      # Book card (default, compact, featured)
├── pages/
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── BookDetailPage.tsx
│   ├── WishlistPage.tsx
│   ├── CheckoutPage.tsx
│   ├── CategoriesPage.tsx
│   ├── BestsellersPage.tsx
│   └── NewArrivalsPage.tsx
├── store/
│   ├── index.ts              # Redux store
│   └── slices/
│       ├── cartSlice.ts
│       ├── wishlistSlice.ts
│       ├── filterSlice.ts
│       └── uiSlice.ts
├── hooks/
│   └── index.ts              # Typed hooks & selectors
├── data/
│   └── books.ts              # Mock book data
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css                 # CSS variables + Tailwind
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## 🎨 Design System

- **Font**: Cormorant Garamond (display) + DM Sans (body)
- **Theme**: Warm editorial palette — cream whites, terracotta accent
- **Dark mode**: Deep espresso tones with warm accents
- **Accent color**: `#c8622a` (terracotta / burnt orange)

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

# 📚 Folio Bookstore v2

A modern, minimal, production-grade online bookstore built with **React 18**, **Redux Toolkit (RTK Query)**, **TypeScript**, and **Tailwind CSS**.

---

## 🗂️ Folder Structure

```
src/
├── components/
│   ├── authentication/      # (reserved for auth-specific UI widgets)
│   ├── common/              # Reusable: Button, InputField, StarRating, Badge
│   ├── navigation/          # Navbar, SearchModal
│   └── ui/                  # BookCard
│
├── hoc/                     # Higher-order components
│   ├── PrivateRoute.tsx     # Redirects unauthenticated users to /login
│   ├── PublicRoute.tsx      # Redirects authenticated users away from login
│   ├── ModalWrapper.tsx     # Generic portal modal
│   └── SidePopupWrapper.tsx # Slide-in side drawer portal
│
├── layout/                  # App shell pieces
│   ├── MainLayout.tsx       # Root layout (Navbar + Outlet + Footer)
│   ├── CartDrawer.tsx       # Slide-in cart (uses SidePopupWrapper)
│   └── Footer.tsx
│
├── pages/
│   ├── authentication/      # Login / Signup / Forgot Password
│   │   └── LoginPage.tsx
│   ├── public/              # No auth required
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── BookDetailPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── BestsellersPage.tsx
│   │   └── NewArrivalsPage.tsx
│   └── private/             # Auth required (wrapped by PrivateRoute)
│       ├── WishlistPage.tsx
│       ├── CheckoutPage.tsx
│       └── OrdersPage.tsx
│
├── redux/                   # State management
│   ├── store.ts             # Configures RTK store + api middleware
│   ├── authSlice.ts         # User auth state + token
│   ├── cartSlice.ts         # Cart items + drawer state
│   ├── wishlistSlice.ts     # Wishlist items
│   ├── filterSlice.ts       # Shop filters + sort + search
│   └── uiSlice.ts           # Theme + mobile menu + search modal
│
├── routes/
│   └── Router.tsx           # All routes: public, private, auth
│
├── services/                # RTK Query API slices (mirrors image structure)
│   ├── api.ts               # Base query with JWT refresh + 401 redirect
│   ├── authApi.ts           # login, signup, logout, forgotPassword, getMe
│   ├── booksApi.ts          # getBooks, getBookById
│   └── ordersApi.ts         # getOrders, placeOrder
│
├── hooks/
│   └── index.ts             # Typed useAppDispatch/Selector + domain selectors
│
├── data/
│   └── books.ts             # Mock book data (12 books, all categories)
│
├── types/
│   └── index.ts             # Book, CartItem, AuthState, UIState, etc.
│
├── assets/                  # Static assets (images, icons)
├── index.css                # CSS variables (light/dark), Tailwind base
└── main.tsx                 # App entry point
```

---

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Run dev server
npm run dev

# 3. Open
# http://localhost:3000
```

## 🔑 Auth Flow

- `/login` is wrapped by `PublicRoute` — authenticated users are redirected to `/`
- `/wishlist`, `/checkout`, `/orders` are wrapped by `PrivateRoute` — unauthenticated users are redirected to `/login` with `state.from` preserved
- After login, users are sent back to the page they tried to visit

## 🌐 Connecting to a Real Backend

1. Update `baseUrl` in `src/services/api.ts` to your API URL
2. Replace mock `setCredentials()` in `LoginPage.tsx` with `useLoginMutation()` from `authApi.ts`
3. Replace mock orders in `OrdersPage.tsx` with `useGetOrdersQuery()` from `ordersApi.ts`

## 🎨 Design

- **Font**: Playfair Display (display) + DM Sans (body)
- **Accent**: Terracotta `#c8622a`
- **Themes**: Warm parchment (light) + deep espresso (dark)
- Toggle with the moon/sun icon in the navbar

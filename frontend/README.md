# Shopre Frontend

React + TypeScript client for Shopre. It talks to the backend exclusively through the Spring Cloud API Gateway.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4 + ShadCN UI
- React Router 7
- Axios

## Getting started

Prerequisites: Node.js 20.19+ (or 22.12+) and npm, with the backend gateway running on `http://localhost:8081`.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment

| Variable       | Default                 | Description                 |
|----------------|-------------------------|-----------------------------|
| `VITE_API_URL` | `http://localhost:8081` | Base URL of the API gateway |

Create `frontend/.env` to override it:

```bash
VITE_API_URL=http://localhost:8081
```

The frontend origin must match `FRONTEND_URL` in `backend/.env` (default `http://localhost:5173`), otherwise the gateway blocks requests via CORS.

## Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check and build for production  |
| `npm run lint`    | Run ESLint                           |
| `npm run preview` | Preview the production build         |

## Routes

| Path                  | Access    | Page                                      |
|-----------------------|-----------|-------------------------------------------|
| `/`                   | Public    | Home                                      |
| `/shop`               | Public    | Shop with filters and sorting             |
| `/product/:identifier` | Public   | Product detail (slug or ID fallback)      |
| `/categories/:slug`   | Public    | Category listing                          |
| `/deals`              | Public    | Deals                                     |
| `/new`                | Public    | New arrivals                              |
| `/search`             | Public    | Search results                            |
| `/shipping`           | Public    | Shipping help                             |
| `/returns`            | Public    | Returns help                              |
| `/contact`            | Public    | Contact help                              |
| `/faq`                | Public    | FAQ                                       |
| `/signin`             | Public    | Sign in                                   |
| `/signup`             | Public    | Sign up                                   |
| `/dashboard`          | Protected | Account dashboard                         |
| `/cart`               | Protected | Cart                                      |
| `/checkout`           | Protected | Checkout and order placement              |
| `/orders`             | Protected | Order history                             |
| `/orders/:id`         | Protected | Order detail                              |
| `*`                   | Public    | Not found                                 |

## Auth and API flow

- The Axios client in `src/apis/apis.ts` sets the gateway base URL from `VITE_API_URL`.
- The JWT is attached as `Authorization: Bearer <token>`.
- The gateway validates the token and injects `X-USER-ID` for downstream services. The frontend does not send that header itself.
- Session data is stored in `localStorage` under `currentUser` and `userSession`.
- `ProtectedRoute` redirects unauthenticated users away from cart, checkout, orders, and dashboard pages.

## Project structure

```text
src/
├── apis/         # Axios client and API functions
├── components/   # UI, product, order, auth, and layout components
├── context/      # AuthContext and CartContext
├── hooks/        # Product filtering helpers
├── lib/          # Formatting and product utilities
├── pages/        # Route pages
└── types/        # API and domain types
```

## Known limitations

- Cart quantity changes, item removal, and clearing the cart are applied only in frontend state; the backend exposes add and read endpoints only.
- Category filters use the product `brand` field because the backend has no category field.
- Orders are created as `PENDING`; there is no UI or backend support for changing order status yet.

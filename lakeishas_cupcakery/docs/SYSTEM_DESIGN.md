# Lakeisha's Cupcakery — System Design

## 1. Overview

Lakeisha's Cupcakery is a full‑stack application composed of a modern React frontend and a Django REST backend. The system supports product catalog, orders, customer accounts, content (blog), marketing (newsletter), reviews, notifications, and an opinionated admin dashboard.

- Frontend: Vite + React + TypeScript + TailwindCSS + shadcn/ui
- Backend: Django 4.2 + Django REST Framework + SimpleJWT, modular apps under `lakeishas_cupcakery/apps`
- Persistence: SQLite (dev), PostgreSQL recommended for production
- Auth: JWT (access + refresh) with optional session for admin/Django
- Deployment: Any platform that supports Python + Node build pipeline (e.g., VPS with Nginx+Gunicorn for API, static hosting or Node preview for FE)

## 2. High-level Architecture

```
[Client (Browser, Mobile Web)]
         |
         v
[React SPA (Vite/TS/shadcn)] --(Axios/Fetch JSON)--> [Django REST API]
         ^                                                |
         |                                                v
  Static assets (CDN)                              [SQLite/PostgreSQL]
                                                   [Media storage]
                                                   [Email/3rd-party]
```

- The React SPA communicates with the API over HTTPS using JSON. 
- Authentication uses JWT stored in memory or secure storage; tokens are attached via `Authorization: Bearer <token>`.
- Admin UI is a custom dashboard app mounted under `/admin/` with fallback to Django admin under `/admin/original/`.

## 3. Backend Architecture (Django)

- Project root: `lakeishas_cupcakery/`
- Config: `config/settings.py`, `config/urls.py`, `asgi.py`, `wsgi.py`
- Installed apps (selected):
  - `apps.users` (custom user model `AUTH_USER_MODEL = 'apps.users.User'`, auth endpoints)
  - `apps.products` (catalog, categories, media)
  - `apps.orders` (cart/checkout/order lifecycle)
  - `apps.reviews` (product reviews/ratings)
  - `apps.blog` (content)
  - `apps.contact` (contact/lead)
  - `apps.newsletter` (subscriptions)
  - `apps.notifications` (system/user notifications)
  - `apps.payments` (payment intents/hooks)
  - Infra: `rest_framework`, `rest_framework_simplejwt`, `django_filters`, `corsheaders`, `debug_toolbar`

### 3.1 URL Topology

- `/` → `WelcomeView` (admin_dashboard)
- `/admin/` → Custom admin dashboard
- `/admin/original/` → Default Django admin
- API namespace:
  - `/api/auth/` → `apps.users.urls`
  - `/api/products/` → `apps.products.urls`
  - `/api/orders/` → `apps.orders.urls`
  - `/api/blog/` → `apps.blog.urls`
  - `/api/contact/` → `apps.contact.urls`
  - `/api/newsletter/` → `apps.newsletter.urls`
  - `/api/reviews/` → `apps.reviews.urls`

### 3.2 Cross-cutting Concerns

- CORS: Allowed origins include `http://localhost:8080` (dev). Adjust for deployment.
- Auth: `SimpleJWT` with 60‑minute access and 1‑day rotating refresh tokens. Default permission: `IsAuthenticatedOrReadOnly`.
- Pagination: Page-number pagination (`PAGE_SIZE=10`).
- Filtering/Search/Ordering: `django_filters`, DRF search and ordering backends.
- Media: `MEDIA_ROOT` at `lakeishas_cupcakery/media` served in DEBUG mode.

### 3.3 Data Model (indicative)

- `User`: Custom fields suitable for customers/admins.
- `Product`: name, description, price, images, stock, categories, tags.
- `Order`: user, items (product, qty, unit price), totals, status transitions (cart → placed → paid → fulfilled → closed), shipping/billing details.
- `Review`: product, user, rating, content, moderation flags.
- `BlogPost`: title, slug, body, author, published_at.
- `NewsletterSubscription`: email, confirmed_at, unsubscribed_at, source.
- `Notification`: user, channel (in-app/email), template, payload, status.
- `Payment`: provider, amount, currency, status, reference, webhooks.

Note: Concrete fields may vary; see each app’s `models.py`.

### 3.4 Request Lifecycle (API)

1. Client sends JSON request with optional `Authorization: Bearer` header.
2. DRF authenticates via JWT, applies permissions, filters, and pagination.
3. View/Serializer handle validation and persistence.
4. JSON response returned with appropriate status codes.

## 4. Frontend Architecture (React, Vite, TS)

- Stack: React 18, TypeScript, React Router, TanStack Query, TailwindCSS, shadcn/ui, Zod, Axios.
- Structure (indicative under `/src`):
  - `main.tsx` / `App.tsx`: App bootstrap and router.
  - UI components: shadcn primitives, icons via `lucide-react`.
  - Data fetching: `@tanstack/react-query` for caching, retries, and invalidation.
  - Forms: `react-hook-form` with `zod` schemas via `@hookform/resolvers`.
  - Styling: Tailwind + `tailwind-merge`.

### 4.1 State and Data Flow

- Server state: React Query manages caching and background refresh.
- Client state: Component-local or minimal global state as needed.
- Auth: Tokens stored securely (e.g., memory or httpOnly cookies if configured). Axios interceptors attach Bearer tokens.

### 4.2 Routing

- Public routes (home, catalog, blog, contact).
- Auth routes (login/register/profile).
- Protected routes (cart/checkout/orders history, admin dashboard).

## 5. Key Use Case Flows

### 5.1 Authentication (JWT)

- Register/Login → receive `access` and `refresh` tokens.
- Attach `Authorization: Bearer <access>` to API requests.
- On 401/expired, use refresh to obtain a new access token; rotate refresh per settings.

### 5.2 Product Browsing → Checkout

1. List products with filter/search/order.
2. View product details and reviews.
3. Add to cart, update quantities.
4. Create order, initiate payment via `apps.payments`.
5. On webhook/success, mark order as paid and trigger notifications.

## 6. Security

- Keep `SECRET_KEY` and JWT signing keys out of source; use env vars.
- Set `DEBUG=False` and configure `ALLOWED_HOSTS` in production.
- Enforce HTTPS, secure cookies, CSRF where relevant.
- Validate and sanitize all inputs (serializers, Zod schemas on FE).
- Use permission checks for protected endpoints and admin operations.

## 7. Observability & Diagnostics

- `debug_toolbar` in DEBUG mode for local profiling.
- Add structured logging on API (e.g., `logging` config) and FE error boundaries.
- Health endpoint (e.g., `/api/health/`) recommended for uptime checks.

## 8. Performance & Scalability

- DB: Normalize core entities; add indexes on lookup fields (slugs, foreign keys, created_at).
- Caching: Introduce per‑view or low‑level caching for hot endpoints; CDN for static/media.
- Pagination: Keep result sets bounded; use React Query for client caching.
- Background jobs: Offload email/notifications/payments reconciliation via Celery/RQ if needed.

## 9. Deployment

- Backend: Gunicorn/Uvicorn behind Nginx; `collectstatic`; media on S3 or disk with backups.
- Frontend: Static build (`vite build`) served by CDN/edge or Nginx.
- Environment: Configure `CORS_ALLOWED_ORIGINS`, DB URL, email provider, payment keys.

## 10. Local Development

- Backend:
  - `python -m venv venv && source venv/bin/activate` (Windows: `venv\Scripts\activate`)
  - `pip install -r requirements.txt`
  - `python manage.py migrate && python manage.py runserver`
- Frontend:
  - `npm i && npm run dev`
  - Update API base URL for local dev if needed

## 11. Future Enhancements

- Payments provider integration (Stripe/PayPal) with webhooks and idempotency.
- Role-based authorization for staff/admin features.
- Rate limiting, audit logs, 2FA for admins.
- E2E tests (Playwright) and API contract tests (schemathesis).

---

This document complements existing READMEs by focusing on high‑level architecture and design decisions. Update it as modules evolve.

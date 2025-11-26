# Run Locally and Deploy Guide

This guide covers cloning the repo, running the project on localhost (frontend + backend), and deploying the frontend to Cloudflare Pages and the backend to Render.

## 1) Prerequisites

- Git
- Node.js 18+ and npm
- Python 3.10+ and pip
- Optional: PostgreSQL (for production-like testing)

## 2) Clone the repository

```bash
git clone https://github.com/winstonjthinker/cupcake-magic-garden.git
cd cupcake-magic-garden
```

Repo layout (relevant parts):
- Frontend (React/Vite/TS): `./` (root src/)
- Backend (Django/DRF): `./lakeishas_cupcakery/`

## 3) Run the backend (Django API) locally

From `./lakeishas_cupcakery`:

```bash
# Create virtual env
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1
# macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment variables (development)
# Create a .env if you maintain one, else set via shell or edit settings for dev
# For local dev, ensure DEBUG=True and ALLOWED_HOSTS includes localhost

# Apply migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Run server
python manage.py runserver 127.0.0.1:8000
```

Notes:
- CORS allowed origins in `config/settings.py` include `http://localhost:8080` for the frontend dev server.
- Media is served locally under `MEDIA_URL=/media/` when DEBUG=True.

## 4) Run the frontend (React) locally

From repo root `./`:

```bash
npm install
npm run dev
```

- Default Vite dev server runs on `http://localhost:5173` (or as configured). If your API CORS expects `8080`, either:
  - Change Vite port: `npm run dev -- --port 8080`, or
  - Update `CORS_ALLOWED_ORIGINS` in Django settings to include your Vite port.

- Configure API base URL in your frontend code (e.g. `.env` or axios config) to `http://127.0.0.1:8000` for local development.

## 5) Common local URLs

- Frontend dev: `http://localhost:5173` (or configured port)
- API root: `http://127.0.0.1:8000/`
- Custom admin dashboard: `http://127.0.0.1:8000/admin/`
- Django admin (fallback): `http://127.0.0.1:8000/admin/original/`

## 6) Deploy frontend to Cloudflare Pages

Cloudflare Pages is ideal for the React SPA (static hosting with optional edge functions).

1. Push code to GitHub if not already.
2. In Cloudflare Dashboard → Pages → Create a project → Connect to GitHub repo.
3. Build settings:
   - Framework preset: None (or React/Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18+ (set in Pages build settings if needed)
4. Environment variables (Production & Preview):
   - `VITE_API_BASE_URL=https://<your-render-api-domain>`
5. Save and deploy. Pages will build and serve the SPA.

Notes:
- If your app uses client-side routing, Cloudflare automatically serves `index.html` for 404s. Confirm with a Pages rule if needed.
- Set custom domain in Pages and add DNS records as guided by Cloudflare.

## 7) Deploy backend to Render (Django API)

Render Web Service steps:

1. Create a new Web Service → Connect the same GitHub repo.
2. Root directory: `lakeishas_cupcakery` (so Render builds the Django backend).
3. Environment: Python 3.10+
4. Build command:
   ```bash
   pip install -r requirements.txt && \
   python manage.py collectstatic --noinput && \
   python manage.py migrate
   ```
5. Start command:
   ```bash
   gunicorn config.wsgi:application --timeout 120 --workers 3
   ```
6. Environment variables:
   - `DEBUG=False`
   - `SECRET_KEY=<a-strong-random-value>`
   - `ALLOWED_HOSTS=<render-service-hostname>,localhost,127.0.0.1`
   - `DATABASE_URL=postgres://...` (use Render’s managed PostgreSQL)
   - `CORS_ALLOWED_ORIGINS=https://<your-cloudflare-pages-domain>`
   - Any email/payment provider keys as needed
7. Static/Media:
   - Static: `collectstatic` runs during build. Serve via WhiteNoise or Nginx if you add it.
   - Media (user uploads):
     - Option A: Attach a Render persistent disk and configure `MEDIA_ROOT` to that mount.
     - Option B: Use Cloudflare R2/S3 and configure `django-storages`.

8. Health checks:
   - Configure a simple health endpoint (e.g., `/api/health/`) or use `/admin/original/login/` for service checks.

## 8) Post-deploy integration

- Update Cloudflare Pages `VITE_API_BASE_URL` to your Render API URL.
- On the backend, set `CORS_ALLOWED_ORIGINS` to your Pages domain and any preview domains if needed.
- Test end-to-end: login, product list, checkout flow.

## 9) Troubleshooting

- 401/403 from API: Verify JWT tokens, CORS, and that `Authorization: Bearer` headers are set by the frontend.
- CORS errors: Ensure the frontend origin is added to `CORS_ALLOWED_ORIGINS` and credentials settings align with your auth strategy.
- Static files not served in prod: Confirm `collectstatic` logged files and that gunicorn/whitenoise are configured to serve them.
- Media uploads failing: Use a persistent disk or object storage; local ephemeral disk on Render is wiped on deploys.

## 10) Quick checklist

- Local
  - Backend: venv, install, migrate, runserver
  - Frontend: npm install, dev server, API URL set
- Cloud
  - Cloudflare Pages: build dist, API base URL set
  - Render: DB, env vars, collectstatic, migrate, gunicorn

---

For deeper architectural context, see `SYSTEM_DESIGN.md`. Adjust ports, URLs, and environment variables to match your environment.

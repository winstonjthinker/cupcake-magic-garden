# Deployment Guide

This guide covers deploying the Cupcake Magic Garden application with the backend on Render and frontend on Cloudflare Pages.

## Architecture

- **Backend:** Django REST API hosted on Render with PostgreSQL database
- **Frontend:** React SPA hosted on Cloudflare Pages
- **Media Files:** Stored locally on Render (⚠️ will be lost on redeploy - see recommendations below)

## Prerequisites

- GitHub account with repository access
- Render account (free tier available)
- Cloudflare account (free tier available)
- SendGrid API key (optional, for email functionality)

---

## Backend Deployment (Render)

### 1. Push Code to GitHub

Ensure all changes are committed and pushed to your GitHub repository.

### 2. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name:** `cupcake-magic-garden-db`
   - **Database:** `cupcake_magic_garden`
   - **User:** `postgres`
   - **Region:** Choose closest to your users
   - **Plan:** Free
4. Click **Create Database**
5. Save the **Internal Database URL** (you'll need this)

### 3. Create Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `cupcake-magic-garden-backend`
   - **Region:** Same as database
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** Leave empty
   - **Runtime:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `cd lakeishas_cupcakery && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan:** Free

### 4. Add Environment Variables

In the Render dashboard, go to **Environment** and add:

```
PYTHON_VERSION=3.9.0
DJANGO_SETTINGS_MODULE=config.settings.prod
DJANGO_SECRET_KEY=<click "Generate" for secure random key>
DJANGO_DEBUG=False
DATABASE_URL=<paste Internal Database URL from step 2>
ALLOWED_HOSTS=cupcake-magic-garden-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://cupcake-magic-garden.pages.dev
CSRF_TRUSTED_ORIGINS=https://cupcake-magic-garden.pages.dev
DEFAULT_FROM_EMAIL=noreply@lakeishascupcakery.com
SENDGRID_API_KEY=<your-sendgrid-key> (optional)
```

> **Note:** Update `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` with your actual Cloudflare Pages URL after deployment.

### 5. Deploy

1. Click **Create Web Service**
2. Wait for deployment to complete (5-10 minutes)
3. Your backend will be available at: `https://cupcake-magic-garden-backend.onrender.com`

### 6. Create Superuser

After deployment, use Render Shell to create an admin user:

1. Go to your web service → **Shell**
2. Run:
```bash
cd lakeishas_cupcakery
python manage.py createsuperuser
```
3. Follow prompts to create admin account

---

## Frontend Deployment (Cloudflare Pages)

### 1. Update Environment Variables

Update `.env.production` with your Render backend URL:

```env
VITE_API_URL=https://cupcake-magic-garden-backend.onrender.com/api
VITE_BASE_URL=https://cupcake-magic-garden-backend.onrender.com
```

Commit and push this change.

### 2. Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure:
   - **Project name:** `cupcake-magic-garden`
   - **Production branch:** `main`
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave empty)

### 3. Add Environment Variables

In **Settings** → **Environment variables**, add:

```
VITE_API_URL=https://cupcake-magic-garden-backend.onrender.com/api
VITE_BASE_URL=https://cupcake-magic-garden-backend.onrender.com
VITE_TOKEN_KEY=cupcake_auth_token
VITE_REFRESH_TOKEN_KEY=cupcake_refresh_token
```

### 4. Deploy

1. Click **Save and Deploy**
2. Wait for build to complete (2-5 minutes)
3. Your frontend will be available at: `https://cupcake-magic-garden.pages.dev`

### 5. Update Backend CORS Settings

Now that you have your Cloudflare Pages URL, update the backend:

1. Go to Render dashboard → Your web service → **Environment**
2. Update these variables:
```
CORS_ALLOWED_ORIGINS=https://cupcake-magic-garden.pages.dev,https://yourdomain.com
CSRF_TRUSTED_ORIGINS=https://cupcake-magic-garden.pages.dev,https://yourdomain.com
```
3. Save changes (this will trigger a redeploy)

---

## Post-Deployment Configuration

### Custom Domain (Optional)

**For Cloudflare Pages:**
1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `www.lakeishascupcakery.com`)
4. Follow DNS configuration instructions
5. Update backend CORS/CSRF settings with your custom domain

**For Render Backend:**
1. Go to your web service → **Settings** → **Custom Domain**
2. Add your API subdomain (e.g., `api.lakeishascupcakery.com`)
3. Update DNS with provided CNAME record

### Media File Storage (Recommended)

⚠️ **Important:** Render's free tier has ephemeral storage - uploaded files will be lost on redeploy.

**Recommended solution:** Use Cloudflare R2 (S3-compatible, free tier available)

1. Install django-storages:
```bash
pip install django-storages boto3
```

2. Add to `requirements.txt`:
```
django-storages>=1.14.0
boto3>=1.28.0
```

3. Update `config/settings/prod.py`:
```python
# Cloudflare R2 Storage
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('R2_BUCKET_NAME')
AWS_S3_ENDPOINT_URL = os.environ.get('R2_ENDPOINT_URL')
AWS_S3_REGION_NAME = 'auto'
AWS_DEFAULT_ACL = 'public-read'
```

4. Add environment variables in Render with your R2 credentials

---

## Testing Deployment

### Backend Health Check

```bash
curl https://cupcake-magic-garden-backend.onrender.com/api/
```

Expected: JSON response with API endpoints

### Frontend Check

1. Visit `https://cupcake-magic-garden.pages.dev`
2. Check browser console for errors
3. Test navigation between pages
4. Verify products load from backend API

### Full Flow Test

1. Register a new user account
2. Log in
3. Access Django admin via footer link
4. Upload a product with image
5. Verify product appears on frontend

---

## Troubleshooting

### CORS Errors

**Symptom:** Browser console shows CORS errors

**Solution:**
1. Verify `CORS_ALLOWED_ORIGINS` in Render includes your Cloudflare Pages URL
2. Ensure no trailing slashes in URLs
3. Check that `CORS_ALLOW_CREDENTIALS = True` in `prod.py`

### Images Not Loading

**Symptom:** Product images show broken image icon

**Solution:**
1. Check that media files are being served: visit `https://your-backend.onrender.com/media/products/`
2. For production, set up cloud storage (see Media File Storage section)
3. Verify `MEDIA_URL` and `MEDIA_ROOT` in settings

### 500 Internal Server Error

**Symptom:** API requests return 500 errors

**Solution:**
1. Check Render logs: Dashboard → Your service → **Logs**
2. Verify all environment variables are set correctly
3. Check `ALLOWED_HOSTS` includes your Render domain
4. Ensure database migrations ran successfully

### Build Failures

**Backend:**
- Check `build.sh` has execute permissions
- Verify `requirements.txt` has all dependencies
- Check Python version matches Render configuration

**Frontend:**
- Verify `package.json` build script is correct
- Check Node version compatibility
- Ensure environment variables are set in Cloudflare

---

## Monitoring & Maintenance

### Render Free Tier Limitations

- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month of runtime (sufficient for single service)

### Cloudflare Pages Limitations

- 500 builds per month
- Unlimited bandwidth
- 20,000 files per deployment

### Regular Maintenance

1. **Monitor logs** for errors
2. **Backup database** regularly (Render provides daily backups on paid plans)
3. **Update dependencies** monthly for security patches
4. **Test deployments** in staging before production

---

## Support

For issues:
- **Render:** https://render.com/docs
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Django:** https://docs.djangoproject.com/

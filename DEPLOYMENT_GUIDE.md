# AgriRide — Production Online Deployment Guide

This guide details how to deploy **AgriRide** online using **Render** (Django REST Framework + Managed PostgreSQL) and **Vercel** (React + Vite Single Page Application).

---

## 🗄️ PART 1: Deploying the Backend on Render

Render hosts both the **Python Django Web Service** and the **Managed PostgreSQL Database**.

### Step 1: Create a Render Account
1. Visit [https://render.com](https://render.com) and create an account.
2. Connect your GitHub or GitLab account.

### Step 2: Push Repository to GitHub
If you haven't initialized a git repository yet:
```bash
cd /home/sahil/Desktop/AgriRide
git init
git add .
git commit -m "feat: complete production-ready full-stack AgriRide platform"
git branch -M main
git remote add origin https://github.com/<your-username>/AgriRide.git
git push -u origin main
```

### Step 3: Deploy via Render Blueprint (One-Click)
1. On your Render Dashboard, click **New +** $\rightarrow$ **Blueprint**.
2. Select your `AgriRide` repository.
3. Render will detect `backend/render.yaml` and provision:
   - **PostgreSQL Database:** `agriride-db`
   - **Web Service:** `agriride-backend`
4. Click **Apply**.

### Alternatively: Manual Setup on Render
1. **Create PostgreSQL Database:**
   - Click **New +** $\rightarrow$ **PostgreSQL**.
   - Name: `agriride-db`.
   - Click **Create Database** and copy the **Internal Database URL** (or External URL).
2. **Create Web Service:**
   - Click **New +** $\rightarrow$ **Web Service**.
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn agriride.wsgi:application`
   - **Environment Variables:**
     - `DATABASE_URL`: *(Paste your Render PostgreSQL connection string)*
     - `DJANGO_SECRET_KEY`: *(Generate a random 50-character string)*
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `.onrender.com,localhost,127.0.0.1`
     - `CORS_ALLOW_ALL_ORIGINS`: `True`
3. Click **Deploy Web Service**.
4. Once deployed, note down your Render service URL (e.g., `https://agriride-backend.onrender.com`).

---

## 🌐 PART 2: Deploying the Frontend on Vercel

### Step 1: Create a Vercel Account
1. Visit [https://vercel.com](https://vercel.com) and sign in with GitHub.

### Step 2: Import Project
1. Click **Add New...** $\rightarrow$ **Project**.
2. Select your `AgriRide` repository.
3. In **Project Configuration**:
   - **Root Directory:** Click Edit and select `frontend`.
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - Name: `VITE_API_URL`
   - Value: `https://<your-render-app-name>.onrender.com/api/v1`
5. Click **Deploy**.

Vercel will build the frontend and provide your live URL (e.g., `https://agriride.vercel.app`).

---

## 🧪 PART 3: Post-Deployment Live Verification

Once both are deployed, verify the presentation workflow on your live URL:

1. **Visit Landing Page:** `https://<your-vercel-domain>.vercel.app`
2. **Explore Marketplace:** Verify that the 6 seeded machines load from PostgreSQL.
3. **Log in as Farmer:**
   - Email: `farmer.demo@agriride.org`
   - Password: `Farmer@1234`
4. **Submit a Booking:** Book any machinery for 2 days.
5. **Log in as Owner:**
   - Email: `owner.dhillon@agriride.org`
   - Password: `Owner@1234`
6. **Accept Request:** Open `/owner/dashboard` and click **Accept**.
7. **Log in as Admin:**
   - Email: `admin@agriride.org`
   - Password: `Admin@1234`
8. **Inspect Platform Metrics:** Verify platform gross value and booking counts.

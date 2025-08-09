
# Tiger — Render Deployment Guide (Single App)

This package contains a Render-ready single-app that serves the backend API and the web client from one URL.

## What’s included
- `backend/` — Express app that serves `/api` and static web client from `/public`
- `backend/public/` — merged web client (static HTML)
- `Dockerfile` — build instructions for Render
- `Procfile` — fallback for Heroku-style deploys
- `render.yaml` — Render manifest for one-click deploy (manual use)
- `docs/screenshots/` — placeholder screenshots that show the Render & MongoDB Atlas steps

---

## Quick start (local test)
1. Unzip project and `cd backend`
2. Install dependencies and run:
```bash
cd backend
npm install
cp .env.example .env
# edit .env, set MONGO_URI, JWT_SECRET
npm run dev
```
3. Open `http://localhost:4000` — the web client should load.

---

## Deploy to Render (one app — backend + static client)
1. Create a GitHub repository and push the project (or upload the zip and import).
2. Go to Render dashboard → **New** → **Web Service**.
   - Connect your GitHub and select the repo.
   - For **Environment**, choose **Docker**.
   - Set the **Build Command**: *(use defaults from Dockerfile)*
   - Set **Start Command**: *(Dockerfile will handle it)*
3. Set environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string.
   - `JWT_SECRET` — a strong secret.
4. Click **Create Web Service** and wait for the build to finish.
5. Your live URL will be shown on the Render dashboard (e.g. `https://tiger-yourname.onrender.com`).

_Screenshots: see `docs/screenshots/step1.png`, `step2.png`, `step3.png` for a visual guide._

---

## Notes & production tips
- File uploads are stored on instance disk and will be lost after redeploy. For production use S3-compatible storage.
- Use SSL and secure options for sockets. Configure CORS carefully.
- Hook up an SMS provider (Twilio) and set credentials in env.
- Consider separating static assets into a CDN for better performance.

If you want, I can generate exact Render UI values and a walkthrough tailored to your Render account.  

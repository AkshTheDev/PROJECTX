# GST Invoice App (MERN)

A full‑stack GST invoicing app built with the MERN stack. It includes authentication, client management, invoice creation, a dashboard with charts, and GST reporting. Profile avatars and business logos are stored via Cloudinary.

## Tech stack

- Client: React + Vite + TypeScript, MUI, React Router, React Query, Chart.js
- Server: Node.js, Express, TypeScript, Mongoose (MongoDB), JWT, bcryptjs
- Media: Cloudinary (avatars, logos)

## Project structure

```
./
  client/          # React app (Vite)
  server/          # Express API (TypeScript)
```

Key files:
- Client API base: `client/src/lib/api.ts` (default: http://localhost:5000/api)
- Server entry: `server/src/index.ts`

## Prerequisites

- Node.js 18+ and npm
- A MongoDB connection string (Atlas or local)
- A Cloudinary account (for uploads)

## Environment variables

Create a `.env` file in `server/`:

```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-strong-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Optional: CORS allowlist
CLIENT_URL=http://localhost:5173
```

If you use unsigned uploads from the client, create an Upload Preset in Cloudinary and use it in the client upload code.

## Deployment (Production)

This app uses **Vercel** (frontend) + **Render** (backend) for deployment. For detailed step-by-step instructions, see [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md).

### Quick Deploy Overview

**Backend (Render):**
- Push server code to: https://github.com/AkshTheDev/GST-backend
- Connect to Render → New Web Service
- Settings: Node runtime, Build: `npm install && npm run build`, Start: `npm start`
- Environment Variables: `MONGO_URI`, `JWT_SECRET`, `PORT=8000`, `CLIENT_URL`, `CLOUDINARY_*`, Google OAuth credentials
- Deploy and copy your API URL: `https://your-backend.onrender.com`

**Frontend (Vercel):**
- Push client code to: https://github.com/AkshTheDev/GST-frontend
- Import repo on Vercel
- Settings: Framework Preset: Vite, Build: `npm run build`, Output: dist
- Environment Variables: `VITE_API_BASE=https://your-backend.onrender.com/api`
- Deploy and get your public URL: `https://your-site.vercel.app`

**Final Configuration:**
- Update Render: Set `CLIENT_URL=https://your-site.vercel.app` (triggers redeploy)
- Update Google OAuth redirect URIs if using authentication

Your app is now live! Share the Vercel URL to access it publicly.

## Install and run (development)

Open two terminals.

Terminal 1 – API server:

```
cd server
npm install
npm run dev
```

Terminal 2 – Client app:

```
cd client
npm install
npm run dev
```

Client will start on http://localhost:5173 by default. The API runs at http://localhost:5000.

## Deploy to Vercel + Render (get a public link)

1) Deploy API to Render
- Go to https://dashboard.render.com → New → Web Service
- Connect your GitHub repo: AkshTheDev/PROJECTX
- Settings:
  - Name: gst-invoice-api
  - Runtime: Node
  - Branch: master
  - Root Directory: gst-invoice-app-mongo/server
  - Build Command: npm ci && npm run build
  - Start Command: npm run start
- Environment Variables:
  - MONGO_URI = your MongoDB connection string
  - JWT_SECRET = strong random string (Render can generate)
  - CLIENT_URL = (set after Vercel deploy)
- Deploy and copy your API URL: https://YOUR-API.onrender.com

2) Deploy Client to Vercel
- Go to https://vercel.com/new → Import your repo: AkshTheDev/PROJECTX
- Settings:
  - Root Directory: gst-invoice-app-mongo/client
  - Framework Preset: Vite
  - Build Command: npm ci && npm run build
  - Output Directory: dist
- Environment Variables:
  - VITE_API_BASE = https://YOUR-API.onrender.com/api
- Deploy and get your public URL: https://YOUR-SITE.vercel.app

3) Update Render API
- Go back to Render dashboard → your API service → Environment
- Set CLIENT_URL = https://YOUR-SITE.vercel.app
- Save (triggers redeploy)

Your deployment link is the Vercel URL. Share that to access your app publicly.

## One-click cloud deploy (public link fast)

If Docker is blocked on your network, deploy to free hosts:

1) Deploy API to Render (free)

- Click: https://render.com/deploy?repo=https://github.com/AkshTheDev/PROJECTX
- Render will detect `render.yaml` and set up a Node Web Service from `gst-invoice-app-mongo/server`.
- Set env vars on Render:
  - MONGO_URI (your MongoDB connection string)
  - JWT_SECRET (auto-generated is fine)
  - CLIENT_URL: set to your client URL (after step 2)
- When deployed, you’ll get an API URL like: `https://<your-api>.onrender.com` (API base is `.../api`).

2) Deploy Client to Netlify (free)

- Dashboard → "New site from Git" → Choose this repo → Set base directory to `gst-invoice-app-mongo/client`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Add environment variable:
  - VITE_API_BASE = `https://<your-api>.onrender.com/api`
- Deploy and you’ll get a public site URL like: `https://<your-site>.netlify.app`

Share the Netlify URL as your deployment link. The client proxies to the API via VITE_API_BASE.

## Scripts

- Client
  - `npm run dev` – start Vite dev server
  - `npm run build` – type-check and build production assets
  - `npm run preview` – preview production build
- Server
  - `npm run dev` – start Express API with ts-node-dev

## Features

- Authentication (JWT)
- Profile with avatar and business logo (Cloudinary)
- Clients & Invoices
- Dashboard with charts (sales/invoices)
- GST Reports: summary and detailed view (date range and search)

## Configuration notes

- API base URL is configured in `client/src/lib/api.ts`. Change it if your server isn't on localhost:5000.
- CORS: set `CLIENT_URL` in server `.env` to allow requests from your frontend origin.

## Troubleshooting

- Port conflicts: Change `PORT` in `server/.env` or Vite port in `client/vite.config.ts`.
- Stale installs on Windows: if you see odd React/Chart.js errors, fully close Node processes, delete `node_modules`, reinstall, then restart dev servers.
- Auth 401 after login: ensure a Business document is created for the user (the server’s login flow can auto-create this for legacy users).

## License

This project is provided as-is. Add your preferred license if you plan to distribute.
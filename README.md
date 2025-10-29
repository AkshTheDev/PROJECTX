## Deployment

This project is deployed using modern cloud platforms for optimal performance and scalability:

### Production Deployment Stack
- **Frontend:** Vercel (React + Vite)
- **Backend:** Render (Node.js + Express + TypeScript)
- **Database:** MongoDB Atlas (Cloud)

### Quick Deployment Guide

#### 1. Backend Deployment (Render)
```sh
# Navigate to server directory
cd gst-invoice-app-mongo/server

# Push to GitHub
git init
git add .
git commit -m "Deploy backend"
git remote add origin https://github.com/AkshTheDev/GST-backend.git
git push -u origin main
```

Then on [Render Dashboard](https://dashboard.render.com):
- Create new Web Service
- Connect GitHub repository
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- Add environment variables: `JWT_SECRET`, `MONGO_URI`, `PORT`, `CLIENT_URL`

#### 2. Frontend Deployment (Vercel)
```sh
# Navigate to client directory
cd gst-invoice-app-mongo/client

# Push to GitHub
git init
git add .
git commit -m "Deploy frontend"
git remote add origin https://github.com/AkshTheDev/GST-frontend.git
git push -u origin main
```

Then on [Vercel Dashboard](https://vercel.com):
- Import GitHub repository
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Add environment variable: `VITE_API_BASE=https://your-backend.onrender.com/api`

#### 3. Final Configuration
- Update `CLIENT_URL` in Render with your Vercel URL
- Update Google OAuth redirect URIs if using OAuth

### Service Ports (Local Development)
- **Client (Vite):** Port `5173` - Access the frontend at `http://localhost:5173`
- **Server (Node.js API):** Port `8000` - API available at `http://localhost:8000/api`
- **MongoDB Atlas:** Cloud-hosted (connection string in `.env`)

### Environment Variables
Both services support environment variables via `.env` files:
- `./gst-invoice-app-mongo/client/.env.local` (local development)
- `./gst-invoice-app-mongo/server/.env` (server configuration)

### Benefits of Vercel + Render
- **Automatic HTTPS:** Both platforms provide SSL certificates
- **Global CDN:** Vercel's edge network for fast frontend delivery
- **Auto-deploy:** Push to GitHub triggers automatic deployment
- **Zero downtime:** Rolling deployments with health checks
- **Scalability:** Automatic scaling based on traffic
- **Free Tier:** Both offer generous free tiers for development

### Complete Deployment Instructions
For detailed step-by-step deployment instructions, see `DEPLOYMENT_GUIDE.md` in the project root.

---

*This project uses cloud-native deployment for production. Docker configuration has been removed in favor of modern serverless platforms.*

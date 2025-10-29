# 🚀 GST Invoice App Deployment Guide

## 📋 Overview
This guide walks you through deploying your full-stack GST Invoice application with:
- **Frontend**: React + Vite + MUI (Deploy on **Vercel**)
- **Backend**: Node.js + Express + TypeScript (Deploy on **Render**)
- **Database**: MongoDB Atlas (Already configured ✅)

## 🗂️ Project Structure
```
gst-invoice-app-mongo/
├── client/          # React Frontend
└── server/          # Express Backend
```

---

## ✅ Part 1: Database Setup (MongoDB Atlas)
**Status: Already Configured** ✅

Your MongoDB Atlas is already set up with:
- Connection String: `mongodb+srv://akshanshsinha570_db_user:***@gstapp.cyz1mwz.mongodb.net/?appName=GSTAPP`
- Collections: Users, Businesses, Clients, Invoices

### Verify Access (Optional)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access**
3. Ensure `0.0.0.0/0` (Allow from anywhere) is listed
4. Go to **Database Access**
5. Confirm your user has "Read and write" permissions

---

## ⚙️ Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend Code

#### 1.1 Update `server/src/index.ts` for Production
```typescript
const PORT = process.env.PORT || 8000;
```
✅ Already configured correctly

#### 1.2 Create `server/.env.example`
```bash
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=8000
CLIENT_URL=http://localhost:5173
```

#### 1.3 Verify CORS Configuration
Check that `server/src/index.ts` has:
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### 1.3 Verify Build Works
```bash
cd client
npm run build
```
This should create a `dist/` folder.

#### 1.4 Ensure `client/vercel.json` Exists
```bash
cd server
npm run build
```
This should create a `dist/` folder with compiled JavaScript.

---

### Step 2: Push Backend to GitHub

```bash
cd server
git init
git add .
git commit -m "Prepare backend for deployment"
git branch -M main
git remote add origin https://github.com/AkshTheDev/GST-backend.git
git push -u origin main
```

---

### Step 3: Deploy on Render

1. **Go to** [Render Dashboard](https://dashboard.render.com/)
2. **Log in** using GitHub
3. **Click** "New +" → "Web Service"
4. **Connect** your `GST-backend` repository

#### Configure Service:
| Setting | Value |
|---------|-------|
| **Name** | `gst-invoice-backend` |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `(leave blank or specify server)` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

#### Add Environment Variables:
| Key | Value |
|-----|-------|
| `JWT_SECRET` | `Ql9PMAJfa2JHb4r4wVAj+lspMTgfopZEPl619bvh6umgz6sqmluttQDdYYUJA6TgaSoHqo0GNPvP0LMNS7yvZg==` |
| `MONGO_URI` | `mongodb+srv://akshanshsinha570_db_user:WkFq03adaxVAlI7g@gstapp.cyz1mwz.mongodb.net/?appName=GSTAPP` |
| `PORT` | `8000` |
| `CLIENT_URL` | (leave blank for now, update after Vercel deployment) |

5. **Click** "Create Web Service"
6. **Wait** for deployment (~5–10 minutes)
7. **Copy** your backend URL, e.g.:
   ```
   https://gst-invoice-backend.onrender.com
   ```

---

## 💻 Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend Code

#### 1.1 Update API Configuration
Check `client/src/lib/api.ts`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
});
```

#### 1.2 Create `client/.env.example`
```bash
VITE_API_BASE=http://localhost:8000/api
```

#### 1.3 Verify Build Works
```bash
cd client
npm run build
```
This should create a `dist/` folder.
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Step 2: Push Frontend to GitHub

```bash
cd client
git init
git add .
git commit -m "Prepare frontend for deployment"
git branch -M main
git remote add origin https://github.com/AkshTheDev/GST-frontend.git
git push -u origin main
```

---

### Step 3: Deploy on Vercel

1. **Go to** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Log in** with GitHub
3. **Click** "Add New Project"
4. **Import** your `GST-frontend` repository

#### Configure Project:
| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `(leave blank or client)` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### Add Environment Variable:
| Key | Value |
|-----|-------|
| `VITE_API_BASE` | `https://gst-invoice-backend.onrender.com/api` |

5. **Click** "Deploy"
6. **Wait** 2–5 minutes
7. **Copy** frontend URL, e.g.:
   ```
   https://gst-invoice-app.vercel.app
   ```

---

## 🔄 Part 4: Final Configuration

### Step 1: Update Backend Environment Variables

1. Go to **Render Dashboard** → Your backend service
2. Navigate to **Environment** tab
3. **Update** this variable:

| Key | New Value |
|-----|-----------|
| `CLIENT_URL` | `https://gst-invoice-app.vercel.app` |

4. **Save Changes** (triggers automatic redeploy)

---

## ✅ Part 5: Testing Your Deployed Application

✅ Visit your Vercel URL: `https://gst-invoice-app.vercel.app`

✅ **Test Sign Up**
- Create new account with email/password
- Verify business info is saved

✅ **Test Sign In**
- Log in with created account
- Check JWT token in localStorage

✅ **Test Invoice Creation**
- Create a new client
- Create an invoice
- Verify data saves to MongoDB

✅ **Test PDF Export**
- Open GST Reports
- Generate PDF
- Verify formatting is correct

---

## 🧰 Troubleshooting

### Backend Issues

**Problem: Cannot connect to MongoDB**
- ✅ Check Network Access allows `0.0.0.0/0`
- ✅ Verify MONGO_URI is correct in Render
- ✅ Confirm user permissions in Database Access

**Problem: CORS Error**
- ✅ Set correct `CLIENT_URL` in Render environment
- ✅ Ensure `credentials: true` in CORS setup
- ✅ Verify Vercel URL matches exactly (no trailing slash)

**Problem: TypeScript Build Fails**
- ✅ Run `npm run build` locally first
- ✅ Check for TypeScript errors
- ✅ Verify all dependencies are in `dependencies` (not `devDependencies`)

**Problem: 500 Internal Server Error**
- ✅ Check Render logs: Dashboard → Service → Logs
- ✅ Look for missing environment variables
- ✅ Verify MongoDB connection string

---

### Frontend Issues

**Problem: API Calls Failing**
- ✅ Check `VITE_API_BASE` is set correctly
- ✅ Ensure backend is live (visit backend URL)
- ✅ Open browser DevTools → Network tab
- ✅ Verify requests go to correct URL

**Problem: 404 on Page Refresh**
- ✅ Confirm `vercel.json` exists with rewrites
- ✅ Redeploy on Vercel

**Problem: Build Fails on Vercel**
- ✅ Run `npm run build` locally
- ✅ Fix TypeScript errors
- ✅ Check Vercel build logs

---

## 🧾 Environment Variables Checklist

### Backend (Render)
- ✅ `JWT_SECRET`
- ✅ `MONGO_URI`
- ✅ `PORT`
- ✅ `CLIENT_URL`

### Frontend (Vercel)
- ✅ `VITE_API_BASE`

---

## 🚀 Post-Deployment Tips

### Custom Domains
- **Vercel**: Project Settings → Domains → Add Domain
- **Render**: Service → Settings → Custom Domain

### HTTPS
- ✅ Enabled automatically on both platforms

### Monitoring
- **Render**: Dashboard → Logs (live tail)
- **Vercel**: Deployments → View Function Logs

### Sleep Mode (Render Free Tier)
- ⚠️ Free instance sleeps after 15 mins of inactivity
- First request after sleep takes ~30 seconds
- **Solution**: Upgrade to paid plan ($7/month) for always-on

### Auto-Deploy
- ✅ Push to `main` branch → auto redeploys
- ✅ Can configure deploy hooks for manual triggers

### Performance Optimization
- Use Vercel Edge Network (automatic)
- Enable Render health checks
- Consider upgrading MongoDB Atlas tier for production

---

## 📚 Resources
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Complete Deployment Checklist

### Pre-Deployment
- ✅ MongoDB Atlas cluster running
- ✅ Database user with permissions
- ✅ Code pushed to GitHub (separate repos for client/server)
- ✅ Local builds successful (`npm run build` in both folders)

### Backend Deployment
- ✅ Render account created
- ✅ Service connected to GitHub repo
- ✅ All 4 environment variables added
- ✅ Build successful
- ✅ Backend URL accessible
- ✅ Test endpoint: `https://your-backend.onrender.com/api/health`

### Frontend Deployment
- ✅ Vercel project created
- ✅ Connected to GitHub repo
- ✅ `VITE_API_BASE` environment variable added
- ✅ Build successful
- ✅ Frontend URL accessible

### Post-Deployment
- ✅ `CLIENT_URL` updated in Render
- ✅ CORS working (no console errors)
- ✅ Signup tested ✅
- ✅ Login tested ✅
- ✅ Invoice creation tested ✅
- ✅ PDF export tested ✅
- ✅ All API calls successful ✅

---

## 🎉 Congratulations!
Your GST Invoice App is now live and accessible worldwide! 🌍

**Frontend**: `https://gst-invoice-app.vercel.app`  
**Backend**: `https://gst-invoice-backend.onrender.com`  
**Database**: MongoDB Atlas (Cloud)

Share your app and start invoicing! 🧾✨

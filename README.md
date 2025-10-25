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

## Deploy with Docker Compose

Prerequisites: Docker Desktop (Windows/macOS) or Docker Engine (Linux).

1. Copy `.env.example` to `.env` at the project root and fill in values (MongoDB, JWT, Cloudinary).
2. Build and start both services:

```
docker compose up -d --build
```

This runs:
- Server on http://localhost:5000
- Client on http://localhost:8080 (Nginx serves the React app and proxies `/api` to the server)

Notes:
- The client uses `/api` by default, which works with the provided Nginx proxy. To point directly to a remote API instead, set `VITE_API_BASE` at build time.
- To view logs: `docker compose logs -f`
- To stop: `docker compose down`

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

- API base URL is configured in `client/src/lib/api.ts`. Change it if your server isn’t on localhost:5000.
- CORS: set `CLIENT_URL` in server `.env` if you restrict origins.
 - For Docker Compose, CORS `CLIENT_URL` defaults to `http://localhost:8080`.

## Troubleshooting

- Port conflicts: Change `PORT` in `server/.env` or Vite port in `client/vite.config.ts`.
- Stale installs on Windows: if you see odd React/Chart.js errors, fully close Node processes, delete `node_modules`, reinstall, then restart dev servers.
- Auth 401 after login: ensure a Business document is created for the user (the server’s login flow can auto-create this for legacy users).

## License

This project is provided as-is. Add your preferred license if you plan to distribute.
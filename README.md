## Running with Docker

This project provides a full Docker-based setup for local development and deployment. The setup includes a TypeScript/React client, a TypeScript/Node.js server, and a MongoDB database, all orchestrated via Docker Compose.

### Project-Specific Docker Requirements
- **Node.js Version:** Both client and server Dockerfiles use `node:22.13.1-slim` (set via `ARG NODE_VERSION=22.13.1`).
- **Nginx Version:** Client production image uses `nginx:1.27-alpine`.
- **MongoDB Version:** Uses the official `mongo:latest` image.

### Environment Variables
- Each service (`client` and `server`) supports environment variables via `.env` files. Example files are provided:
  - `./gst-invoice-app-mongo/client/.env.example`
  - `./gst-invoice-app-mongo/server/.env`
- To enable environment variables, uncomment the `env_file` lines in `docker-compose.yml` and provide the appropriate `.env` files.

### Build and Run Instructions
1. **Clone the repository** and navigate to the project root (`./gst-invoice-app-mongo`).
2. **(Optional) Configure environment variables:**
   - Copy `.env.example` to `.env` in both `client` and `server` directories and adjust values as needed.
3. **Build and start all services:**
   ```sh
   docker compose up --build
   ```
   This will build and start the client, server, and MongoDB containers.

### Service Ports
- **Client (Nginx):** Exposes port `8080` (mapped to container port `80`). Access the frontend at `http://localhost:8080`.
- **Server (Node.js API):** Exposes port `3000` (mapped to container port `3000`). API available at `http://localhost:3000`.
- **MongoDB:** Exposes port `27017` for development access.

### Special Configuration
- **Persistent MongoDB Storage:** Data is stored in a Docker volume (`mongo-data`) to persist between container restarts.
- **Custom Nginx Configuration:** The client container uses a custom `nginx.conf` for serving static files.
- **Non-root Users:** Both client and server containers run as non-root users for improved security.
- **Healthcheck:** MongoDB container includes a healthcheck to ensure readiness before dependent services start.

### Notes
- If you modify `.env` files, restart the containers to apply changes.
- For production deployments, review and adjust environment variables and security settings as needed.

---

*This section was updated to reflect the current Docker setup and usage for this project. For further details, refer to the individual `README.md` files in the `client` and `server` directories.*

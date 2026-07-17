Add production-ready Docker files so the app can be deployed from the GitHub repo after the user has connected it. The backend (Lovable Cloud auth + database) remains unchanged; Docker will only host the frontend/SSR server.

1. Switch the Nitro build preset for Docker
   - Update `vite.config.ts` to read `process.env.NITRO_PRESET` and set Nitro's preset to `node-server` when that variable is set, otherwise keep the default Lovable/Cloudflare target.
   - This keeps `bun run build` working for Lovable publish while `NITRO_PRESET=node-server bun run build` produces a Docker-runnable Node server.

2. Add a `Dockerfile`
   - Multi-stage build using `oven/bun:1` for dependency install and build.
   - Build with `NITRO_PRESET=node-server` so Nitro outputs a Node server.
   - Production stage based on `node:20-alpine` (or `oven/bun:1-slim`), copies the `.output` folder and `package.json`, sets `NODE_ENV=production`, exposes `3000`, and runs `node .output/server/index.mjs`.

3. Add `docker-compose.yml`
   - Define an `app` service that builds from the Dockerfile, maps port `3000:3000`, and reads environment variables for the Lovable Cloud backend (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, `LOVABLE_API_KEY`).

4. Add `.dockerignore`
   - Ignore `node_modules`, `.output`, `dist`, `.env`, `.git`, `.vscode`, `.idea`, `*.log`, and OS files to keep the build context small and avoid leaking secrets.

5. Update `README.md`
   - Add a "Deploy with Docker" section with the exact commands: build the image, run the container, and run with `docker compose up`.
   - List the required environment variables and note that the Lovable badge has already been hidden from the public site.

6. Verify the setup
   - Build the Docker image locally and confirm the container starts and responds on `http://localhost:3000`.
   - Run a full project build to ensure the Lovable Cloud deployment path still works.

## Technical details
- TanStack Start uses Nitro as the production server adapter. The default Lovable config targets Cloudflare Workers; the `node-server` preset produces a standalone Node.js server in `.output/server/index.mjs`.
- The Node server listens on the `PORT` environment variable, so the Dockerfile will set `PORT=3000`.
- Vite inlines `VITE_*` variables at build time, so the Supabase public values must be available during `docker build` or passed as build args; server-side variables are read at runtime.
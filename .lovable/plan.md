Add an MIT LICENSE and a project README so the public GitHub repo is immediately presentable and explains what the app does, how to run it, and how to connect it to LeetCode.

## Current state
- The project has no root `LICENSE` and no `README.md`.
- The app is a TanStack Start + Tailwind v4 + Lovable Cloud project called DSA Mastery (internally `tanstack_start_ts`).
- It exposes 11 DSA topics (plus a Service-Company Placements topic), pattern pages with animated flowcharts, inline YouTube videos from curated creators, a language filter, LeetCode solved-problem sync, and a heatmap/streak tracker.

## What to add

### 1. `LICENSE` at repository root
- Standard MIT License.
- Copyright holder: the project author (use "DSA Mastery contributors" so it is not tied to a specific person unless the user wants their full name).
- This grants others permission to use, modify, distribute, and sublicense the code while retaining the copyright notice, which is appropriate for a public portfolio project.

### 2. `README.md` at repository root
Structure:

- **Hero section**: app name, one-line tagline, and a short description of the pattern-first learning approach.
- **Features**: bullet list covering the main capabilities (pattern-first topics, animated flowcharts, multi-creator YouTube player with language filter, LeetCode auto-sync, company-specific patterns for Indian service companies, heatmap/streaks, Google sign-in).
- **Tech stack**: TanStack Start, React 19, Tailwind CSS v4, Lovable Cloud (Supabase), Zustand, React Flow, dagre, TanStack Query, Sonner.
- **Screenshots / visual placeholders**: note that screenshots will be generated after the UI is final and can be added to `public/` or the README later; keep it text-only for now.
- **Getting started**: prerequisites (Node/Bun), install, run dev, and build commands.
- **Environment variables**: list the variables used by the app (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID from `.env`, plus server-side LOVABLE_API_KEY and any connector secrets). Note that the user should never commit real secrets.
- **Database schema**: brief note that Lovable Cloud manages the `profiles` and `solved_problems` tables and the trigger that creates a profile on signup.
- **LeetCode sync**: explain that the app reads public LeetCode submissions via the public GraphQL API and stores them in the user's own row.
- **YouTube / resource policy**: explain that all video and article links are curated, verified creator playlists/resources and remain on the creator's own content; links are not affiliate links.
- **Deployment / GitHub sync**: note that the project is built for Lovable Cloud and can be connected to GitHub via the Lovable editor's GitHub integration for two-way sync.
- **Contributing / feedback**: a short, friendly line inviting issues or suggestions.
- **License**: reference the MIT file being added.

## Verification
- After writing both files, run a quick build check to ensure the README/LICENSE addition does not interfere with the TanStack Start build (they are static files, so it should not).
- Optionally check that the README renders correctly with a markdown preview or by viewing the file contents.

## No code changes
- No source code, routes, or database schema will be modified. Only two new repository files will be added.

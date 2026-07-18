## Goal

Rewrite `README.md` so it (a) reflects every feature we've shipped since the last README update and (b) reads like the user built the project themselves — no mention of Lovable, Lovable Cloud, Lovable AI, Lovable Publish, or the "Edit with Lovable" badge anywhere.

## Changes to `README.md`

1. **Rebrand the stack section** away from Lovable:
   - Replace "Backend / Database: Lovable Cloud" with "Backend / Database: Supabase (Postgres, Auth, RLS)".
   - Replace "Auth: Lovable Cloud Auth" with "Auth: Supabase Auth (Google OAuth + email/password)".
   - Remove the "built with Lovable" GitHub-sync section entirely.
   - Remove the "Edit with Lovable badge has been hidden" note from the Docker section.

2. **Update Features** to include everything added since the last README:
   - Recall Drills — fill-in-the-blank code snippets in C++ / Java / Python for all 25 patterns, with per-blank validation, aliases, and score persistence.
   - CodeHelp Java (Hindi) lectures — hand-picked per pattern from the Supreme DSA with Java series, wired into the language filter.
   - LeetCode Patterns Roadmap page (`/roadmap/leetcode-patterns`) with topic grouping, difficulty distribution, and JSON-LD `ItemList` schema.
   - SEO layer — per-route metadata, `robots.txt`, `llms.txt`, dynamic `sitemap.xml`, Google Search Console verification, and an authenticated `/seo` analytics dashboard (Clicks / Impressions / CTR).
   - Tracker upgrades — "Drills mastered" tile alongside streaks and solved-heatmap.

3. **Update Environment variables**:
   - Rename the table to plain Supabase variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`).
   - Drop `LOVABLE_API_KEY` from the main table (and from Docker) since it is only used by hosted Lovable services that we're no longer surfacing to readers.

4. **Update Database schema section**:
   - Add `pattern_drill_attempts` (user_id, pattern_id, drill_id, language, correct, total, completed_at) alongside `profiles` and `solved_problems`.
   - Keep the RLS note.

5. **Rewrite the Deploy section** as neutral self-hosting:
   - Keep the Docker / docker-compose instructions (they're framework-agnostic).
   - Remove references to "Lovable publish path", Cloudflare Workers preset, and the Lovable badge.
   - Mention that the app also runs on any Node host that can serve a TanStack Start build (`bun run build` → `node .output/server/index.mjs`).

6. **Rewrite "GitHub sync" → "Development workflow"**:
   - Replace the Lovable/GitHub connect instructions with a plain "clone, install, run, push" workflow.

7. **Tone pass** across the whole file:
   - First-person / project-author voice ("I built", "the project uses") — no "generated with", "built with Lovable", or "Lovable editor".
   - Keep MIT license section and attribution paragraph (credits YouTube creators & external resources — that stays).

## Out of scope

- No code changes. Only `README.md` is touched.
- No changes to `LICENSE`, `Dockerfile`, `docker-compose.yml`, or any source file.

## Verification

- Re-read the final `README.md` and grep for `lovable` (case-insensitive) — expect zero matches.
- Confirm every shipped feature above is represented in the Features list.

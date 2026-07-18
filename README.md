# DSA Mastery

A pattern-first way to learn Data Structures & Algorithms for placements and competitive programming.

DSA Mastery teaches the patterns that actually show up in interviews and online assessments — from product companies to Indian service companies like TCS, Infosys, EPAM, Accenture, and Deloitte. Each pattern includes an animated logic flowchart, a curated inline video from the creator best known for it, a fill-in-the-blank recall drill in C++/Java/Python, company tags, and a linked LeetCode problem list. Sign in, save your LeetCode username, and sync your solved problems straight into a personal heatmap and streak tracker.

---

## Features

- **Pattern-first topics** — 11+ DSA topics (Arrays, Hashing, Sliding Window, Two Pointers, Binary Search, Linked Lists, Trees, Graphs, DP, Backtracking, Bit/Math) plus a dedicated **Service-Company Placements** section for TCS NQT, HackwithInfy, EPAM, Accenture, and Deloitte.
- **Animated logic flowcharts** — Every pattern has a visual, step-by-step React Flow diagram so you can see the algorithm before writing code.
- **Multi-creator video picker** — The same pattern explained by different creators (Striver / takeUforward, Aditya Verma, Kunal Kushwaha, Apna College, CodeHelp / Love Babbar, NeetCode, WilliamFiset, Tushar Roy, Errichto, freeCodeCamp, MIT) rendered in an inline embedded player.
- **CodeHelp Java (Hindi) lectures** — Hand-picked per pattern from the *Supreme DSA with Java* series and tagged so the Java filter surfaces them alongside the C++ playlist.
- **Language filter** — Filter videos by C++, Java, or Python so you can learn in the language you prefer.
- **Recall drills** — Fill-in-the-blank code snippets for all 25 patterns in C++, Java, and Python. Per-blank validation with keyword aliases, live scoring, and results persisted to your account.
- **LeetCode auto-sync** — Enter your LeetCode username and sync public solved submissions into your profile.
- **LeetCode Patterns Roadmap** — A dedicated `/roadmap/leetcode-patterns` page that groups every pattern by topic with difficulty distribution and JSON-LD `ItemList` schema for rich search results.
- **Company-focused patterns** — Each pattern is tagged with the companies that commonly ask it (OA / interview).
- **Heatmap, streaks & drill mastery** — GitHub-style activity calendar, current streak counter, and a "Drills mastered" tile on the tracker.
- **Google sign-in** — One-click sign-in via Google OAuth, plus email/password auth.
- **SEO built-in** — Per-route metadata, `robots.txt`, `llms.txt`, a dynamic `sitemap.xml`, Google Search Console verification, and an authenticated `/seo` dashboard showing Clicks, Impressions, and CTR.

---

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (full-stack React 19, Vite 7)
- **Styling:** Tailwind CSS v4 with a custom glassmorphism / dark theme
- **Backend / Database:** Supabase (Postgres, Auth, Row-Level Security)
- **State:** TanStack Query + Zustand
- **Flowcharts:** React Flow + dagre
- **Auth:** Supabase Auth (Google OAuth + email/password)
- **Notifications:** Sonner
- **Icons:** Lucide React

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ or [Bun](https://bun.sh/)
- A Supabase project (URL + publishable key)

### Install

```bash
bun install
# or npm install
```

### Run the dev server

```bash
bun dev
# or npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

### Build

```bash
bun run build
# or npm run build
```

---

## Environment variables

Create a `.env.local` for development and keep production values in your host's environment settings. Never commit real secrets.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL (public, client-side) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable / anon key (RLS-enforced) |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier |

---

## Database schema

The app uses three application tables, all protected by Row-Level Security so users can only read and write their own data:

- **`profiles`** — stores each user's `leetcode_username`; auto-created on sign-up via trigger.
- **`solved_problems`** — problem slugs a user has solved, manually or via LeetCode sync (`user_id`, `problem_id`, `solved_at`).
- **`pattern_drill_attempts`** — recall-drill scores (`user_id`, `pattern_id`, `drill_id`, `language`, `correct`, `total`, `completed_at`).

---

## LeetCode sync

The app reads your public LeetCode submissions through the public LeetCode GraphQL API and stores only the problem slug and solved date in your own `solved_problems` table. No LeetCode credentials are required.

To sync:

1. Sign in.
2. Go to **Settings** and enter your LeetCode username.
3. Click **Sync solved from LeetCode**.

---

## Deploy with Docker

The project ships with a multi-stage `Dockerfile` and a `docker-compose.yml` so you can self-host on any VPS or container platform (Render, Railway, DigitalOcean, AWS, Fly, etc.).

### Required environment variables

The container needs the same public values used in the client bundle.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable / anon key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier |

Create a `.env` file next to `docker-compose.yml` (do **not** commit it):

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_project_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Build and run

```bash
# Build and run with Docker Compose (loads variables from .env automatically)
docker compose up -d --build

# Or build and run manually
docker build \
  --build-arg VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
  --build-arg VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID \
  -t dsa-mastery .

docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
  -e VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID \
  dsa-mastery
```

The app will be available at `http://localhost:3000`.

### Node host (no Docker)

The build also runs as a standalone Node process on any host that can serve a TanStack Start bundle:

```bash
bun run build
node .output/server/index.mjs
```

---

## Development workflow

```bash
git clone https://github.com/<you>/dsa_mastery.git
cd dsa_mastery
bun install
bun dev
```

Standard Git flow — branch, commit, push, open a PR.

---

## Resources & attribution

All video links point to curated, verified creator playlists or individual videos on the creator's own YouTube channel. External resources (GeeksforGeeks, CP-Algorithms, USACO Guide, VisuAlgo, etc.) are credited to their original authors. No affiliate links or paid promotions are included.

---

## Contributing & feedback

Ideas, bug reports, and suggestions are welcome — open an issue or a PR if you think a pattern, video, drill, or resource should be added or updated.

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

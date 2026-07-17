# DSA Mastery

A pattern-first way to learn Data Structures & Algorithms for placements and competitive programming.

DSA Mastery teaches you the patterns that actually show up in interviews and online assessments — from product companies to Indian service companies like TCS, Infosys, EPAM, Accenture, and Deloitte. Each pattern includes an animated logic flowchart, a curated inline video from the creator best known for it, company tags, and a linked LeetCode problem list. Sign in, save your LeetCode username, and sync your solved problems straight into a personal heatmap and streak tracker.

---

## Features

- **Pattern-first topics** — 11+ DSA topics (Arrays, DP, Graphs, Trees, etc.) plus a dedicated **Service-Company Placements** section.
- **Animated logic flowcharts** — Every pattern has a visual, step-by-step React Flow diagram so you can see the algorithm before writing code.
- **Multi-creator video picker** — Watch the same pattern explained by different creators (Striver / takeUforward, Aditya Verma, Kunal Kushwaha, Apna College, CodeHelp / Love Babbar, NeetCode, WilliamFiset, Tushar Roy, Errichto, freeCodeCamp, MIT) with an inline embedded player.
- **Language filter** — Filter videos by C++, Java, or Python so you can learn in the language you prefer.
- **LeetCode auto-sync** — Enter your LeetCode username and sync your public solved submissions into your profile.
- **Company-focused patterns** — Each pattern is tagged with the companies that commonly ask it (OA / interview).
- **Heatmap & streaks** — Track consistency with a GitHub-style activity calendar and a current streak counter.
- **Google sign-in** — One-click sign-in via Google OAuth.

---

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (full-stack React 19, Vite 7)
- **Styling:** Tailwind CSS v4 with a custom glassmorphism / dark theme
- **Backend / Database:** Lovable Cloud (managed auth, database, and storage)
- **State:** TanStack Query + Zustand
- **Flowcharts:** React Flow + dagre
- **Auth:** Lovable Cloud Auth (Google OAuth + email/password magic link)
- **Notifications:** Sonner
- **Icons:** Lucide React

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ or [Bun](https://bun.sh/)
- A Lovable Cloud backend (auto-configured when Lovable Cloud is enabled in your project)

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

The project uses these variables via the Lovable Cloud integration. Do **not** commit real secrets to GitHub.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Backend URL (public, client-side) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key (RLS-enforced) |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |
| `LOVABLE_API_KEY` | Server-side key for connector-gateway / Lovable services |

> **Tip:** Create a `.env.local` or `.env.example` for local development, and keep production values in Lovable Cloud environment settings.

---

## Database schema

Lovable Cloud manages the following application tables:

- **`profiles`** — stores each user's `leetcode_username` and the auto-created row on sign-up.
- **`solved_problems`** — stores the LeetCode problem slugs a user has solved, either manually or via the public LeetCode sync.

Row-level security (RLS) is enabled so users can only read and write their own data.

---

## LeetCode sync

The app reads your public LeetCode submissions through the public LeetCode GraphQL API. It stores only the problem slug and the solved date in your own `solved_problems` table. No credentials from LeetCode are required.

To sync:

1. Sign in.
2. Go to **Settings** and enter your LeetCode username.
3. Click **Sync solved from LeetCode**.

---

## Resources & attribution

All video links are curated, verified creator playlists or individual videos. Links point directly to the creator's own YouTube content and stay on that creator's series where possible. External resources (GeeksforGeeks, CP-Algorithms, USACO Guide, VisuAlgo, etc.) are credited to their original authors.

No affiliate links or paid promotions are included.

---

## GitHub sync

This project is built with Lovable. You can connect it to GitHub from the Lovable editor:

1. Open the **Plus (+)** menu in the chat input → **GitHub** → **Connect project**.
2. Authorize the Lovable GitHub App.
3. Create a new repository named `dsa_mastery`.

After connecting, changes you make in Lovable will automatically push to GitHub, and changes you push to GitHub will sync back to Lovable.

---

## Contributing & feedback

Ideas, bug reports, and suggestions are welcome. Open an issue or drop a note if you think a pattern, video, or resource should be added or updated.

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

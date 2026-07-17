
# DSA Mastery — Pattern-First Learning App

A dark, glassmorphism DSA study app organized by **pattern**, not random problem grinding. Each pattern shows an animated flowchart, an inline YouTube deep-link to a verified creator video, LeetCode problems tagged to your profile, company tags, and progress tracking with a GitHub-style heatmap.

## What you'll get

**11 topics → curated patterns** (per your README):
Arrays, Strings, HashMap, Stack/Queue, Linked List, Trees, Graphs, DP, Greedy/Backtracking, Binary Search, Bit Manipulation. Each expands into OA-tested patterns (Sliding Window, Two Pointers, Fast/Slow, Monotonic Stack, BFS/DFS, Topological Sort, Dijkstra, 0/1 Knapsack, LIS, Kadane, etc.).

**Per pattern page:**
- Auto-laid-out **flowchart** of the pattern's logic (React Flow + Dagre)
- **Inline embedded YouTube player** — no redirect. Each video is a verified deep-link (specific video ID, not a channel homepage) from the pattern's best-known creator:
  - Sliding Window / DP → Aditya Verma
  - Graphs / Trees / recursion → Striver (takeUforward)
  - Fundamentals → Abdul Bari
  - Beginner tracks → Kunal Kushwaha / Apna College
  Verification: during build I fetch `https://www.youtube.com/oembed?url=…` for every video ID and confirm the returned `author_name` matches the intended channel. Any mismatch fails the build so no wrong-creator link ships.
- **Companies** known to ask that pattern (Amazon, Google, Microsoft, Meta, JPMorgan, etc.) as chips
- **LeetCode problems** tagged by difficulty. Each problem links to `leetcode.com/problems/<slug>/` and shows a "Solved ✓" badge auto-synced from your public profile (**Dimple_1106**). Manual checkbox override remains for problems you solved elsewhere.

**Activity Tracker:**
- GitHub-style 365-day heatmap
- Current streak + longest streak
- Counts both manual checks and LeetCode-synced solves
- Persisted in Lovable Cloud (cross-device) with a localStorage fallback

**Auth & sync (Lovable Cloud):**
- Email sign-in (magic link) so streaks/solves follow you across devices
- Your LeetCode username stored in profile; editable in Settings
- Nightly + on-visit refresh of solved list from LeetCode public GraphQL

## Design direction

Dark base (`oklch(0.15 0.02 265)`), glass cards with `backdrop-blur`, subtle inner border, cyan→violet glow accents on active/hover, smooth 200ms transitions. Inter for body, JetBrains Mono for problem slugs/code. No purple-on-white generic look.

## Technical plan

### Data model
`src/data/topics.ts` — typed source of truth. Shape:
```ts
type Pattern = {
  id: string; name: string; logicType: string;
  companies: string[];
  youtube: { videoId: string; channel: "Striver"|"AdityaVerma"|"AbdulBari"|"Kunal"|"ApnaCollege"; title: string };
  flow: Array<{ id: string; label: string; next?: string[] }>;
  problems: Array<{ slug: string; title: string; difficulty: "Easy"|"Medium"|"Hard" }>;
};
```
A build-time script `scripts/verify-youtube.ts` hits oEmbed for every `videoId` and asserts `author_name`.

### Routes (TanStack Start file-based)
```
src/routes/
  __root.tsx           (dark shell, nav, auth listener, QueryClientProvider)
  index.tsx            (landing: 11 topic cards + heatmap preview + streak)
  topics.$topicId.tsx  (topic page → list of patterns)
  patterns.$patternId.tsx (flowchart + video + companies + problems)
  tracker.tsx          (full heatmap + solved list)
  _authenticated/route.tsx (managed gate)
  _authenticated/settings.tsx (LeetCode username, sign out)
  auth.tsx             (magic-link sign-in)
  api/public/leetcode-sync.ts (cron-callable refresh endpoint)
```

### Backend (Lovable Cloud)
Tables:
- `profiles(user_id pk, leetcode_username, created_at)`
- `solved_problems(user_id, slug, solved_at, source 'manual'|'leetcode', pk(user_id, slug))`
- `pattern_progress(user_id, pattern_id, viewed_at)` (for heatmap density)

All with RLS scoped to `auth.uid()` and proper `GRANT`s to `authenticated`.

Server functions (`src/lib/*.functions.ts`):
- `getSolved()` — returns user's solved set (auth-required)
- `toggleSolved({ slug })` — manual mark
- `syncLeetCode()` — fetches `recentAcSubmissionList` from LeetCode's public GraphQL for the stored username, upserts into `solved_problems` with `source='leetcode'`. Called on login and via a "Refresh from LeetCode" button.
- `getHeatmap()` — aggregates solves by day for the past 365 days

LeetCode public GraphQL endpoint (`https://leetcode.com/graphql`) is unauthenticated for public profiles — no LeetCode credentials needed. Only your **public** submissions are visible; if your submissions are private, only manual checkboxes will populate. `Dimple_1106` will be pre-filled in your profile row after first sign-in.

### UI components
- `GlassCard`, `GlowButton`, `DifficultyPill`, `CompanyChip`
- `PatternFlow` — React Flow + Dagre auto-layout; nodes styled as glass pills, edges as thin cyan lines
- `YouTubeEmbed` — lazy `<iframe>` with `youtube-nocookie.com` and a poster thumbnail click-to-load (keeps page fast, still inline, no redirect)
- `Heatmap` — 53×7 grid, oklch scale from muted to cyan glow
- `StreakBadge` — flame icon + numbers

### State
TanStack Query for all server data. Zustand only for ephemeral UI (flowchart zoom, selected difficulty filter). localStorage retained as offline fallback for solved checks when signed out.

## Build order
1. Enable Lovable Cloud, create schema + RLS + grants
2. Auth (magic link) + `_authenticated` layout
3. `topics.ts` seeded with all 11 topics and ~30 patterns, each with verified `videoId`
4. `verify-youtube.ts` script + run against the seed
5. Pattern page: flowchart + embed + companies + problems list
6. LeetCode sync server fn + Settings page (username pre-set to `Dimple_1106`)
7. Heatmap + streaks + tracker page
8. Landing page + navigation + polish

## Notes / caveats
- LeetCode has no official public API; the GraphQL endpoint is the community-standard approach and can rate-limit. I'll cache results for 10 min and expose a manual "Refresh" button.
- Only **public** LeetCode submissions are readable. Private submissions require a session cookie, which I won't ask you for.
- YouTube inline embed requires the creator to allow embedding on their video; oEmbed verification also confirms embeddability. If a chosen video disallows embed, I substitute another from the same creator and re-verify.

Ready to build on approval.

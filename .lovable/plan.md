## Goal

For every pattern on the app, add a hand-picked video from CodeHelp's **Supreme DSA with Java** playlist (Hindi, Java) alongside the existing CodeHelp C++ playlists — so learners get a Java-specific, Hindi explanation they can pick from the language filter.

## Source playlist

CodeHelp — "Supreme DSA with Java by Love Babbar & Lakshay Kumar"
(`https://www.youtube.com/@CodeHelp` → Playlists → Supreme DSA with Java). This is the Java counterpart of the existing C++ series and is fully in Hindi.

## Selection method (as requested)

Judge by **comment quality/engagement**, not raw views:
- Fetch each candidate lecture's page and read the top comments (via `fetch_website` on the watch URL).
- Prefer videos where top comments contain concrete signals: "understood dry run", "cleared doubt at 12:30", corrections acknowledged by author, follow-up questions answered.
- Penalise videos with mostly generic "thanks sir / best teacher" comments, unresolved doubts, or errata in top comments.
- Pick the single best-explained lecture per pattern; if a pattern needs 2 lectures (e.g. recursion for backtracking), pick the top 2.

All picked IDs will be verified (channel = CodeHelp, title matches pattern) before being written into the data file.

## Changes

Only two files touched — no schema/routing changes.

1. `src/data/topics.ts`
   - Extend `YouTubeRef` with an optional `languages?: Language[]` override so a single ref can declare "this specific video is Java" even though the channel default is C++.
   - Update `videoLanguages()` to prefer the per-ref override, falling back to `CHANNEL_LANGUAGES[channel]`.
   - Add a new `CODEHELP_JAVA: Record<PatternId, YouTubeRef>` map (kind: `"video"`, one hand-picked video ID per pattern, `languages: ["Java"]`).
   - In the loop that appends `CODEHELP[...]` into `extraVideos`, also append `CODEHELP_JAVA[...]` when present, so each pattern page shows both:
     - CodeHelp — C++ playlist (existing)
     - CodeHelp — Java (Hindi) — specific lecture (new)

2. No changes to `PatternFlow`, `VideoPicker`, drills, or DB. The language filter chip for "Java" will now light up on every pattern.

## Coverage

All 25 patterns get a Java lecture:

- Arrays: `two-pointers`, `sliding-window`, `kadane`, `prefix-sum`, `hashmap-frequency`, `monotonic-stack`
- Strings/Matrix/Patterns: `string-basics`, `matrix-basics`, `pattern-printing`
- Recursion / Backtracking: `recursion-basics`, `backtracking`
- Linked List: `fast-slow`, `reverse-list`
- Trees: `tree-dfs`, `tree-bfs`
- Graphs: `graph-bfs-dfs`, `topo-sort`, `dijkstra`
- DP: `knapsack`, `lis`, `mcm`
- Search: `binary-search`, `bs-on-answer`
- Bit / Math: `bit-tricks`, `number-theory-basics`

If a specific lecture doesn't exist for a niche pattern (e.g. `bs-on-answer` may fold into the general Binary Search lecture), the closest playlist lecture is used and the title reflects that.

## Verification

- After edits: run typecheck.
- Spot-check 3-4 patterns in the preview to confirm the Java chip appears and the new CodeHelp entry plays inline (no redirect).

## Out of scope

- No YouTube Data API key setup — comment inspection is done via public page fetches during authoring, not at runtime.
- No changes to drills, C++ CodeHelp entries, or other channels.

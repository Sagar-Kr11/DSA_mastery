# Per-problem recall drills

Turn the current one-drill-per-pattern into a tabbed set where each LeetCode problem listed under a pattern has its own drill in C++/Java/Python — built on the existing pattern skeleton with problem-specific blanks (condition, update, return).

## What changes for the user

On every pattern page, the Recall Drill section shows:
- A row of **problem tabs** (one per problem in `pattern.problems`) — e.g. for Sliding Window: `Max Sum Size K` · `Longest Substring w/o Repeat` · `Min Window Substring` …
- Below tabs: the existing **language chips** (C++ / Java / Python).
- Below that: the code template with blanks, unchanged UX (validate, reveal, reset, save score).
- Progress saved per (pattern, problem, language) so switching tabs preserves state and the Tracker "Drills mastered" tile counts each problem as its own drill.

## Data model

`src/data/drills.ts`:
- Keep `Drill` shape. Add a new export:
  ```ts
  export type PatternDrills = {
    patternId: string;
    drills: Drill[];   // one per problem; drill.id === problem.slug
  };
  export const DRILLS: Record<string, Drill[]>  // patternId → array of drills
  ```
- Replace current `DRILLS: Record<string, Drill>` (single) with `Record<string, Drill[]>` (array). First drill in each array is the existing pattern-skeleton drill (kept, retitled to the canonical problem, e.g. Sliding Window's stays under `maximum-subarray-of-size-k` if applicable, otherwise under the first `problems[]` slug).
- For each remaining problem in every pattern's `problems[]`, author a `Drill` with three snippets (C++/Java/Python). Skeleton is copied from the pattern's canonical drill; only the parts that change per problem are re-blanked (comparison operator, window-shrink condition, aggregation, return value).

Coverage target: every problem in `pattern.problems` across all 25 patterns. Approximate volume: ~100 problems × 3 languages ≈ 300 snippets. Authored in one pass in `drills.ts`; no schema change.

## UI

`src/components/RecallDrill.tsx`:
- Accept `drills: Drill[]` instead of `drill: Drill`.
- Add a horizontal, scrollable **problem tab bar** above the existing language chips. Tab label = problem title (from `pattern.problems`, matched by `drill.id === problem.slug`); falls back to `drill.title`.
- Active tab state lives in the component; switching tabs remounts `SnippetRunner` via `key={drillId + lang}` so per-problem inputs reset cleanly.
- Preserve current language-chip + validate + reveal + reset + save behavior unchanged.
- Small "n / total mastered" pill next to tab bar showing how many problems in this pattern the signed-in user has scored ≥80% on (reads existing `pattern_drill_attempts`).

`src/routes/patterns.$patternId.tsx`:
- Change `DRILLS[patternId]` lookup to expect an array; pass `drills` to `RecallDrill`. "Coming soon" placeholder only shows if the array is empty (won't happen after authoring).

## Progress + Tracker

No DB migration. `pattern_drill_attempts` already keys on `(user_id, pattern_id, drill_id, language)`, so per-problem attempts slot in naturally.

`src/routes/tracker.tsx`:
- "Drills mastered" tile: existing query already counts distinct `(pattern_id, drill_id)` at ≥80%; it will automatically scale up as users complete per-problem drills. Update the tile's denominator to total drill count across all patterns (sum of `DRILLS[p].length`).

## Rollout

Single change set:
1. Rewrite `src/data/drills.ts` — new `Drill[]` map, author per-problem drills for all 25 patterns.
2. Update `RecallDrill.tsx` for problem tabs.
3. Update `patterns.$patternId.tsx` and `tracker.tsx` for the new shape.
4. Typecheck; verify a couple of pattern pages in the preview.

## Technical notes

- Blanks stay client-validated with `accepts` aliases — problem-specific answers (e.g. `s.count == k` vs `s.count <= 1`) get their own alias lists.
- Tab bar uses `overflow-x-auto` with the existing chip styling for consistency; no new deps.
- Because `drill.id` is the LeetCode slug, it doubles as a stable analytics key and matches the "Problems" list on the same page — clicking a problem could later scroll to its drill tab (out of scope for this pass).

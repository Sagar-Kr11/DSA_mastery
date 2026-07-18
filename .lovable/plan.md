## Why the "coming soon" placeholder shows up

`src/data/drills.ts` currently only exports drills for 8 pattern IDs:
`sliding-window`, `two-pointers`, `kadane`, `binary-search`, `graph-bfs-dfs`,
`tree-dfs`, `fast-slow`, `knapsack`. The pattern page falls back to the
"Drill coming soon" placeholder for any pattern not in that map — that was
an intentional scope cut in the original plan.

There are 25 patterns total, so 17 currently show the placeholder.

## Plan

Add a C++/Java/Python drill for each remaining pattern in `src/data/drills.ts`
and register it in the `DRILLS` map. No component, schema, or route changes —
the existing `RecallDrill` component picks them up automatically.

Patterns to author (grouped by topic):

- Arrays: `prefix-sum`, `hashmap-frequency`, `monotonic-stack`
- Linked List: `reverse-list`
- Trees: `tree-bfs` (also give `tree-dfs` its own dedicated drill instead of reusing the graph DFS one)
- Graphs: `topo-sort`, `dijkstra`
- DP: `lis`, `mcm`
- Recursion / Backtracking: `backtracking`
- Search: `bs-on-answer`
- Bit / Math: `bit-tricks`, `number-theory-basics`
- Service-company placements: `pattern-printing`, `string-basics`, `matrix-basics`, `recursion-basics`

Each drill will follow the existing shape: one canonical snippet in all three
languages with 3 blanks covering the tokens most likely to be forgotten
(loop bounds, comparison operators, standard-library calls, recurrence terms).
Aliases (`accepts`) are added where multiple correct spellings exist
(e.g. `size` / `length`, `Math.max` / `max`).

## Technical notes

- File touched: `src/data/drills.ts` only.
- `tree-dfs` currently reuses `dfsDrill`; replace with a tree-specific drill
  (`root->left` / `root.left` / recursion on `root.left, root.right`) so tree
  and graph patterns don't share identical content.
- Keep each snippet ≤ ~10 lines and ≤ 3 blanks to match the current UX and
  stay within the Zod cap (`total ≤ 20`).
- No new dependencies, no schema change, no server-function change.
- After edits, run typecheck to confirm the `DRILLS` map still satisfies
  `Record<string, Drill[]>`.

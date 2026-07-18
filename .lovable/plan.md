## Goal

Replace the current "reused pattern skeleton" recall drills with a **unique fill-in-the-blank drill per practice problem**, in C++, Java, and Python — so each problem teaches its own key lines instead of showing the same template with a renamed title.

## Why the current version feels weak

`src/data/drills.ts` uses `cloneDrill(pattern, problem)` which reuses the pattern's template and just relabels the title. Every problem under a pattern shows identical code with the same blanks, so switching tabs teaches nothing new.

## What changes

### 1. Data model: one authored drill per problem

Rewrite `src/data/drills.ts` so `DRILLS[patternId]` is an array where **each entry is hand-authored for a specific problem**, not cloned:

```ts
type Drill = {
  id: string;              // problem slug, e.g. "two-sum"
  patternId: string;
  problemTitle: string;
  problemUrl: string;      // LeetCode / GFG link
  snippets: { language: 'cpp'|'java'|'python'; code: string; blanks: Blank[] }[];
};
```

Each snippet is the actual solution outline for that problem with 4–7 blanks on the meaningful tokens (the condition, the update, the return value) — not generic `i++` scaffolding.

### 2. Coverage

Author drills for **every problem currently listed in `src/data/topics.ts`** across all 25 patterns (~100 problems × 3 languages ≈ 300 snippets). Each snippet:

- Compiles mentally as a real solution to that specific problem
- Highlights the 4–7 tokens most worth memorizing for interviews
- Uses `{{blankId}}` placeholders with an `answers` map (accepts obvious synonyms, e.g. `len` / `size`)

### 3. UI (no visual redesign)

`src/components/RecallDrill.tsx` already has the tab bar, language switch, and validator. Only tweaks:

- Show the problem's LeetCode/GFG link next to the tab title
- Keep the `key={drill.id}-${lang}` reset behavior
- No layout changes

### 4. Tracker

`pattern_drill_attempts` already keys on `(pattern_id, drill_id)`. No schema change; the new per-problem `drill.id` values slot in directly.

## Technical notes

- File touched most heavily: `src/data/drills.ts` (full rewrite, large file — will be split into `src/data/drills/<patternId>.ts` and re-exported from an index to stay maintainable).
- `RecallDrill.tsx`: ~10-line change to render the problem link.
- `patterns.$patternId.tsx`: already passes the drill array, no change.
- No DB migration, no new dependencies.

## Scope check before I start

Authoring ~100 problem-specific drills × 3 languages is a large content pass. Two questions so I build the right thing:

1. **Blanks per snippet** — target **5 blanks** (tight, interview-recall focused) or **8–10 blanks** (more thorough, closer to writing the solution)?
2. **Rollout** — do all 25 patterns in one pass, or start with the 6 most-visited patterns (Sliding Window, Two Pointers, Binary Search, BFS, DFS, DP-1D) and expand next turn?

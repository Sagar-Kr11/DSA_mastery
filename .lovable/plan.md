# Fill-in-the-Blanks Recall Drills

Add a "Recall drill" section to each pattern page. Users see a code template with key tokens blanked out (e.g., `while (left ___ right)`, `map.___(key, val)`), type the missing token, and get instant feedback. Language tabs (C++ / Java / Python) match the existing language filter. Progress saves to Lovable Cloud so it shows up on the tracker.

## What it looks like

On `/patterns/:patternId`, below the video and above practice problems:

```text
┌─ Recall drill ──────────────── C++ | Java | Python ─┐
│ // Sliding window — max sum of size k                │
│ int sum = 0, best = 0;                               │
│ for (int i = 0; i < k; i++) sum += arr[i];           │
│ best = sum;                                          │
│ for (int i = k; i < arr.___; i++) {   [n] ✓          │
│   sum += arr[i] ___ arr[i - k];       [ - ]          │
│   best = ___(best, sum);              [max]          │
│ }                                                     │
│                                                       │
│ 2 / 3 correct  ·  [Reveal all]  [Reset]              │
└──────────────────────────────────────────────────────┘
```

Each blank is a monospace input sized to the expected token. Correct = green ring + check. Wrong = red ring; second wrong attempt shows the answer inline. Tolerance: trim + case-insensitive + common alias list per blank (e.g., `size`/`length`/`len`).

## Data model

Extend the `Pattern` type in `src/data/topics.ts`:

```ts
type Blank = { id: string; answer: string; accepts?: string[]; hint?: string };
type DrillSnippet = { language: "C++" | "Java" | "Python"; template: string; blanks: Blank[] };
type Drill = { id: string; title: string; snippets: DrillSnippet[] };
// Pattern gains: drills?: Drill[]
```

`template` uses `{{blankId}}` placeholders; the renderer splits on those and injects inputs. Start with one drill per pattern in all 3 languages; author more later without code changes.

## Backend (Lovable Cloud)

New table `pattern_drill_attempts` for per-user progress:

```text
user_id uuid, pattern_id text, drill_id text, language text,
correct int, total int, completed_at timestamptz
PRIMARY KEY (user_id, pattern_id, drill_id, language)
```

RLS: user can read/write only their own rows. GRANT to authenticated + service_role.

Server functions in `src/lib/drills.functions.ts`:
- `getDrillProgress()` — returns all attempts for current user (used by tracker + pattern page).
- `saveDrillAttempt({ patternId, drillId, language, correct, total })` — upsert.

## Frontend

- `src/components/RecallDrill.tsx` — renders one drill, handles language tabs, per-blank input state, validation, and calls `saveDrillAttempt` when the user finishes (all blanks attempted).
- `src/routes/patterns.$patternId.tsx` — render `<RecallDrill>` for each entry in `pattern.drills`. Signed-out users can still practice; a small "Sign in to save" note replaces the save.
- `src/routes/tracker.tsx` — add a "Drills mastered" tile (count of drills where correct === total).

## Scope for this pass

- Author drills for ~8 flagship patterns first (Sliding Window, Two Pointers, Kadane, Binary Search, BFS, DFS, DP 1-D, Fast/Slow pointers). Others get a "Drill coming soon" placeholder so the section doesn't look empty.
- No new dependencies. Uses existing Tailwind + sonner.

## Technical notes

- Validation is pure client-side comparison; server just records the score. Never send the answer key over the wire from the server.
- Zod-validate the save payload (`patternId`, `drillId` non-empty; `language` enum; `correct` ≤ `total` ≤ 20).
- Debounce saves: only persist on completion or explicit "Reset", not per keystroke.

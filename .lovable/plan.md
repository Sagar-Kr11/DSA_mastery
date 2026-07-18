## Problem

Some CodeHelp Java entries in `CODEHELP_JAVA` (in `src/data/topics.ts`) are lectures whose actual topic doesn't match the pattern they're attached to. Confirmed offender the user hit:

- `hashmap-frequency` → currently pointing at L31 "Missing Elements from Array of Duplicates" (`GS-7B21Ouh8`), which is an array/duplicates lecture, not a frequency-counting/HashMap lecture.

Other mappings I added by title alone and never verified against the actual video content — most suspicious:
- `prefix-sum` → L27 "Array Problem Solving Part-1" (generic array intro, not prefix-sum)
- `two-pointers` → L28 "Array Manipulation Problems" (generic, not two-pointer specific)
- `kadane` → L32 "Kadane's Algorithm" (likely correct — keep pending verify)
- `pattern-printing`, `string-basics`, `number-theory-basics`, `bit-tricks`, `matrix-basics`, `binary-search`, `bs-on-answer`, `recursion-basics`, `backtracking` — titles look on-topic but will still be re-verified.

## Plan

Only `src/data/topics.ts` is touched. No schema, routing, or component changes.

1. **Audit every entry in `CODEHELP_JAVA`.** For each video ID:
   - Fetch `https://www.youtube.com/watch?v=<id>` and read the actual title + description.
   - Confirm channel is CodeHelp and the lecture's real subject matches the pattern.
2. **Re-pick videos that don't match.** For each mismatched pattern, find the correct lecture in the "Supreme DSA with Java" playlist (`PLDzeHZWIZsTqNW1gvXXAicBgku9uPZeOC`) whose title/description is genuinely about that pattern — e.g. for `hashmap-frequency`, the HashMap intro lecture (not the "missing elements" one); for `two-pointers`, the dedicated two-pointer lecture if one exists.
3. **Drop, don't fake.** If the Java playlist has no lecture that genuinely covers a pattern (the series is still in progress), remove that pattern's entry from `CODEHELP_JAVA` entirely. The pattern will fall back to the existing C++ playlist rather than mislead the user with an off-topic Java video.
4. **Update titles** so each `title` string reflects the real lecture title (`"CodeHelp Java — <real title> (L<n>)"`).

## Verification

- Typecheck.
- Open 3–4 pattern pages including `hashmap-frequency`, `prefix-sum`, `two-pointers`, and one that stayed the same (e.g. `kadane`) and confirm the Java chip opens a video whose title matches the pattern.

## Out of scope

- C++ CodeHelp mappings, other channels, drills, DB, and routing — untouched.

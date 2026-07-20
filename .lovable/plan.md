## Goal

The PDF's "TCS NQT" ranking table (ranks 1–4) plus the blue "Practice these from your sheet" boxes list 24 problems. Cross-checking against `src/data/topics.ts`, **16 are already in the app**. Add the **8 that are missing**, each with:

- A LeetCode entry in the correct pattern's `problems` array (auto-renders the LeetCode link in the practice list)
- A unique, hand-authored recall drill (C++, Java, Python) in `src/data/drills.ts`

## Missing problems → target pattern

| # | Problem (slug) | Difficulty | Pattern |
|---|---|---|---|
| 1 | `best-time-to-buy-and-sell-stock` | Easy | `kadane` (running-min tracking) |
| 2 | `move-zeroes` | Easy | `two-pointers` |
| 3 | `minimum-size-subarray-sum` | Medium | `sliding-window` |
| 4 | `valid-parentheses` | Easy | `monotonic-stack` (stack pattern lives here) |
| 5 | `search-insert-position` | Easy | `binary-search` |
| 6 | `first-bad-version` | Easy | `binary-search` |
| 7 | `find-minimum-in-rotated-sorted-array` | Medium | `binary-search` |
| 8 | `generate-parentheses` | Medium | `backtracking` |

The other 16 blue-box problems (Two Sum, 3Sum-adjacent items, Maximum Subarray, Container With Most Water, Remove Duplicates from Sorted Array, Valid Anagram, Valid Palindrome, Reverse String, Longest Substring Without Repeating Chars, First Unique Character, Climbing Stairs, Fibonacci Number, Subsets, Permutations, Search in Rotated Sorted Array, Find First and Last Position) already exist in `topics.ts` — no duplicates will be added.

## Changes

### 1. `src/data/topics.ts`
Append the 8 slugs into the `problems` array of the matching pattern object. This alone gives every problem its direct LeetCode link (`patterns.$patternId.tsx` already renders `https://leetcode.com/problems/${slug}/` per row).

### 2. `src/data/drills.ts`
For each of the 8 new slugs, add a new `Drill` entry with three unique snippets (C++/Java/Python), each with 4–7 blanks on the meaningful tokens (loop condition, comparison, pointer update, return value) — not generic scaffolding. Following the existing hand-authored style already used across the file.

Examples of the blanks I'll author (Java shown for brevity — C++/Python mirrored):

- **best-time-to-buy-and-sell-stock**: `minPrice = {{init}}` / `minPrice = Math.min(minPrice, {{cmp}})` / `profit = Math.max(profit, prices[i] - {{sub}})`
- **move-zeroes**: `if (nums[i] {{cond}} 0) nums[{{ins}}++] = nums[i];` / trailing `nums[{{ins}}++] = {{fill}};`
- **minimum-size-subarray-sum**: `sum += nums[{{r}}]` / `while (sum {{cmp}} target)` / `ans = Math.min(ans, r - l + {{off}})` / `sum -= nums[{{l}}++]`
- **valid-parentheses**: `Map.of(')','(', ']','[', '}','{')` — blanks on the map keys/values and `stack.{{op}}()`
- **search-insert-position**: `while (low {{cmp}} high)` / `mid = low + (high - low) / {{d}}` / return `{{ret}}`
- **first-bad-version**: `if (isBadVersion(mid)) high = {{a}}; else low = {{b}};` / return `{{ret}}`
- **find-minimum-in-rotated-sorted-array**: `if (nums[mid] {{cmp}} nums[high]) low = mid + 1; else high = {{h}}` / return `nums[{{ret}}]`
- **generate-parentheses**: `if (open < {{n}}) backtrack(cur + "(", open + 1, close, ...)` / `if (close < {{o}}) backtrack(cur + ")", open, close + 1, ...)`

### 3. No UI, schema, or route changes
`RecallDrill.tsx`, `patterns.$patternId.tsx`, and `pattern_drill_attempts` already handle per-problem drills keyed by `(patternId, drillId)`. The new drill IDs slot in with no code changes.

## Verification
- Typecheck (`tsgo`) after the edits.
- Sanity-check by visiting `/patterns/kadane`, `/patterns/binary-search`, `/patterns/backtracking`, `/patterns/monotonic-stack`, `/patterns/sliding-window`, `/patterns/two-pointers` and confirming each new problem row shows a LeetCode link and its drill tab loads.

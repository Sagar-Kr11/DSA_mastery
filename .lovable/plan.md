## Goal
Add Java video walkthroughs alongside the existing Python (NeetCode) picks for every problem in `src/data/problemVideos.ts`, so the inline Video panel shows a Java tab too.

## Source of Java videos
Primary: **takeUforward / Striver** — each Striver problem video contains both C++ and Java code side-by-side and his Java community solutions are the most-praised in comments. Fallbacks when Striver hasn't covered a problem: **Kunal Kushwaha**, **CodeHelp (Supreme DSA Java, Hindi)**, **Apna College**.

Selection rule (unchanged from the earlier plan): pick by top-comment sentiment ("clean dry run", "finally understood"), not raw views. Skip a problem's Java entry only if no trusted-creator video exists — better than a bad pick.

## Change
Only `src/data/problemVideos.ts`. For each of the ~75 keys already in the map, append a `{ lang: "Java", yt: { kind: "video", id, channel, title } }` entry to the existing array. No UI change needed — `patterns.$patternId.tsx` already renders one tab per language present in the array.

## Coverage plan
Target Java coverage per pattern group (rough):
- Arrays / two-pointers / kadane / prefix / sliding-window: all covered by Striver
- HashMap, Stack/Monotonic, Linked List, Trees, Graphs, DP, Backtracking, Binary Search: Striver has full Java coverage of the classics; use his A-Z DSA sheet videos
- Bits: Striver bit-manipulation series
- Strings / Matrix: Striver where present, else Kunal Kushwaha

I'll batch by pattern group, typecheck after each batch, then spot-verify one video per group actually loads inline.

## Non-goals
- No new patterns, no schema change, no UI change.
- Not adding C++ this turn — only Java, as requested. (C++ can be added next in the same shape if you want.)
- No new creators outside the existing shortlist.

## Verification
`tsgo` typecheck after each batch, then open two random pattern pages in the preview and confirm the Java tab appears next to Python and plays inline.

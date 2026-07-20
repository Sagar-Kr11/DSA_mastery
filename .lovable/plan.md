# Goal

Every problem in every pattern's **Practice problems** list should show a "Video" button next to its "LeetCode" button. Clicking it opens an inline video walkthrough of *that specific problem*, with a language-tab selector (C++ / Java / Python) so the user picks the explanation in the language they want. No YouTube redirect — video plays inline in the app.

# What "best video" means

For every problem I'll pick 1 video per language (max 3) using this ranking:

1. **Creator is already trusted in this app** (Striver, NeetCode, Aditya Verma, CodeHelp / Love Babbar, Apna College, take U forward, Kunal Kushwaha, MIK, Errichto). These are the creators the app already curates — the same shortlist you approved earlier.
2. Among their videos on that exact problem, prefer the one with the **highest positive-sentiment comment ratio** (comments explicitly praising clarity / "finally understood" / dry-run explanation), not raw view count. If two videos are close, prefer the one whose top pinned/loved comments are dry-run-focused.
3. Language mapping used across the app:
   - **C++**: Striver, take U forward, Errichto, Love Babbar (older)
   - **Java**: NeetCode-Java forks, CodeHelp Supreme DSA (Hindi-Java), Kunal Kushwaha
   - **Python**: NeetCode (primary), MIK
   Aditya Verma → language-agnostic pseudocode, tagged under all 3 with a note.

I'll only add a language entry when a genuinely good video exists — no filler. Problems with no good curated video get **no Video button** (list still shows the LeetCode link). That's fine; better than a bad recommendation.

# Data model change

`src/data/topics.ts` — extend the `Problem` type:

```ts
type ProblemVideo = { lang: "C++" | "Java" | "Python"; yt: YouTubeRef; note?: string };
type Problem = {
  slug: string; title: string; difficulty: "Easy"|"Medium"|"Hard";
  videos?: ProblemVideo[]; // NEW, optional
};
```

Then attach `videos: [...]` to each problem for which I've picked a walkthrough. Roughly **~100 problems × up to 3 langs**, but realistically ~180–220 total video entries because not every creator has covered every problem.

# UI change

`src/routes/patterns.$patternId.tsx` — inside the practice-problems `map`:

- Replace each row's right-side single "LeetCode" chip with two chips: **LeetCode** and **Video** (only when `q.videos?.length`).
- Clicking **Video** expands an inline panel below that row (accordion-style, one open at a time) containing:
  - Language pill tabs (C++ / Java / Python), only the langs that have a video for this problem.
  - `<YouTubeEmbed />` for the picked language, remounted on switch so the iframe reloads.
- Video panel uses the existing `GlassCard` divide styling; no new dependencies.

Also: **first tab defaults to the user's last-picked language** (localStorage `dsa.videoLang`, already the convention used elsewhere in the app), falling back to the first available.

# Verification workflow before I commit each video

For every problem × language pick I'll:

1. Search the creator's channel for the problem name.
2. Confirm the video actually solves *that exact LeetCode problem* (not just the pattern).
3. Skim top-liked and top-recent comments for signal ("clean explanation", "dry run helped", "finally got it") vs noise ("code doesn't compile", "wrong approach").
4. Only then add it. If none pass, I skip that language for that problem.

I will do this in **batches per pattern** (25 patterns) so if you want to spot-check one pattern before I roll on, we can.

# Non-goals

- No new tables, no schema change, no server-fn change.
- No changes to Recall Drill.
- No changes to the pattern-level `VideoPicker` at the top of the page — that stays as-is for pattern-wide overviews.
- No auto-scraping / no runtime YouTube API calls — picks are hand-curated and baked into `topics.ts`.

# Rollout

1. Extend `Problem` type + `ProblemVideo` type in `topics.ts`.
2. Update `patterns.$patternId.tsx` to render the new "Video" chip + inline panel with language tabs.
3. Fill in `videos: [...]` per problem, pattern by pattern (Arrays → Strings → HashMap → Stack/Queue → Linked List → Trees → Graphs → DP → Greedy/Backtracking → Binary Search → Bits → Placements).
4. `tsgo` typecheck after each pattern batch.
5. Manual smoke: open 3 random pattern pages, expand a few Video panels, switch languages, confirm inline playback works and no YouTube redirect.

# Confirm before I start

- **Curator shortlist above OK?** (Striver, NeetCode, Aditya Verma, CodeHelp, Apna College, take U forward, Kunal Kushwaha, MIK, Errichto — no new channels unless you add them.)
- **Skip problems with no good video** rather than filling with mediocre picks — confirm this is what you want.
- **One video per language max** — or do you want up to 2 per language when there are two clearly-different-approach explanations (e.g., recursive vs iterative)?

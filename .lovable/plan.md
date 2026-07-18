## Root cause (verified)

I called LeetCode's public GraphQL `recentAcSubmissionList` for `Dimple_1106` just now and it returned `[]`. The last sync in your network logs also returned `{ synced: 0, reason: "empty" }`. The app's sync path is working — LeetCode is refusing to expose your recent accepted submissions publicly.

This happens when, on leetcode.com:
- **Profile → Edit Profile → "Show recent AC submissions"** is off, or
- Your submissions are set to private / profile is private.

Without that toggle on, no third‑party (including this app) can read your solves — LeetCode has no authenticated API we can use here.

## What I'll do

### 1. Make the failure obvious in the UI
- In `src/routes/_authenticated/settings.tsx`, when sync returns `reason: "empty"`, replace the soft toast with an inline warning card that says: "LeetCode returned 0 submissions for `<username>`. Enable **Show recent AC submissions** on your LeetCode profile, then retry." Include a direct link to `https://leetcode.com/profile/` settings and to the public profile URL so you can verify it's visible.
- Add a "Test connection" button that calls the sync and shows the raw reason (`empty`, `leetcode-error`, `network-error`, `no-username`, `ok`) plus the count.

### 2. Also pull the lifetime solved count as a fallback signal
- Extend `syncLeetCode` in `src/lib/leetcode.functions.ts` to additionally query `matchedUser { submitStats { acSubmissionNum { difficulty count } } }`. This works even when recent AC is hidden and lets us show "LeetCode reports N total solved" on the tracker even when we can't map individual slugs.
- Surface that number on `/tracker` next to "Total solved" so you can see LeetCode sees your account, even if slug‑level mapping is blocked.

### 3. Auto-sync on relevant screens
- Trigger `syncLeetCode` on mount for `/tracker` and `/settings` (once per session, guarded by a ref) so you don't have to click Sync manually every time. Manual button stays for on‑demand refresh.

### 4. Small correctness fix
- Currently `syncLeetCode` skips upsert entirely when every returned slug is already marked `manual`. Change it to still refresh `solved_at` for `leetcode`-source rows so re‑solves update the heatmap.

## What this will NOT do
- It won't magically read private submissions. If the LeetCode toggle stays off, individual problem mapping remains impossible from any external app. The lifetime count from `matchedUser` is the best we can do in that case.

## Files touched
- `src/lib/leetcode.functions.ts` — add `matchedUser` query, return `{ synced, reason, totalSolved? }`, tweak upsert filter.
- `src/routes/_authenticated/settings.tsx` — inline diagnostic card, test-connection button, auto-sync on mount.
- `src/routes/tracker.tsx` — show LeetCode‑reported total, auto-sync on mount.

## Your action item
After I ship this, open `https://leetcode.com/Dimple_1106/` in an incognito window. If you don't see a "Recent AC" list there, flip **Show recent AC submissions** on in your LeetCode profile settings and hit Sync again — that's the switch that unblocks slug-level tracking.

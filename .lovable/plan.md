## 1. Fix scroll lag

Two known perf offenders in the current styles:

- **`backdrop-blur-xl` on the sticky `Header`** (`src/components/Header.tsx`). Backdrop-blur re-samples and blurs every pixel behind it on every frame — expensive on a sticky bar that sits over scrolling content, especially with the animated radial gradients in the background.
- **`background-attachment: fixed`** on `body` in `src/styles.css` combined with three large radial gradients. `background-attachment: fixed` forces the browser to repaint the gradient layer on every scroll frame, which compounds with the header blur.

Changes:

- `src/components/Header.tsx`: replace `bg-background/60 backdrop-blur-xl` with a solid-ish `bg-background/95` (or a subtle top-border + shadow). Keeps the glassy look without the per-frame blur cost.
- `src/styles.css`: drop `background-attachment: fixed` on `body` so the radial gradients scroll with the page (or move them to a `::before` layer with `position: fixed; z-index: -1; will-change: transform;` — cheaper than fixed-attachment).
- Leave the `glass` utility (`backdrop-filter: blur(14px)`) alone — it's used on small cards, not on a scroll-overlapping full-width bar, so it's not the bottleneck.

No functional/business changes; purely CSS-level.

## 2. Why the "Edit with Lovable" badge still shows

The badge is hidden on **published** deployments only. You're currently viewing the **preview** URL (`id-preview--…lovable.app`) — the badge always renders there so you can jump back into the editor. On your live share link (`https://pattern-quest-guide.lovable.app`) the badge is already hidden (I set `hide_badge: true` before publishing).

No code change needed for this — I'll just confirm the setting is still on and explain in the reply. If you open the published URL in a new tab, the badge will not be there.

## Verification

- Reload the preview after the CSS changes and scroll the home + a pattern page; scrolling should feel smooth.
- Open `https://pattern-quest-guide.lovable.app` to confirm the badge is absent on the live site.

I found the likely cause in `src/components/Heatmap.tsx`: the heatmap places cells using local weekday logic (`getDay()`), but labels/keys dates with `toISOString()`, which converts local midnight to UTC. In India time, that can make a Saturday cell display the previous date, so `2026-07-17` appears on Saturday.

Plan:
1. Replace the UTC-based date key helper with a local-date formatter so `YYYY-MM-DD` always matches the visible weekday.
2. Add a local-date parser/helper for streak calculations so consecutive-day math uses the same local calendar convention.
3. Keep the existing heatmap layout and month alignment unchanged; only fix date mapping and streak date math.
4. Verify that `2026-07-17` maps to Friday and `2026-07-18` maps to Saturday in the tracker heatmap.
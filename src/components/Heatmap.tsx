import { useMemo } from "react";

type Cell = { date: string; count: number };

function toLocalDateKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toSolvedDateKey(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return toLocalDateKey(new Date(value));
}

function parseLocalDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function Heatmap({ solvedDates }: { solvedDates: string[] }) {
  const { weeks, counts, months } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const iso of solvedDates) {
      const day = toSolvedDateKey(iso);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Start = today - 364 days, roll back to Sunday
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

    const weeks: Cell[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let cursor = new Date(start);
    let weekIdx = 0;
    let lastMonth = -1;
    while (cursor <= today) {
      const week: Cell[] = [];
      const firstOfWeek = cursor.getMonth();
      if (firstOfWeek !== lastMonth && cursor.getDate() <= 7) {
        months.push({ label: cursor.toLocaleString("en", { month: "short" }), weekIndex: weekIdx });
        lastMonth = firstOfWeek;
      }
      for (let d = 0; d < 7; d++) {
        const iso = toLocalDateKey(cursor);
        week.push({ date: iso, count: counts.get(iso) ?? 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
      weekIdx++;
    }
    return { weeks, counts, months };
  }, [solvedDates]);

  const level = (c: number) => {
    if (c === 0) return "bg-white/[0.04]";
    if (c === 1) return "bg-[oklch(0.4_0.1_200)]";
    if (c === 2) return "bg-[oklch(0.55_0.14_200)]";
    if (c <= 4) return "bg-[oklch(0.7_0.17_200)]";
    return "bg-[oklch(0.8_0.19_200)] shadow-[0_0_12px_-2px_oklch(0.78_0.16_200/0.6)]";
  };

  const COL = 15; // 12px cell + 3px gap
  const ROW = 15;

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="w-6" />
          <div className="relative h-4" style={{ width: `${weeks.length * COL}px` }}>
            {months.map((m, i) => (
              <span
                key={`${m.label}-${i}`}
                className="absolute top-0 text-[10px] text-muted-foreground"
                style={{ left: `${m.weekIndex * COL}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-[3px] pr-1 text-[10px] leading-3 text-muted-foreground" style={{ height: `${7 * ROW - 3}px` }}>
            <span className="h-3" />
            <span className="h-3">Mon</span>
            <span className="h-3" />
            <span className="h-3">Wed</span>
            <span className="h-3" />
            <span className="h-3">Fri</span>
            <span className="h-3" />
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    title={`${cell.date}: ${cell.count} solved`}
                    className={`h-3 w-3 rounded-[3px] ${level(cell.count)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="ml-6 flex items-center gap-1 pt-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 4, 6].map((n) => (
            <span key={n} className={`h-3 w-3 rounded-[3px] ${level(n)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export function computeStreaks(solvedDates: string[]): { current: number; longest: number; total: number } {
  const days = new Set(solvedDates.map(toSolvedDateKey));
  const sorted = Array.from(days).sort();
  if (sorted.length === 0) return { current: 0, longest: 0, total: 0 };
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseLocalDateKey(sorted[i - 1]);
    const cur = parseLocalDateKey(sorted[i]);
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86_400_000);
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  // current streak: from today (or yesterday if not solved today) backwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let current = 0;
  const cursor = new Date(today);
  if (!days.has(toLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(toLocalDateKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest, total: days.size };
}

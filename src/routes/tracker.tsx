import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getSolved } from "@/lib/solved.functions";
import { getDrillProgress } from "@/lib/drills.functions";
import { GlassCard } from "@/components/GlassCard";
import { Heatmap, computeStreaks } from "@/components/Heatmap";
import { Flame, Trophy, CheckCircle2, Brain } from "lucide-react";
import { PATTERNS } from "@/data/topics";

export const Route = createFileRoute("/tracker")({
  head: () => {
    const title = "Tracker — Streaks, heatmap & solved history | DSA Mastery";
    const description = "Track your DSA journey with daily streaks, a GitHub-style year heatmap, and a full history of solved LeetCode patterns and problems.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TrackerPage,
});

function TrackerPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchSolved = useServerFn(getSolved);
  const solvedQ = useQuery({
    queryKey: ["solved"],
    queryFn: () => fetchSolved(),
    enabled: !!signedIn,
  });

  const fetchDrills = useServerFn(getDrillProgress);
  const drillsQ = useQuery({
    queryKey: ["drill-progress"],
    queryFn: () => fetchDrills(),
    enabled: !!signedIn,
  });

  const rows = solvedQ.data ?? [];
  const dates = rows.map((r) => r.solved_at);
  const streaks = computeStreaks(dates);
  const drillsMastered = (drillsQ.data ?? []).filter((r) => r.total > 0 && r.correct === r.total).length;

  // Build slug -> pattern lookup for display
  const slugToPatterns: Record<string, string[]> = {};
  for (const p of PATTERNS) for (const q of p.problems) {
    (slugToPatterns[q.slug] ||= []).push(p.name);
  }

  if (signedIn === false) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <GlassCard className="p-8">
          <h1 className="text-2xl font-bold">Sign in to see your tracker</h1>
          <p className="mt-2 text-sm text-muted-foreground">Streaks and heatmap sync across devices when you sign in.</p>
          <Link to="/auth" className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Sign in</Link>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Your tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every solved problem — from LeetCode sync or manual checks.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<Flame className="h-4 w-4" />} label="Current streak" value={streaks.current} suffix="days" />
        <StatCard icon={<Trophy className="h-4 w-4" />} label="Longest streak" value={streaks.longest} suffix="days" />
        <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Total solved" value={rows.length} />
      </div>

      <GlassCard className="mt-6 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity — last 365 days</h2>
        <Heatmap solvedDates={dates} />
      </GlassCard>

      <GlassCard className="mt-6 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent solved</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet. Mark a problem or sync from LeetCode in <Link to="/settings" className="text-primary hover:underline">Settings</Link>.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.slice(0, 50).map((r) => (
              <li key={r.slug} className="flex items-center gap-3 py-2.5">
                <span className={`h-2 w-2 rounded-full ${r.source === "leetcode" ? "bg-accent" : "bg-primary"}`} />
                <a href={`https://leetcode.com/problems/${r.slug}/`} target="_blank" rel="noopener noreferrer" className="flex-1 font-mono text-sm hover:text-primary">
                  {r.slug}
                </a>
                <span className="text-[11px] text-muted-foreground">
                  {slugToPatterns[r.slug]?.[0] ?? "—"}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.source}</span>
                <time className="text-[11px] text-muted-foreground">{new Date(r.solved_at).toLocaleDateString()}</time>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </main>
  );
}

function StatCard({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-glow text-foreground">{value}</span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </GlassCard>
  );
}

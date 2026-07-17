import { createFileRoute, Link } from "@tanstack/react-router";
import { TOPICS, PATTERNS_BY_ID } from "@/data/topics";
import { GlassCard } from "@/components/GlassCard";
import { ArrowRight, Flame, PlayCircle, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-12">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.78_0.16_200)]" />
          Pattern-first DSA learning
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Learn DSA the way <span className="text-glow text-primary">top companies</span> actually test it.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          11 topics. Every pattern with an animated flowchart, an inline video from the creator best known for it,
          the companies that ask it in OAs, and LeetCode problems that sync straight to your profile.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Feature icon={<PlayCircle className="h-4 w-4" />} label="Verified creator videos" />
          <Feature icon={<Target className="h-4 w-4" />} label="LeetCode auto-sync" />
          <Feature icon={<Flame className="h-4 w-4" />} label="Streaks & heatmap" />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Choose a topic</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Link key={t.id} to="/topics/$topicId" params={{ topicId: t.id }} className="group">
              <GlassCard className="h-full p-5 transition group-hover:glow-ring">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{t.emoji}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.patternIds.slice(0, 3).map((pid) => (
                    <span key={pid} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {PATTERNS_BY_ID[pid]?.name}
                    </span>
                  ))}
                  {t.patternIds.length > 3 && (
                    <span className="text-[11px] text-muted-foreground">+{t.patternIds.length - 3} more</span>
                  )}
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
  );
}

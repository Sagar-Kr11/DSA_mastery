import { createFileRoute, Link } from "@tanstack/react-router";
import { PATTERNS, TOPICS, TOPICS_BY_ID } from "@/data/topics";
import { GlassCard } from "@/components/GlassCard";
import { ArrowRight, CheckCircle2, Play, Workflow } from "lucide-react";

export const Route = createFileRoute("/roadmap/leetcode-patterns")({
  head: () => {
    const title = "The Ultimate 75 LeetCode Patterns Roadmap — DSA Mastery";
    const description =
      "A curated LeetCode patterns roadmap: every core DSA pattern grouped by topic, with animated flowcharts, inline creator walkthroughs (Striver, NeetCode, CodeHelp), and hand-picked problems to solve in order.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: "leetcode patterns, dsa patterns, coding interview roadmap, leetcode roadmap, dsa roadmap, coding patterns" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: RoadmapPage,
});

function RoadmapPage() {
  const totalPatterns = PATTERNS.length;
  const totalProblems = PATTERNS.reduce((n, p) => n + p.problems.length, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Roadmap</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          The Ultimate LeetCode Patterns Roadmap
        </h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Master the coding interview by learning <strong>patterns</strong>, not
          individual problems. This curated roadmap groups {totalProblems}+ hand-picked
          LeetCode problems across {totalPatterns} core DSA patterns — each with an
          animated flowchart, inline creator walkthroughs, and a language filter so
          you can learn in C++, Java, or Python.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <Workflow className="h-4 w-4 text-primary" /> Animated pattern flows
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <Play className="h-4 w-4 text-primary" /> Inline creator videos
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" /> LeetCode auto-sync
          </span>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          How to use this roadmap
        </h2>
        <GlassCard className="p-5 text-sm text-muted-foreground">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Go top-to-bottom. Each topic builds on the previous — arrays before
              strings, trees before graphs, recursion before DP.
            </li>
            <li>
              Open a pattern, watch the flow diagram, then pick the creator whose
              explanation clicks for you.
            </li>
            <li>
              Solve the linked LeetCode problems in order (Easy → Medium → Hard).
              Check them off — or sync automatically from your LeetCode profile.
            </li>
            <li>
              Revisit any pattern where you failed a problem. Mastery = pattern
              recognition, not memorization.
            </li>
          </ol>
        </GlassCard>
      </section>

      <section className="space-y-8">
        {TOPICS.map((topic, ti) => {
          const patterns = topic.patternIds
            .map((pid) => PATTERNS.find((p) => p.id === pid))
            .filter((p): p is (typeof PATTERNS)[number] => Boolean(p));
          if (patterns.length === 0) return null;
          return (
            <div key={topic.id}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  <span className="mr-2 text-muted-foreground">
                    {String(ti + 1).padStart(2, "0")}.
                  </span>
                  <span className="mr-2">{topic.emoji}</span>
                  {topic.name}
                </h2>
                <Link
                  to="/topics/$topicId"
                  params={{ topicId: topic.id }}
                  className="inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
                >
                  Open topic <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
                {topic.blurb}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {patterns.map((p) => {
                  const counts = p.problems.reduce(
                    (acc, q) => {
                      acc[q.difficulty]++;
                      return acc;
                    },
                    { Easy: 0, Medium: 0, Hard: 0 } as Record<
                      "Easy" | "Medium" | "Hard",
                      number
                    >,
                  );
                  return (
                    <Link
                      key={p.id}
                      to="/patterns/$patternId"
                      params={{ patternId: p.id }}
                      className="group block"
                    >
                      <GlassCard className="h-full p-4 transition group-hover:border-primary/40">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {p.name}
                          </h3>
                          <span className="text-[10px] text-muted-foreground">
                            {p.problems.length} Qs
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {p.logicType}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                          {counts.Easy > 0 && (
                            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">
                              {counts.Easy} Easy
                            </span>
                          )}
                          {counts.Medium > 0 && (
                            <span className="rounded-md border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-amber-300">
                              {counts.Medium} Medium
                            </span>
                          )}
                          {counts.Hard > 0 && (
                            <span className="rounded-md border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-rose-300">
                              {counts.Hard} Hard
                            </span>
                          )}
                        </div>
                      </GlassCard>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14">
        <GlassCard className="p-6 text-center">
          <h2 className="text-lg font-semibold">Ready to start solving?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to check off problems, track your streak, and auto-sync solved
            questions from your LeetCode profile.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              to="/"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Browse all topics
            </Link>
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          </div>
        </GlassCard>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "The Ultimate LeetCode Patterns Roadmap",
            description:
              "Curated roadmap of core LeetCode / DSA patterns grouped by topic.",
            itemListElement: PATTERNS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `https://pattern-quest-guide.lovable.app/patterns/${p.id}`,
              description: `${p.logicType} (Topic: ${TOPICS_BY_ID[p.topicId]?.name})`,
            })),
          }),
        }}
      />
    </main>
  );
}

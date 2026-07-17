import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PATTERNS_BY_ID, TOPICS_BY_ID, CHANNEL_LABELS } from "@/data/topics";
import { GlassCard } from "@/components/GlassCard";
import { PatternFlow } from "@/components/PatternFlow";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getSolved, toggleSolved } from "@/lib/solved.functions";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/patterns/$patternId")({
  head: ({ params }) => {
    const p = PATTERNS_BY_ID[params.patternId];
    const title = p ? `${p.name} — DSA Mastery` : "Pattern — DSA Mastery";
    const description = p?.logicType ?? "DSA pattern";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }) => {
    if (!PATTERNS_BY_ID[params.patternId]) throw notFound();
    return null;
  },
  component: PatternPage,
  notFoundComponent: () => <div className="p-10 text-center">Pattern not found.</div>,
});

function PatternPage() {
  const { patternId } = Route.useParams();
  const pattern = PATTERNS_BY_ID[patternId]!;
  const topic = TOPICS_BY_ID[pattern.topicId];

  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const qc = useQueryClient();
  const fetchSolved = useServerFn(getSolved);
  const solvedQ = useQuery({
    queryKey: ["solved"],
    queryFn: () => fetchSolved(),
    enabled: signedIn,
  });
  const solvedSet = new Set((solvedQ.data ?? []).map((r) => r.slug));

  const toggle = useServerFn(toggleSolved);
  const mut = useMutation({
    mutationFn: (v: { slug: string; solved: boolean }) => toggle({ data: v }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ["solved"] });
      const prev = qc.getQueryData<Array<{ slug: string; solved_at: string; source: string }>>(["solved"]);
      qc.setQueryData(["solved"], (curr: typeof prev) => {
        const list = curr ?? [];
        if (v.solved) return [{ slug: v.slug, solved_at: new Date().toISOString(), source: "manual" }, ...list.filter((r) => r.slug !== v.slug)];
        return list.filter((r) => r.slug !== v.slug);
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["solved"], ctx.prev);
      toast.error("Couldn't update. Try again.");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["solved"] }),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/topics/$topicId" params={{ topicId: pattern.topicId }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {topic?.name}
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {pattern.name}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{pattern.logicType}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {pattern.companies.map((c) => (
            <span key={c} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted-foreground">{c}</span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard className="p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pattern logic</h2>
            <span className="text-[11px] text-muted-foreground">auto-laid-out</span>
          </div>
          <PatternFlow steps={pattern.flow} />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Video walkthrough</h2>
            <span className="text-[11px] text-muted-foreground">{CHANNEL_LABELS[pattern.youtube.channel]}</span>
          </div>
          <YouTubeEmbed yt={pattern.youtube} />
          <p className="mt-3 text-xs text-muted-foreground">
            Curated to the creator best known for this pattern. Plays inline — no redirect.
          </p>
        </GlassCard>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Practice problems</h2>
        <GlassCard className="divide-y divide-white/5">
          {pattern.problems.map((q) => {
            const solved = solvedSet.has(q.slug);
            return (
              <div key={q.slug} className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => {
                    if (!signedIn) { toast("Sign in to save your progress."); return; }
                    mut.mutate({ slug: q.slug, solved: !solved });
                  }}
                  className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                    solved
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_0_16px_-2px_oklch(0.78_0.16_200/0.7)]"
                      : "border-white/15 hover:border-primary/60"
                  }`}
                  aria-label={solved ? "Mark unsolved" : "Mark solved"}
                >
                  {solved && <Check className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${solved ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {q.title}
                    </span>
                    <DifficultyPill d={q.difficulty} />
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">{q.slug}</div>
                </div>
                <a
                  href={`https://leetcode.com/problems/${q.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  LeetCode <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </GlassCard>
        {!signedIn && (
          <p className="mt-3 text-xs text-muted-foreground">
            <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to save solved status and sync from your LeetCode profile.
          </p>
        )}
      </section>
    </main>
  );
}

function DifficultyPill({ d }: { d: "Easy" | "Medium" | "Hard" }) {
  const color =
    d === "Easy" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
    d === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
    "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${color}`}>{d}</span>;
}

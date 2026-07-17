import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TOPICS_BY_ID, PATTERNS_BY_ID } from "@/data/topics";
import { GlassCard } from "@/components/GlassCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/topics/$topicId")({
  head: ({ params }) => {
    const t = TOPICS_BY_ID[params.topicId];
    const title = t ? `${t.name} — DSA Mastery` : "Topic — DSA Mastery";
    const description = t?.blurb ?? "DSA topic";
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
    if (!TOPICS_BY_ID[params.topicId]) throw notFound();
    return null;
  },
  component: TopicPage,
  notFoundComponent: () => <div className="p-10 text-center">Topic not found.</div>,
});

function TopicPage() {
  const { topicId } = Route.useParams();
  const topic = TOPICS_BY_ID[topicId]!;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to topics
      </Link>
      <header className="mt-6 mb-8">
        <span className="text-4xl">{topic.emoji}</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{topic.name}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{topic.blurb}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {topic.patternIds.map((pid) => {
          const p = PATTERNS_BY_ID[pid];
          if (!p) return null;
          return (
            <Link key={p.id} to="/patterns/$patternId" params={{ patternId: p.id }} className="group">
              <GlassCard className="h-full p-5 transition group-hover:glow-ring">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.logicType}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.companies.slice(0, 4).map((c) => (
                    <span key={c} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">{c}</span>
                  ))}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground">
                  {p.problems.length} problems · Video: {p.youtube.title}
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

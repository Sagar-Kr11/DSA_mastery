import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, RotateCcw, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Drill, DrillLanguage, DrillSnippet } from "@/data/drills";
import { saveDrillAttempt } from "@/lib/drills.functions";

type Props = {
  patternId: string;
  drills: Drill[];
  signedIn: boolean;
};

const LANGS: DrillLanguage[] = ["C++", "Java", "Python"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function isCorrect(value: string, answer: string, accepts?: string[]) {
  const v = normalize(value);
  if (!v) return false;
  if (v === normalize(answer)) return true;
  return (accepts ?? []).some((a) => normalize(a) === v);
}

export function RecallDrill({ patternId, drills, signedIn }: Props) {
  const [drillIdx, setDrillIdx] = useState(0);
  const drill = drills[drillIdx] ?? drills[0];
  const available = drill.snippets.map((s) => s.language);
  const [lang, setLang] = useState<DrillLanguage>(available[0]);
  const snippet = useMemo<DrillSnippet>(
    () => drill.snippets.find((s) => s.language === lang) ?? drill.snippets[0],
    [drill, lang],
  );

  return (
    <div>
      {drills.length > 1 && (
        <div className="mb-3 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {drills.map((d, i) => {
            const active = i === drillIdx;
            return (
              <button
                key={d.id}
                onClick={() => setDrillIdx(i)}
                className={`shrink-0 rounded-md border px-2.5 py-1 text-[11px] transition ${
                  active
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20"
                }`}
                title={d.title}
              >
                {i + 1}. {d.title}
              </button>
            );
          })}
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] uppercase tracking-wider text-muted-foreground">Language</span>
        {LANGS.map((l) => {
          const disabled = !available.includes(l);
          const active = lang === l;
          return (
            <button
              key={l}
              disabled={disabled}
              onClick={() => setLang(l)}
              className={`rounded-md border px-2 py-0.5 text-[11px] transition ${
                active
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : disabled
                    ? "border-white/5 bg-white/[0.02] text-muted-foreground/40 cursor-not-allowed"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
      <SnippetRunner
        key={`${drill.id}-${lang}`}
        patternId={patternId}
        drillId={drill.id}
        snippet={snippet}
        signedIn={signedIn}
      />
    </div>
  );
}

function SnippetRunner({
  patternId,
  drillId,
  snippet,
  signedIn,
}: {
  patternId: string;
  drillId: string;
  snippet: DrillSnippet;
  signedIn: boolean;
}) {
  const parts = useMemo(() => splitTemplate(snippet.template), [snippet.template]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const qc = useQueryClient();
  const save = useServerFn(saveDrillAttempt);
  const mut = useMutation({
    mutationFn: (v: { correct: number; total: number }) =>
      save({ data: { patternId, drillId, language: snippet.language, correct: v.correct, total: v.total } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drill-progress"] }),
    onError: () => toast.error("Couldn't save your score."),
  });

  const total = snippet.blanks.length;
  const correctCount = snippet.blanks.reduce((n, blk) => {
    if (revealed[blk.id]) return n;
    return isCorrect(values[blk.id] ?? "", blk.answer, blk.accepts) ? n + 1 : n;
  }, 0);
  const allAttempted = snippet.blanks.every((blk) => (values[blk.id] ?? "").trim().length > 0 || revealed[blk.id]);

  function commit() {
    if (saved) return;
    if (!allAttempted) return;
    setSaved(true);
    if (signedIn) mut.mutate({ correct: correctCount, total });
  }

  function reset() {
    setValues({});
    setRevealed({});
    setSaved(false);
  }

  function revealAll() {
    const r: Record<string, boolean> = {};
    for (const blk of snippet.blanks) r[blk.id] = true;
    setRevealed(r);
    setSaved(true);
    if (signedIn) mut.mutate({ correct: correctCount, total });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-4">
      <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-foreground/90">
        {parts.map((part, i) => {
          if (part.kind === "text") return <span key={i}>{part.text}</span>;
          const blk = snippet.blanks.find((x) => x.id === part.id);
          if (!blk) return null;
          const val = values[blk.id] ?? "";
          const isRevealed = !!revealed[blk.id];
          const ok = !isRevealed && isCorrect(val, blk.answer, blk.accepts);
          const attempted = val.trim().length > 0;
          const wrong = attempted && !ok && !isRevealed;
          const ringColor = isRevealed
            ? "ring-amber-400/60 bg-amber-500/10 text-amber-200"
            : ok
              ? "ring-emerald-400/60 bg-emerald-500/10 text-emerald-200"
              : wrong
                ? "ring-rose-400/60 bg-rose-500/10 text-rose-200"
                : "ring-white/15 bg-white/5 text-foreground";
          const width = Math.max(blk.width ?? Math.max(3, blk.answer.length + 1), 3);
          return (
            <span key={i} className="inline-flex items-center align-baseline">
              <input
                aria-label={`blank ${blk.id}`}
                value={isRevealed ? blk.answer : val}
                readOnly={isRevealed}
                onChange={(e) => {
                  setSaved(false);
                  setValues((prev) => ({ ...prev, [blk.id]: e.target.value }));
                }}
                onBlur={() => {
                  if (allAttempted) commit();
                }}
                style={{ width: `${width}ch` }}
                className={`mx-0.5 rounded px-1 py-0.5 font-mono text-[12.5px] ring-1 outline-none focus:ring-2 focus:ring-primary/70 ${ringColor}`}
              />
              {ok && <Check className="ml-0.5 h-3 w-3 text-emerald-300" />}
            </span>
          );
        })}
      </pre>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs">
        <div className="text-muted-foreground">
          <span className="font-semibold text-foreground">{correctCount}</span> / {total} correct
          {saved && signedIn && <span className="ml-2 text-emerald-300">· saved</span>}
          {saved && !signedIn && <span className="ml-2 text-muted-foreground">· sign in to save</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={revealAll}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-muted-foreground hover:text-foreground"
          >
            <Eye className="h-3 w-3" /> Reveal all
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

type Part = { kind: "text"; text: string } | { kind: "blank"; id: string };

function splitTemplate(t: string): Part[] {
  const parts: Part[] = [];
  const re = /\{\{([a-zA-Z0-9_-]+)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t)) !== null) {
    if (m.index > last) parts.push({ kind: "text", text: t.slice(last, m.index) });
    parts.push({ kind: "blank", id: m[1] });
    last = m.index + m[0].length;
  }
  if (last < t.length) parts.push({ kind: "text", text: t.slice(last) });
  return parts;
}

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { listGscSites, queryGscAnalytics } from "@/lib/gsc.functions";

export const Route = createFileRoute("/_authenticated/seo")({
  head: () => ({
    meta: [
      { title: "SEO Analytics — DSA Mastery" },
      { name: "description", content: "Google Search Console analytics: clicks, impressions, CTR and top queries with trend charts." },
    ],
  }),
  component: SeoPage,
});

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function SeoPage() {
  const sitesFn = useServerFn(listGscSites);
  const queryFn = useServerFn(queryGscAnalytics);

  const [range, setRange] = useState<7 | 28 | 90>(28);
  const [siteUrl, setSiteUrl] = useState<string | null>(null);

  const sites = useQuery({
    queryKey: ["gsc-sites"],
    queryFn: () => sitesFn({}),
  });

  const activeSite = siteUrl ?? sites.data?.[0]?.siteUrl ?? null;
  const startDate = daysAgo(range);
  const endDate = daysAgo(1);

  const trend = useQuery({
    queryKey: ["gsc-trend", activeSite, range],
    enabled: !!activeSite,
    queryFn: () => queryFn({ data: { siteUrl: activeSite!, startDate, endDate, dimensions: ["date"], rowLimit: 1000 } }),
  });

  const queries = useQuery({
    queryKey: ["gsc-queries", activeSite, range],
    enabled: !!activeSite,
    queryFn: () => queryFn({ data: { siteUrl: activeSite!, startDate, endDate, dimensions: ["query"], rowLimit: 25 } }),
  });

  const pages = useQuery({
    queryKey: ["gsc-pages", activeSite, range],
    enabled: !!activeSite,
    queryFn: () => queryFn({ data: { siteUrl: activeSite!, startDate, endDate, dimensions: ["page"], rowLimit: 15 } }),
  });

  const totals = useMemo(() => {
    const rows = trend.data ?? [];
    const clicks = rows.reduce((s, r) => s + r.clicks, 0);
    const impressions = rows.reduce((s, r) => s + r.impressions, 0);
    const ctr = impressions ? clicks / impressions : 0;
    const position = rows.length ? rows.reduce((s, r) => s + r.position, 0) / rows.length : 0;
    return { clicks, impressions, ctr, position };
  }, [trend.data]);

  const chartData = (trend.data ?? []).map((r) => ({
    date: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: +(r.ctr * 100).toFixed(2),
    position: +r.position.toFixed(2),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Google Search Console — clicks, impressions, CTR and top queries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sites.data && sites.data.length > 1 && (
            <select
              value={activeSite ?? ""}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm"
            >
              {sites.data.map((s) => (
                <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>
              ))}
            </select>
          )}
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 text-xs">
            {([7, 28, 90] as const).map((n) => (
              <button
                key={n}
                onClick={() => setRange(n)}
                className={`rounded-md px-3 py-1 transition ${range === n ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {sites.isLoading && <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">Loading properties…</div>}
      {sites.error && <ErrorBox error={sites.error as Error} />}
      {sites.data && sites.data.length === 0 && (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
          No verified Search Console properties on the connected account.
        </div>
      )}

      {activeSite && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Clicks" value={totals.clicks.toLocaleString()} />
            <Stat label="Impressions" value={totals.impressions.toLocaleString()} />
            <Stat label="CTR" value={`${(totals.ctr * 100).toFixed(2)}%`} />
            <Stat label="Avg. position" value={totals.position.toFixed(2)} />
          </div>

          {trend.error && <ErrorBox error={trend.error as Error} />}

          <Section title="Clicks & impressions">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ background: "#0b0b12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="CTR & avg. position">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} unit="%" />
                  <YAxis yAxisId="right" orientation="right" reversed tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ background: "#0b0b12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ctr" name="CTR %" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="position" name="Avg. position" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Top queries">
              <Table
                loading={queries.isLoading}
                error={queries.error as Error | null}
                rows={(queries.data ?? []).map((r) => ({
                  key: r.keys[0],
                  clicks: r.clicks,
                  impressions: r.impressions,
                  ctr: `${(r.ctr * 100).toFixed(1)}%`,
                  position: r.position.toFixed(1),
                }))}
                keyLabel="Query"
              />
            </Section>
            <Section title="Top pages">
              <Table
                loading={pages.isLoading}
                error={pages.error as Error | null}
                rows={(pages.data ?? []).map((r) => ({
                  key: r.keys[0].replace(/^https?:\/\/[^/]+/, ""),
                  clicks: r.clicks,
                  impressions: r.impressions,
                  ctr: `${(r.ctr * 100).toFixed(1)}%`,
                  position: r.position.toFixed(1),
                }))}
                keyLabel="Page"
              />
            </Section>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass mt-4 rounded-2xl p-5">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function ErrorBox({ error }: { error: Error }) {
  return (
    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
      {error.message}
    </div>
  );
}

function Table({
  rows,
  keyLabel,
  loading,
  error,
}: {
  rows: Array<{ key: string; clicks: number; impressions: number; ctr: string; position: string }>;
  keyLabel: string;
  loading: boolean;
  error: Error | null;
}) {
  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (error) return <ErrorBox error={error} />;
  if (!rows.length) return <div className="text-sm text-muted-foreground">No data.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="py-2 text-left font-normal">{keyLabel}</th>
            <th className="py-2 text-right font-normal">Clicks</th>
            <th className="py-2 text-right font-normal">Impr.</th>
            <th className="py-2 text-right font-normal">CTR</th>
            <th className="py-2 text-right font-normal">Pos.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-t border-white/5">
              <td className="max-w-[240px] truncate py-2 pr-3">{r.key}</td>
              <td className="py-2 text-right tabular-nums">{r.clicks}</td>
              <td className="py-2 text-right tabular-nums">{r.impressions}</td>
              <td className="py-2 text-right tabular-nums">{r.ctr}</td>
              <td className="py-2 text-right tabular-nums">{r.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

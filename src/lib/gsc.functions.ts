import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

function headers() {
  const lovable = process.env.LOVABLE_API_KEY;
  const gsc = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovable || !gsc) throw new Error("Google Search Console is not connected.");
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": gsc,
    "Content-Type": "application/json",
  };
}

async function gscFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${GATEWAY}${path}`, { ...init, headers: { ...headers(), ...(init?.headers as any) } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GSC ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

export const listGscSites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const data = await gscFetch("/webmasters/v3/sites");
    const entries: Array<{ siteUrl: string; permissionLevel: string }> = data.siteEntry ?? [];
    return entries.map((e) => ({ siteUrl: e.siteUrl, permissionLevel: e.permissionLevel }));
  });

type QueryInput = {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions: Array<"date" | "query" | "page" | "country" | "device">;
  rowLimit?: number;
};

export const queryGscAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: QueryInput) => d)
  .handler(async ({ data }) => {
    const encoded = encodeURIComponent(data.siteUrl);
    const body = {
      startDate: data.startDate,
      endDate: data.endDate,
      dimensions: data.dimensions,
      rowLimit: data.rowLimit ?? 1000,
    };
    const res = await gscFetch(`/webmasters/v3/sites/${encoded}/searchAnalytics/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const rows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> =
      res.rows ?? [];
    return rows.map((r) => ({
      keys: r.keys,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));
  });

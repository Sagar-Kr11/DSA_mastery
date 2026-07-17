import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Pulls the user's recent accepted submissions from LeetCode's public GraphQL
 * endpoint. Only visible if the profile's submissions are public.
 */
export const syncLeetCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profile, error: pErr } = await context.supabase
      .from("profiles")
      .select("leetcode_username")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    const username = profile?.leetcode_username;
    if (!username) return { synced: 0, reason: "no-username" as const };

    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          titleSlug
          timestamp
        }
      }
    `;

    let resp: Response;
    try {
      resp = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "user-agent": "Mozilla/5.0 (compatible; DSAMastery/1.0)",
          referer: `https://leetcode.com/${encodeURIComponent(username)}/`,
        },
        body: JSON.stringify({ query, variables: { username, limit: 50 } }),
      });
    } catch (e) {
      return { synced: 0, reason: "network-error" as const };
    }

    if (!resp.ok) return { synced: 0, reason: "leetcode-error" as const, status: resp.status };
    const json = (await resp.json()) as {
      data?: { recentAcSubmissionList?: Array<{ titleSlug: string; timestamp: string }> | null };
    };
    const list = json.data?.recentAcSubmissionList ?? [];
    if (!list.length) return { synced: 0, reason: "empty" as const };

    // Upsert each. We only overwrite when the row is missing or was previously auto-synced.
    const rows = list.map((s) => ({
      user_id: context.userId,
      slug: s.titleSlug,
      source: "leetcode" as const,
      solved_at: new Date(Number(s.timestamp) * 1000).toISOString(),
    }));

    // Don't overwrite manual entries: fetch existing first
    const slugs = rows.map((r) => r.slug);
    const { data: existing } = await context.supabase
      .from("solved_problems")
      .select("slug, source")
      .in("slug", slugs);
    const manualSet = new Set((existing ?? []).filter((r) => r.source === "manual").map((r) => r.slug));
    const toWrite = rows.filter((r) => !manualSet.has(r.slug));
    if (toWrite.length === 0) return { synced: 0, reason: "all-manual" as const };

    const { error } = await context.supabase.from("solved_problems").upsert(toWrite);
    if (error) throw new Error(error.message);
    return { synced: toWrite.length, reason: "ok" as const };
  });

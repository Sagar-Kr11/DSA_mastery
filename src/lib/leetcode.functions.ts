import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type SyncResult =
  | { synced: number; reason: "ok"; totalSolved: number | null; username: string }
  | { synced: number; reason: "empty"; totalSolved: number | null; username: string }
  | { synced: 0; reason: "no-username"; totalSolved: null; username: null }
  | { synced: 0; reason: "leetcode-error"; status: number; totalSolved: null; username: string }
  | { synced: 0; reason: "network-error"; totalSolved: null; username: string }
  | { synced: 0; reason: "user-not-found"; totalSolved: null; username: string };

/**
 * Pulls the user's recent accepted submissions and lifetime solved count
 * from LeetCode's public GraphQL endpoint. Recent submissions are only
 * visible if the profile toggle "Show recent AC submissions" is on.
 */
export const syncLeetCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SyncResult> => {
    const { data: profile, error: pErr } = await context.supabase
      .from("profiles")
      .select("leetcode_username")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    const username = profile?.leetcode_username;
    if (!username) return { synced: 0, reason: "no-username", totalSolved: null, username: null };

    const query = `
      query userData($username: String!, $limit: Int!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum { difficulty count }
          }
        }
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
    } catch {
      return { synced: 0, reason: "network-error", totalSolved: null, username };
    }

    if (!resp.ok) return { synced: 0, reason: "leetcode-error", status: resp.status, totalSolved: null, username };
    const json = (await resp.json()) as {
      data?: {
        matchedUser?: {
          username: string;
          submitStats?: { acSubmissionNum?: Array<{ difficulty: string; count: number }> };
        } | null;
        recentAcSubmissionList?: Array<{ titleSlug: string; timestamp: string }> | null;
      };
    };

    if (!json.data?.matchedUser) {
      return { synced: 0, reason: "user-not-found", totalSolved: null, username };
    }

    const totalRow = json.data.matchedUser.submitStats?.acSubmissionNum?.find((r) => r.difficulty === "All");
    const totalSolved = totalRow ? totalRow.count : null;

    const list = json.data.recentAcSubmissionList ?? [];
    if (!list.length) return { synced: 0, reason: "empty", totalSolved, username };

    const rows = list.map((s) => ({
      user_id: context.userId,
      slug: s.titleSlug,
      source: "leetcode" as const,
      solved_at: new Date(Number(s.timestamp) * 1000).toISOString(),
    }));

    // Preserve manual entries: skip slugs the user marked manually.
    const slugs = rows.map((r) => r.slug);
    const { data: existing } = await context.supabase
      .from("solved_problems")
      .select("slug, source")
      .in("slug", slugs);
    const manualSet = new Set((existing ?? []).filter((r) => r.source === "manual").map((r) => r.slug));
    const toWrite = rows.filter((r) => !manualSet.has(r.slug));
    if (toWrite.length === 0) return { synced: 0, reason: "ok", totalSolved, username };

    const { error } = await context.supabase.from("solved_problems").upsert(toWrite);
    if (error) throw new Error(error.message);
    return { synced: toWrite.length, reason: "ok", totalSolved, username };
  });

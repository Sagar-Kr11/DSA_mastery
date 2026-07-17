import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getSolved = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("solved_problems")
      .select("slug, solved_at, source")
      .order("solved_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const toggleSolved = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ slug: z.string().min(1), solved: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    if (data.solved) {
      const { error } = await context.supabase
        .from("solved_problems")
        .upsert({ user_id: context.userId, slug: data.slug, source: "manual", solved_at: new Date().toISOString() });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("solved_problems")
        .delete()
        .eq("slug", data.slug);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("leetcode_username")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { leetcode_username: data?.leetcode_username ?? null };
  });

export const setLeetcodeUsername = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ username: z.string().trim().max(64) }).parse(input))
  .handler(async ({ data, context }) => {
    const value = data.username || null;
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ user_id: context.userId, leetcode_username: value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

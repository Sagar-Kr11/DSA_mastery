import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDrillProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("pattern_drill_attempts")
      .select("pattern_id, drill_id, language, correct, total, completed_at");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveDrillAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        patternId: z.string().min(1).max(64),
        drillId: z.string().min(1).max(64),
        language: z.enum(["C++", "Java", "Python"]),
        correct: z.number().int().min(0).max(20),
        total: z.number().int().min(1).max(20),
      })
      .refine((v) => v.correct <= v.total, "correct must be <= total")
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("pattern_drill_attempts").upsert({
      user_id: context.userId,
      pattern_id: data.patternId,
      drill_id: data.drillId,
      language: data.language,
      correct: data.correct,
      total: data.total,
      completed_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

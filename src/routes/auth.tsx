import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/GlassCard";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — DSA Mastery" }, { name: "description", content: "Sign in to save streaks and sync LeetCode." }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        nav({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md items-center justify-center px-4 py-10">
      <GlassCard className="w-full p-6" glow>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "signin" ? "Sync streaks & LeetCode progress across devices." : "One account — everything follows you."}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Input type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" required />
          <Input type="password" value={password} onChange={setPassword} placeholder="Password (min 6 chars)" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} required />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>New here? <button className="text-primary hover:underline" onClick={() => setMode("signup")}>Create an account</button></>
          ) : (
            <>Have an account? <button className="text-primary hover:underline" onClick={() => setMode("signin")}>Sign in</button></>
          )}
        </div>
        <div className="mt-6 border-t border-white/5 pt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Continue without signing in</Link>
        </div>
      </GlassCard>
    </main>
  );
}

function Input({ type, value, onChange, placeholder, autoComplete, required, minLength }: {
  type: string; value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string; required?: boolean; minLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      minLength={minLength}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
    />
  );
}

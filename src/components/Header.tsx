import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Flame } from "lucide-react";

export function Header() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold shadow-lg shadow-primary/30">D</span>
          <span className="text-sm font-semibold tracking-tight">
            DSA <span className="text-glow text-primary">Mastery</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/">Topics</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
          {session ? (
            <NavLink to="/settings">Settings</NavLink>
          ) : (
            <Link
              to="/auth"
              className="ml-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
            >
              Sign in
            </Link>
          )}
          {session && (
            <span className="ml-2 hidden items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted-foreground sm:inline-flex">
              <Flame className="h-3 w-3 text-primary" />
              synced
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "text-foreground bg-white/5" }}
      inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-white/5" }}
      className="rounded-lg px-3 py-1.5 text-sm transition"
    >
      {children}
    </Link>
  );
}

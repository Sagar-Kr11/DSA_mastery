import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getProfile, setLeetcodeUsername } from "@/lib/solved.functions";
import { syncLeetCode } from "@/lib/leetcode.functions";
import { GlassCard } from "@/components/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => {
    const title = "Settings — LeetCode sync & account | DSA Mastery";
    const description = "Manage your DSA Mastery account: set your LeetCode username, trigger a fresh solved-problems sync, and sign out securely from any device.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SettingsPage,
});

function SettingsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getProfile);
  const saveUser = useServerFn(setLeetcodeUsername);
  const sync = useServerFn(syncLeetCode);

  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (profileQ.data?.leetcode_username) {
      setUsername(profileQ.data.leetcode_username);
    }
  }, [profileQ.data]);

  const saveMut = useMutation({
    mutationFn: (u: string) => saveUser({ data: { username: u } }),
    onSuccess: () => {
      toast.success("Saved.");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const syncMut = useMutation({
    mutationFn: () => sync(),
    onSuccess: (res) => {
      if (res.reason === "ok") toast.success(`Synced ${res.synced} solved problems.`);
      else if (res.reason === "empty") toast("No recent public submissions found.");
      else if (res.reason === "no-username") toast.error("Set your LeetCode username first.");
      else if (res.reason === "leetcode-error") toast.error(`LeetCode returned ${res.status}. Are your submissions public?`);
      else toast(`Sync: ${res.reason}`);
      qc.invalidateQueries({ queryKey: ["solved"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Sync failed"),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your LeetCode sync and account.</p>

      <GlassCard className="mt-6 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">LeetCode profile</h2>
        <label className="mt-3 block text-xs text-muted-foreground">Username</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-leetcode-username"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => saveMut.mutate(username.trim())}
            disabled={saveMut.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            Save
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Only public submissions can be synced. Set your LeetCode submissions to public for auto-sync.
        </p>
        <button
          onClick={() => syncMut.mutate()}
          disabled={syncMut.isPending || !username.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${syncMut.isPending ? "animate-spin" : ""}`} />
          Sync solved from LeetCode
        </button>
      </GlassCard>

      <GlassCard className="mt-4 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account</h2>
        <button
          onClick={signOut}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </GlassCard>
    </main>
  );
}

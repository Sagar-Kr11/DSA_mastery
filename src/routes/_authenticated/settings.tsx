import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { getProfile, setLeetcodeUsername } from "@/lib/solved.functions";
import { syncLeetCode } from "@/lib/leetcode.functions";
import { GlassCard } from "@/components/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, LogOut, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

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

type SyncRes = Awaited<ReturnType<typeof syncLeetCode>>;

function SettingsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getProfile);
  const saveUser = useServerFn(setLeetcodeUsername);
  const sync = useServerFn(syncLeetCode);

  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const [username, setUsername] = useState("");
  const [lastResult, setLastResult] = useState<SyncRes | null>(null);

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
      setLastResult(res);
      if (res.reason === "ok" && res.synced > 0) toast.success(`Synced ${res.synced} solved problems.`);
      else if (res.reason === "ok") toast("Already up to date.");
      else if (res.reason === "empty") toast("LeetCode returned 0 recent submissions.");
      else if (res.reason === "no-username") toast.error("Set your LeetCode username first.");
      else if (res.reason === "user-not-found") toast.error("LeetCode user not found.");
      else if (res.reason === "leetcode-error") toast.error(`LeetCode returned ${res.status}.`);
      else toast(`Sync: ${res.reason}`);
      qc.invalidateQueries({ queryKey: ["solved"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Sync failed"),
  });

  // Auto-sync once per session when a username exists.
  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current) return;
    if (!profileQ.data?.leetcode_username) return;
    autoRan.current = true;
    syncMut.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQ.data?.leetcode_username]);

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
          {syncMut.isPending ? "Syncing…" : "Sync solved from LeetCode"}
        </button>

        {lastResult && <SyncDiagnostic res={lastResult} />}
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

function SyncDiagnostic({ res }: { res: SyncRes }) {
  const ok = res.reason === "ok";
  const emptyButFound = res.reason === "empty";
  const profileUrl = res.username ? `https://leetcode.com/${encodeURIComponent(res.username)}/` : null;

  if (ok) {
    return (
      <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
        <div className="flex items-center gap-2 font-medium text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Connected to LeetCode
        </div>
        <p className="mt-1 text-xs text-emerald-200/80">
          {res.synced > 0 ? `Imported ${res.synced} new solves.` : "No new solves since last sync."}
          {res.totalSolved != null && <> LeetCode reports <b>{res.totalSolved}</b> total accepted.</>}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
      <div className="flex items-center gap-2 font-medium text-amber-300">
        <AlertTriangle className="h-4 w-4" /> Couldn't map individual problems
      </div>
      <p className="mt-1 text-xs text-amber-200/90">
        {res.reason === "empty" && (
          <>
            LeetCode returned <b>0</b> recent submissions for <code className="font-mono">{res.username}</code>.
            {res.totalSolved != null && <> But it does report <b>{res.totalSolved}</b> lifetime accepted, so the account is reachable.</>}
          </>
        )}
        {res.reason === "user-not-found" && <>No LeetCode user named <code className="font-mono">{res.username}</code>. Double-check the handle.</>}
        {res.reason === "leetcode-error" && <>LeetCode responded with status {res.status}. Try again in a minute.</>}
        {res.reason === "network-error" && <>Network error reaching leetcode.com.</>}
        {res.reason === "no-username" && <>Set your LeetCode username above first.</>}
      </p>
      {emptyButFound && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-amber-100/90">
          <li>Open your LeetCode profile settings.</li>
          <li>Turn ON <b>"Show recent AC submissions"</b> under Privacy.</li>
          <li>Verify your public profile lists recent solves, then hit Sync again.</li>
        </ol>
      )}
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <a href="https://leetcode.com/profile/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-200 hover:underline">
          LeetCode profile settings <ExternalLink className="h-3 w-3" />
        </a>
        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-200 hover:underline">
            View public profile <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

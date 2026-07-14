import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMyReferral } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/ui-shell/AppShell";
import { Copy, Check, LogOut, Crown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Mon compte — Mélodia" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchRef = useServerFn(getMyReferral);
  const { data: referral, isLoading } = useQuery({ queryKey: ["my-referral"], queryFn: () => fetchRef() });
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const link =
    typeof window !== "undefined" && referral ? `${window.location.origin}/?ref=${referral.code}` : "";

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <AppShell>
      <section className="max-w-xl mx-auto px-4 pt-4 pb-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-amber-700 grid place-items-center text-lg font-semibold text-black">
            {(email[0] ?? "M").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-base font-medium truncate">{email || "Mon compte"}</p>
            <p className="text-xs text-zinc-500">Compte Mélodia</p>
          </div>
        </div>

        {/* Abonnement */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-950/40 to-[#111010] ring-1 ring-amber-500/20 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-accent" />
            <p className="text-sm font-medium">Signature</p>
          </div>
          <p className="text-[13px] text-zinc-400 mb-4">6 générations · Voix pro · File prioritaire</p>
          <Link
            to="/"
            className="inline-block text-xs font-medium px-4 py-2 rounded-full bg-accent text-accent-foreground"
          >
            Passer à Légende
          </Link>
        </div>

        {/* Parrainage */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 px-1">Parrainage</p>
          <div className="rounded-2xl bg-white/[0.02] ring-1 ring-white/5 p-5">
            {isLoading && <p className="text-sm text-zinc-500">Chargement…</p>}
            {referral && (
              <>
                <p className="text-xs text-zinc-500 mb-1">Ton code</p>
                <p className="text-2xl font-medium tracking-widest text-accent mb-4">{referral.code}</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={link}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] ring-1 ring-white/5 text-xs text-zinc-400"
                  />
                  <button
                    onClick={copy}
                    className="px-3 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-medium flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copié" : "Copier"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[10px] text-zinc-500 uppercase">Utilisations</p>
                    <p className="text-lg font-medium mt-0.5">{referral.uses}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[10px] text-zinc-500 uppercase">Crédits</p>
                    <p className="text-lg font-medium mt-0.5">
                      {referral.credits_fcfa.toLocaleString("fr-FR")}{" "}
                      <span className="text-[10px] text-zinc-500">FCFA</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/5 text-sm text-zinc-300 hover:text-zinc-100"
        >
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      </section>
    </AppShell>
  );
}

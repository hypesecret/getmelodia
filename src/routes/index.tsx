import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/ui-shell/AppShell";
import { MagicInput } from "@/components/ui-shell/MagicInput";
import { Heart, MessageCircle, CreditCard, Sparkles, Download, Share2, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mélodia — Ta chanson, créée en la décrivant" },
      {
        name: "description",
        content:
          "Décris ta chanson, l'IA la compose paroles + musique. Rumba, Afrobeat, Gospel — livrée en minutes, à partir de 2 500 FCFA.",
      },
      { property: "og:title", content: "Mélodia — Ta chanson, créée en la décrivant" },
      { property: "og:description", content: "Décris ta chanson, l'IA la compose paroles + musique. Rumba, Afrobeat, Gospel — livrée en minutes, à partir de 2 500 FCFA." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const SUGGESTIONS = ["Papa", "Maman", "Anniversaire", "Mariage", "Amie", "Enfant"];

const STEPS = [
  { n: 1, icon: MessageCircle, title: "Décris", desc: "Parle ou tape ton idée en quelques mots." },
  { n: 2, icon: CreditCard, title: "Paiement", desc: "Choisis ton moyen de paiement rapide et sécurisé." },
  { n: 3, icon: Sparkles, title: "Génération IA", desc: "Notre IA écrit, compose et produit ta chanson." },
  { n: 4, icon: Download, title: "Livraison", desc: "Reçois ta chanson prête et télécharge-la." },
  { n: 5, icon: Share2, title: "Partage", desc: "Partage-la avec ceux que tu aimes." },
  { n: 6, icon: RefreshCcw, title: "Revient", desc: "Crée encore et revis l'émotion à l'infini." },
];

function Index() {
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AppShell
      right={
        <Link
          to={signedIn ? "/library" : "/auth"}
          className="text-xs font-medium px-3.5 py-1.5 rounded-full ring-1 ring-white/10 text-zinc-200"
        >
          {signedIn ? "Mes chansons" : "Connexion"}
        </Link>
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 ring-1 ring-accent/20 mb-6">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-accent">Fait au Congo</span>
          </div>

          <h1 className="text-[36px] leading-[1.05] md:text-5xl font-medium tracking-tight text-balance mb-3 max-w-[18ch]">
            Ta chanson,<br />
            <span className="text-accent">créée en la décrivant.</span>
          </h1>

          <p className="text-[14px] text-zinc-400 text-pretty mb-8 max-w-[36ch]">
            Parle ou tape librement. L'IA compose paroles + musique en quelques minutes.
          </p>

          <MagicInput autoFocus={false} />

          <div className="mt-6 w-full">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Occasions populaires</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    navigate({
                      to: "/create",
                      search: { q: `Une chanson pour ${s.toLowerCase()}, ` },
                    })
                  }
                  className="text-[12px] px-3 py-1.5 rounded-full bg-white/[0.03] ring-1 ring-white/5 text-zinc-300 hover:ring-accent/30 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 mt-6">À partir de 2 500 FCFA · Mobile Money</p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="relative rounded-3xl bg-[#111010] ring-1 ring-white/5 p-6 md:p-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-white/10" />
            <h2 className="text-accent text-[11px] font-semibold uppercase tracking-[0.25em]">
              Comment ça marche&nbsp;?
            </h2>
            <span className="h-px w-8 bg-white/10" />
          </div>

          <ol className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.n} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 ring-1 ring-accent/20 grid place-items-center mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-[13px] font-medium text-zinc-100 mb-1">
                    {s.n}. {s.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-snug max-w-[18ch]">{s.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Footer bandeau */}
      <footer className="max-w-5xl mx-auto px-4 pb-10">
        <div className="rounded-3xl bg-[#111010] ring-1 ring-white/5 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <div>
              <p className="text-[13px] text-zinc-100 font-medium">Des chansons uniques, faites pour toucher les cœurs.</p>
              <p className="text-[11px] text-zinc-500">À partir de 2 500 FCFA avec Mobile Money.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-zinc-300">
            Fait au Congo avec <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span className="font-semibold tracking-tight ml-1">
              Mélodia<span className="text-accent">.</span>
            </span>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-4">© 2026 Mélodia — Chansons personnalisées</p>
      </footer>
    </AppShell>
  );
}

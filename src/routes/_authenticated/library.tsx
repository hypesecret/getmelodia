import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listMySongs } from "@/lib/orders.functions";
import { AppShell } from "@/components/ui-shell/AppShell";
import { Search, Plus, Play, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({ meta: [{ title: "Mes chansons — Mélodia" }, { name: "robots", content: "noindex" }] }),
  component: LibraryPage,
});

const FILTERS = ["Toutes", "En cours", "Terminées", "Favoris"] as const;

function LibraryPage() {
  const fetchSongs = useServerFn(listMySongs);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Toutes");
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-songs"],
    queryFn: () => fetchSongs(),
    refetchInterval: (query) => {
      const rows = query.state.data as Array<{ status: string }> | undefined;
      return rows?.some((s) => s.status !== "ready" && s.status !== "failed") ? 5000 : false;
    },
  });

  const filtered = (data ?? [])
    .filter((s) => {
      if (filter === "Terminées") return s.status === "ready";
      if (filter === "En cours") return s.status !== "ready" && s.status !== "failed";
      if (filter === "Favoris") return false; // TODO favorites
      return true;
    })
    .filter((s) => {
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (s.title ?? "").toLowerCase().includes(needle) || (s.style ?? "").toLowerCase().includes(needle);
    });

  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-4 pt-4 pb-8">
        <div className="flex items-end justify-between mb-4">
          <h1 className="text-2xl font-medium tracking-tight">Mes chansons</h1>
          <Link
            to="/create"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Nouvelle
          </Link>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.04] ring-1 ring-white/5 mb-4">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un titre, un style…"
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[12px] px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                filter === f
                  ? "bg-white text-black font-medium"
                  : "bg-white/[0.04] text-zinc-400 ring-1 ring-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-zinc-500 text-center py-10">Chargement…</p>}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent ring-1 ring-white/5 p-10 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-accent/10 grid place-items-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm text-zinc-200 mb-1">Aucune chanson pour l'instant</p>
            <p className="text-xs text-zinc-500 mb-4">Décris ta chanson à l'IA et laisse la magie opérer.</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Créer ma première chanson
            </Link>
          </div>
        )}

        <ul className="space-y-2">
          {filtered.map((s) => (
            <li key={s.id}>
              <Link
                to="/song/$songId"
                params={{ songId: s.id }}
                className="flex items-center gap-3 p-2 pr-3 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 hover:ring-accent/30 transition"
              >
                <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden">
                  {s.cover_url ? (
                    <img src={s.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/30 to-zinc-900 grid place-items-center text-2xl">🎵</div>
                  )}
                  {s.status === "ready" && (
                    <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 hover:opacity-100 transition">
                      <Play className="w-4 h-4 text-white" fill="white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{s.title ?? "Sans titre"}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{s.style ?? "—"}</p>
                </div>
                <StatusChip status={s.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ready: { label: "Prête", cls: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30" },
    failed: { label: "Échec", cls: "bg-red-400/15 text-red-300 ring-red-400/30" },
    lyrics_ready: { label: "Musique…", cls: "bg-amber-400/15 text-amber-300 ring-amber-400/30" },
    generating: { label: "En cours", cls: "bg-amber-400/15 text-amber-300 ring-amber-400/30" },
    pending: { label: "Brouillon", cls: "bg-zinc-400/15 text-zinc-300 ring-zinc-400/20" },
  };
  const s = map[status] ?? map.pending;
  return <span className={`text-[10px] font-medium px-2 py-1 rounded-full ring-1 ${s.cls}`}>{s.label}</span>;
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMySong } from "@/lib/orders.functions";
import { AppShell } from "@/components/ui-shell/AppShell";
import { Download, Share2, Plus, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/song/$songId")({
  head: () => ({ meta: [{ title: "Ta chanson — Mélodia" }, { name: "robots", content: "noindex" }] }),
  component: SongPage,
});

function SongPage() {
  const { songId } = Route.useParams();
  const navigate = useNavigate();
  const fetchSong = useServerFn(getMySong);
  const [tab, setTab] = useState<"lyrics" | "details">("lyrics");

  const { data, isLoading } = useQuery({
    queryKey: ["song", songId],
    queryFn: () => fetchSong({ data: { songId } }),
    refetchInterval: (q) => {
      const song = q.state.data as { status?: string } | undefined;
      return song?.status && song.status !== "ready" && song.status !== "failed" ? 4000 : false;
    },
  });

  const notReady = !!data && data.status !== "ready" && data.status !== "failed";
  useEffect(() => {
    if (notReady) navigate({ to: "/generate/$songId", params: { songId }, replace: true });
  }, [notReady, navigate, songId]);

  if (isLoading) {
    return (
      <AppShell>
        <p className="text-center text-zinc-500 py-20 text-sm">Chargement…</p>
      </AppShell>
    );
  }
  if (!data) {
    return (
      <AppShell>
        <p className="text-center text-zinc-500 py-20 text-sm">Chanson introuvable.</p>
      </AppShell>
    );
  }

  const shareText = `Écoute la chanson que j'ai créée sur Mélodia : ${data.title ?? ""}`;
  const shareUrl = data.audio_url ?? "";

  return (
    <AppShell topBar={false}>
      <div className="max-w-2xl mx-auto pb-6">
        {/* Top back */}
        <div className="flex items-center justify-between px-4 pt-4">
          <Link
            to="/library"
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100"
          >
            <ChevronLeft className="w-4 h-4" /> Mes chansons
          </Link>
        </div>

        {/* Cover */}
        <div className="px-4 mt-4">
          <div className="aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            {data.cover_url ? (
              <img src={data.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/40 via-amber-900/30 to-zinc-950 grid place-items-center text-7xl">
                🎵
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center px-6 mt-6">
          <h1 className="text-2xl font-medium tracking-tight text-balance">{data.title ?? "Sans titre"}</h1>
          <p className="text-xs text-zinc-500 mt-1">{data.style ?? "—"}</p>
        </div>

        {/* Player */}
        <div className="px-4 mt-6">
          {data.audio_url ? (
            <audio controls src={data.audio_url} className="w-full" />
          ) : (
            <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/5 p-4 text-center text-sm text-zinc-400">
              {data.status === "failed" ? "La génération a échoué. Contactez le support." : "En attente d'audio…"}
            </div>
          )}
        </div>

        {/* Actions */}
        {data.audio_url && (
          <div className="grid grid-cols-3 gap-2 px-4 mt-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-300 text-[11px] font-medium"
            >
              <Share2 className="w-4 h-4" /> WhatsApp
            </a>
            <a
              href={data.audio_url}
              download
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-accent text-accent-foreground text-[11px] font-medium"
            >
              <Download className="w-4 h-4" /> Télécharger
            </a>
            <Link
              to="/create"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-white/[0.04] ring-1 ring-white/5 text-zinc-200 text-[11px] font-medium"
            >
              <Plus className="w-4 h-4" /> Variante
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 px-4">
          <div className="flex gap-1 p-1 rounded-full bg-white/[0.03] ring-1 ring-white/5 w-fit mx-auto">
            {(["lyrics", "details"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  tab === t ? "bg-white text-black" : "text-zinc-400"
                }`}
              >
                {t === "lyrics" ? "Paroles" : "Détails"}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === "lyrics" && data.lyrics && (
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed bg-white/[0.02] ring-1 ring-white/5 rounded-2xl p-5 font-sans">
                {data.lyrics}
              </pre>
            )}
            {tab === "details" && (
              <dl className="rounded-2xl bg-white/[0.02] ring-1 ring-white/5 divide-y divide-white/5 text-sm">
                <Row label="Style" value={data.style ?? "—"} />
                <Row label="Langue" value={data.language ?? "—"} />
                <Row label="Statut" value={data.status} />
              </dl>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-zinc-200">{value}</dd>
    </div>
  );
}

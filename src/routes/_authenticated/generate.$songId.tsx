import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMySong } from "@/lib/orders.functions";
import { AppShell } from "@/components/ui-shell/AppShell";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/generate/$songId")({
  head: () => ({ meta: [{ title: "Composition en cours — Mélodia" }, { name: "robots", content: "noindex" }] }),
  component: GeneratePage,
});

const STAGES = [
  { key: "analyse", label: "Analyse de ton histoire" },
  { key: "ghostwriter", label: "Écriture des paroles" },
  { key: "composition", label: "Composition musicale" },
  { key: "voix", label: "Voix & interprétation" },
  { key: "mix", label: "Mix & mastering" },
] as const;

// Map DB status → currentStage index
function statusToStage(status: string | undefined): number {
  switch (status) {
    case "pending":
      return 0;
    case "lyrics_ready":
      return 2;
    case "generating":
      return 3;
    case "ready":
      return STAGES.length;
    case "failed":
      return -1;
    default:
      return 1;
  }
}

function GeneratePage() {
  const { songId } = Route.useParams();
  const navigate = useNavigate();
  const fetchSong = useServerFn(getMySong);
  const [minStage, setMinStage] = useState(0);

  const { data } = useQuery({
    queryKey: ["song", songId],
    queryFn: () => fetchSong({ data: { songId } }),
    refetchInterval: (q) => {
      const song = q.state.data as { status?: string } | undefined;
      return song?.status && song.status !== "ready" && song.status !== "failed" ? 3000 : false;
    },
  });

  // Slow visual progression so stages animate even if backend jumps directly
  useEffect(() => {
    const tick = setInterval(() => {
      setMinStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 4000);
    return () => clearInterval(tick);
  }, []);

  const backendStage = statusToStage(data?.status);
  const currentStage = Math.max(minStage, backendStage);
  const failed = data?.status === "failed";
  const ready = data?.status === "ready";

  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => navigate({ to: "/song/$songId", params: { songId }, replace: true }), 800);
      return () => clearTimeout(t);
    }
  }, [ready, navigate, songId]);

  return (
    <AppShell topBar={false} withBottomNav={false}>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="relative w-32 h-32 mb-10">
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
          <div className="absolute inset-3 rounded-full bg-accent/10 animate-pulse" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-amber-700 grid place-items-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-black" fill="currentColor">
                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-medium tracking-tight mb-2">L'IA compose ta chanson</h1>
        <p className="text-sm text-zinc-400 mb-10 max-w-sm">
          {failed
            ? "Une erreur est survenue. Ta chanson n'a pas pu être générée."
            : ready
            ? "C'est prêt !"
            : "Ça prend en général 1 à 3 minutes. Tu peux fermer cet écran, on te préviendra."}
        </p>

        <ol className="w-full max-w-xs space-y-3">
          {STAGES.map((stage, i) => {
            const state = i < currentStage ? "done" : i === currentStage ? "active" : "pending";
            return (
              <li
                key={stage.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl ring-1 transition-all ${
                  state === "done"
                    ? "bg-accent/5 ring-accent/20 text-zinc-100"
                    : state === "active"
                    ? "bg-white/[0.04] ring-accent/40 text-zinc-100"
                    : "bg-white/[0.02] ring-white/5 text-zinc-500"
                }`}
              >
                <span className="shrink-0 w-6 h-6 rounded-full grid place-items-center">
                  {state === "done" ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : state === "active" ? (
                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  )}
                </span>
                <span className="text-sm">{stage.label}</span>
              </li>
            );
          })}
        </ol>

        {failed && (
          <button
            onClick={() => navigate({ to: "/create" })}
            className="mt-10 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-medium"
          >
            Réessayer
          </button>
        )}
      </div>
    </AppShell>
  );
}

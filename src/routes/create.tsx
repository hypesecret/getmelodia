import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/ui-shell/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { startMagicOrder } from "@/lib/magic.functions";
import { Mic, MicOff, Sparkles } from "lucide-react";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/create")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Décris ta chanson — Mélodia" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CreatePage,
});

type SpeechRecognitionEvent = { results: { isFinal: boolean; 0: { transcript: string } }[] };
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  start(): void;
  stop(): void;
}

const SUGGESTIONS = [
  { label: "Papa", text: "Une chanson pour mon papa, style rumba, tendre et fière." },
  { label: "Maman", text: "Une chanson pour ma maman en lingala, style gospel, gratitude." },
  { label: "Anniversaire", text: "Un morceau afrobeat énergique pour l'anniversaire de mon ami." },
  { label: "Mariage", text: "Une ballade rumba romantique pour notre mariage." },
  { label: "Amie", text: "Une chanson afrobeat joyeuse pour ma meilleure amie." },
  { label: "Enfant", text: "Une berceuse douce pour mon enfant, en français." },
];

function CreatePage() {
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate();
  const runMagic = useServerFn(startMagicOrder);

  const [text, setText] = useState(initialQ ?? "");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "fr-FR";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let finalTxt = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0].transcript;
        if (r.isFinal) finalTxt += t;
        else interim += t;
      }
      setText((prev: string) => (finalTxt ? (prev + " " + finalTxt).trim() : prev) + (interim ? " " + interim : ""));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  function toggleMic() {
    if (!recRef.current) return;
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      try {
        recRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  }

  async function submit() {
    const story = text.trim();
    if (story.length < 10 || submitting) return;
    if (listening && recRef.current) recRef.current.stop();
    setSubmitting(true);
    setError(null);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate({ to: "/auth", search: { next: `/create?q=${encodeURIComponent(story)}` } });
        return;
      }
      const res = await runMagic({ data: { userText: story, plan: "signature" } });
      navigate({ to: "/paiement/$orderId", params: { orderId: res.orderId } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
      setSubmitting(false);
    }
  }

  return (
    <AppShell backTo="/" backLabel="Accueil">
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 ring-1 ring-accent/20 mb-5">
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-accent">Décris ta chanson</span>
        </div>
        <h1 className="text-3xl font-medium tracking-tight mb-2">Raconte ton histoire</h1>
        <p className="text-sm text-zinc-400 mb-8 max-w-[36ch]">
          Pour qui, quelle occasion, quelle ambiance… L'IA s'occupe du reste.
        </p>

        <div className="w-full relative rounded-3xl bg-[#141110] ring-1 ring-white/10 focus-within:ring-accent/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
            placeholder="Ex : Une chanson d'anniversaire pour mon pote Thomas, vibe afro-pop énergique…"
            rows={5}
            disabled={submitting}
            className="w-full bg-transparent p-4 pr-14 text-[15px] text-zinc-100 placeholder:text-zinc-500 outline-none resize-none disabled:opacity-60"
          />
          {supported && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={submitting}
              aria-label={listening ? "Arrêter l'enregistrement" : "Enregistrer un mémo vocal"}
              className={`absolute right-3 top-3 w-10 h-10 rounded-full grid place-items-center transition-all ${
                listening ? "bg-red-500 text-white animate-pulse" : "bg-accent/15 text-accent hover:bg-accent/25"
              }`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <p className="text-[11px] text-zinc-500">
              {listening ? "🎙️ Parle librement…" : supported ? "Tape ou touche le micro" : "Tape ta demande"}
            </p>
            <button
              onClick={submit}
              disabled={text.trim().length < 10 || submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-accent text-accent-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {submitting ? "L'IA compose…" : "Créer ma chanson"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 w-full rounded-xl bg-red-950/40 ring-1 ring-red-500/30 text-red-300 text-sm p-3 text-left">
            {error}
          </div>
        )}

        <div className="mt-8 w-full">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">Inspiration</p>
          <div className="grid gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => setText(s.text)}
                className="text-left text-[13px] px-4 py-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/5 text-zinc-300 hover:ring-accent/30 transition"
              >
                <span className="text-accent font-medium mr-2">{s.label}</span>
                <span className="text-zinc-400">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

// Minimal typing for the Web Speech API (not in lib.dom by default).
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

const EXAMPLES = [
  "Une chanson d'anniversaire pour mon pote Thomas, vibe afro-pop énergique",
  "Un morceau doux pour ma maman, en lingala, style rumba",
  "Un jingle rap punchy pour ma boutique de sneakers à Kinshasa",
];

interface MagicInputProps {
  autoFocus?: boolean;
  compact?: boolean;
}

export function MagicInput({ autoFocus, compact }: MagicInputProps) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const navigate = useNavigate();

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
      let interim = "";
      let finalTxt = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0].transcript;
        if (r.isFinal) finalTxt += t;
        else interim += t;
      }
      setText((prev) => (finalTxt ? (prev + " " + finalTxt).trim() : prev).trim() + (interim ? " " + interim : ""));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
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

  function submit() {
    const q = text.trim();
    if (q.length < 4) return;
    if (recRef.current && listening) recRef.current.stop();
    navigate({ to: "/create", search: { q } });
  }

  return (
    <div className={compact ? "w-full" : "w-full max-w-xl mx-auto"}>
      <div className="relative rounded-3xl bg-[#141110] ring-1 ring-white/10 focus-within:ring-accent/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-all">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="Décris ta chanson : occasion, personne, ambiance…"
          autoFocus={autoFocus}
          rows={compact ? 2 : 3}
          className="w-full bg-transparent p-4 pr-14 text-[15px] text-zinc-100 placeholder:text-zinc-500 outline-none resize-none"
        />
        {supported && (
          <button
            type="button"
            onClick={toggleMic}
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
            disabled={text.trim().length < 4}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-accent-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Créer
          </button>
        </div>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] ring-1 ring-white/5 text-zinc-400 hover:text-zinc-200 hover:ring-white/10 transition"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

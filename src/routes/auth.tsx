import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AppShell } from "@/components/ui-shell/AppShell";

const searchSchema = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Connexion — Mélodia" },
      { name: "description", content: "Connectez-vous à Mélodia pour créer et retrouver vos chansons personnalisées." },
    ],
  }),
  component: AuthPage,
});

function safeNext(next?: string): string {
  if (!next) return "/library";
  if (!next.startsWith("/") || next.startsWith("//")) return "/library";
  return next;
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: safeNext(next), replace: true });
    });
  }, [navigate, next]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: safeNext(next), replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) throw new Error(result.error.message ?? "Erreur Google");
      if (result.redirected) return;
      navigate({ to: safeNext(next), replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur Google");
      setLoading(false);
    }
  }

  return (
    <AppShell backTo="/" backLabel="Accueil">
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <Link to="/" className="block text-center text-xl font-semibold tracking-tight mb-8">
          Mélodia<span className="text-accent">.</span>
        </Link>
        <div className="bg-surface/60 ring-1 ring-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex gap-2 p-1 rounded-full bg-zinc-900/60 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${mode === m ? "bg-accent text-accent-foreground" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                {m === "login" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full mb-4 py-3 rounded-full bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">ou</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Votre prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 ring-1 ring-white/10 text-sm outline-none focus:ring-accent/40"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 ring-1 ring-white/10 text-sm outline-none focus:ring-accent/40"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe (min. 6 caractères)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 ring-1 ring-white/10 text-sm outline-none focus:ring-accent/40"
              required
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-accent text-accent-foreground font-medium text-sm hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {loading ? "…" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6">
          <Link to="/" className="hover:text-accent">← Retour à l'accueil</Link>
        </p>
      </div>
    </AppShell>
  );
}

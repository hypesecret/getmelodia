import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Music2, User, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Accueil", icon: Home, match: (p: string) => p === "/" },
  {
    to: "/library",
    label: "Chansons",
    icon: Music2,
    match: (p: string) => p.startsWith("/library") || p.startsWith("/song"),
  },
  { spacer: true as const },
  {
    to: "/profile",
    label: "Compte",
    icon: User,
    match: (p: string) => p.startsWith("/profile") || p.startsWith("/auth"),
  },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const createActive =
    pathname.startsWith("/create") ||
    pathname.startsWith("/generate") ||
    pathname.startsWith("/paiement");

  return (
    <nav
      aria-label="Navigation principale"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 bg-[#0a0806]/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative">
        {/* Center prominent CTA (absolute, doesn't consume grid slot) */}
        <Link
          to="/create"
          aria-label="Créer une chanson"
          className={`absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full grid place-items-center bg-accent text-accent-foreground transition-transform active:scale-95 shadow-[0_10px_30px_-6px_color-mix(in_oklab,var(--color-accent)_55%,transparent)] ring-4 ring-[#0a0806] ${
            createActive ? "scale-105" : ""
          }`}
        >
          <Sparkles className="w-6 h-6" strokeWidth={2.2} />
          <span className="sr-only">Créer</span>
        </Link>

        <ul className="grid grid-cols-4">
          {items.map((it, i) => {
            if ("spacer" in it) return <li key="spacer" aria-hidden />;
            const active = it.match(pathname);
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                    active ? "text-accent" : "text-zinc-500"
                  }`}
                >
                  <Icon
                    className={`w-[22px] h-[22px] ${active ? "text-accent" : "text-zinc-500"}`}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

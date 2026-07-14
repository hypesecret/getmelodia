import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { ChevronLeft } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  /** Show top bar with logo + optional back link */
  topBar?: boolean;
  backTo?: string;
  backLabel?: string;
  right?: ReactNode;
  /** Add bottom-nav (mobile only). Default true. */
  withBottomNav?: boolean;
  /** Extra bottom padding for the bottom-nav */
  padBottom?: boolean;
}

export function AppShell({
  children,
  topBar = true,
  backTo,
  backLabel = "Retour",
  right,
  withBottomNav = true,
  padBottom = true,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0a0806] text-zinc-100 flex flex-col">
      {topBar && (
        <header
          className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0806]/80 backdrop-blur-xl"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            {backTo ? (
              <Link
                to={backTo}
                className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100"
                aria-label={backLabel}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            ) : (
              <Link to="/" className="text-lg font-semibold tracking-tight">
                Mélodia<span className="text-accent">.</span>
              </Link>
            )}
            {right}
          </div>
        </header>
      )}

      <main className={`flex-1 w-full ${padBottom && withBottomNav ? "pb-24 md:pb-8" : ""}`}>
        {children}
      </main>

      {withBottomNav && <BottomNav />}
    </div>
  );
}

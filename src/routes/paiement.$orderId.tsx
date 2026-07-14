import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { simulatePayment } from "@/lib/orders.functions";
import { AppShell } from "@/components/ui-shell/AppShell";

export const Route = createFileRoute("/paiement/$orderId")({
  head: () => ({
    meta: [
      { title: "Paiement — Mélodia" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentPage,
});

const OPERATORS = [
  { key: "orange", label: "Orange Money", color: "#FF7900" },
  { key: "airtel", label: "Airtel Money", color: "#E60028" },
  { key: "mpesa", label: "M-Pesa", color: "#00A651" },
  { key: "africell", label: "Africell Money", color: "#3B4E9B" },
] as const;

function PaymentPage() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const pay = useServerFn(simulatePayment);
  const [operator, setOperator] = useState<(typeof OPERATORS)[number]["key"]>("orange");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await pay({ data: { orderId, operator, phone } });
      navigate({ to: "/generate/$songId", params: { songId: res.songId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de paiement");
      setLoading(false);
    }
  }

  return (
    <AppShell backTo="/create" backLabel="Retour">
      <div className="w-full max-w-md mx-auto px-4 py-6">
          <div className="mb-8 text-center">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">Paiement Mobile Money</div>
            <h1 className="text-2xl font-medium">Confirmez votre commande</h1>
            <p className="text-sm text-zinc-500 mt-2">Vous êtes en mode simulation — aucun débit réel.</p>
          </div>

          <form onSubmit={submit} className="bg-surface/60 ring-1 ring-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="mb-6">
              <label className="text-xs uppercase tracking-wider text-zinc-500 mb-3 block">Opérateur</label>
              <div className="grid grid-cols-2 gap-2">
                {OPERATORS.map((op) => (
                  <button
                    key={op.key}
                    type="button"
                    onClick={() => setOperator(op.key)}
                    className={`p-3 rounded-lg ring-1 text-sm transition-all ${operator === op.key ? "ring-accent bg-accent/10" : "ring-white/10 bg-zinc-900/50 hover:ring-white/20"}`}
                  >
                    <div className="size-2 rounded-full mb-1.5" style={{ background: op.color }} />
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block mb-6">
              <span className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">Numéro de téléphone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                minLength={6}
                placeholder="+243 …"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 ring-1 ring-white/10 text-sm outline-none focus:ring-accent/40"
              />
            </label>

            {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-accent text-accent-foreground font-medium text-sm hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {loading ? "Traitement…" : "Payer et générer"}
            </button>
            <p className="text-[11px] text-zinc-500 mt-3 text-center">
              En validant, vous acceptez la simulation de paiement de démo.
            </p>
          </form>
        </div>
    </AppShell>
  );
}

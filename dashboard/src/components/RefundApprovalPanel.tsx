import { useState } from "react";
import { ShieldAlert, Check } from "lucide-react";
import { api, ApiError } from "../lib/api";
import type { Connection } from "../lib/api";
import type { SuggestedAction } from "../lib/types";

export function RefundApprovalPanel({
  connection, ticketId, action, onApproved,
}: {
  connection: Connection;
  ticketId: string;
  action: SuggestedAction;
  onApproved: () => void;
}) {
  const [amount, setAmount] = useState(action.amount ?? 0);
  const [reason, setReason] = useState(action.reason ?? "");
  const [state, setState] = useState<"idle" | "confirming" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    setState("submitting");
    setError("");
    try {
      const idempotencyKey = crypto.randomUUID();
      await api.approveRefund(connection, ticketId, amount, reason, idempotencyKey);
      setState("done");
      onApproved();
    } catch (err) {
      setState("error");
      setError(err instanceof ApiError ? err.message : "Refund failed — nothing was charged twice, safe to retry.");
    }
  }

  if (action.type === "none") return null;

  return (
    <div className="rounded-xl2 border-2 border-gold/40 bg-gold-100/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-gold-700" />
        <span className="text-sm font-semibold text-gold-700">
          AI suggests: {action.type === "refund" ? "Refund" : "Resend order"}
        </span>
      </div>

      {state === "done" ? (
        <div className="flex items-center gap-2 text-sm text-teal-700">
          <Check className="w-4 h-4" /> Approved and processed.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-ink-600 mb-1">Amount</label>
              <input
                type="number" step="0.01" value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm font-mono outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-ink-600 mb-1">Order</label>
              <input
                disabled value={action.order_id ?? "—"}
                className="w-full rounded-lg border border-line bg-ink-900/[0.03] px-2.5 py-2 text-sm font-mono text-ink-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-ink-600 mb-1">Reason</label>
            <input
              value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          {error && <div className="rounded-lg bg-rose-100 text-rose-700 text-xs px-3 py-2">{error}</div>}

          {state === "confirming" ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-600 flex-1">Refund ${amount.toFixed(2)}? This charges the real order.</span>
              <button onClick={() => setState("idle")} className="text-xs px-3 py-1.5 rounded-lg text-ink-600 hover:bg-ink-900/5">Cancel</button>
              <button onClick={submit} className="text-xs px-3 py-1.5 rounded-lg bg-rose text-white hover:bg-rose-700 font-medium">Confirm refund</button>
            </div>
          ) : (
            <button
              onClick={() => setState("confirming")}
              disabled={amount <= 0}
              className="w-full text-xs py-2 rounded-lg bg-gold text-white font-medium hover:bg-gold-700 disabled:opacity-40 transition-colors"
            >
              {state === "submitting" ? "Processing…" : "Approve & send to Shopify"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

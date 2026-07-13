import { useEffect, useState } from "react";
import { Inbox, RefreshCw } from "lucide-react";
import { api } from "../lib/api";
import type { Connection } from "../lib/api";
import type { TicketWithSuggestion } from "../lib/types";
import { CategoryBadge, PriorityBadge, AutoSentBadge } from "../components/Badges";
import { ConfidenceBar } from "../components/ConfidenceBar";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function TicketsPage({ connection, onOpenTicket }: { connection: Connection; onOpenTicket: (id: string) => void }) {
  const [tickets, setTickets] = useState<TicketWithSuggestion[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.listTickets(connection, statusFilter ? { status: statusFilter } : undefined);
      setTickets(res.tickets);
    } catch {
      setError("Couldn't load tickets. Check the connection in the sidebar.");
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const filters = [
    { id: "", label: "All" },
    { id: "open", label: "Open" },
    { id: "in_progress", label: "In progress" },
    { id: "resolved", label: "Resolved" },
  ];

  return (
    <div className="max-w-5xl">
      <header className="flex items-end justify-between mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-400 mb-1">Inbox</p>
          <h1 className="font-display text-3xl text-ink-900">Tickets</h1>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-ink-900 px-3 py-2 rounded-lg hover:bg-ink-900/5 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </header>

      <div className="flex items-center gap-1 mb-5">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === f.id ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-900/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="rounded-lg bg-rose-100 text-rose-700 text-sm px-4 py-3 mb-4">{error}</div>}

      {tickets === null && !error && (
        <div className="text-sm text-ink-400 py-16 text-center">Loading…</div>
      )}

      {tickets && tickets.length === 0 && (
        <div className="bg-surface border border-line rounded-xl2 py-16 text-center">
          <Inbox className="w-8 h-8 text-ink-400 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-ink-600">No tickets here yet.</p>
          <p className="text-xs text-ink-400 mt-1">New tickets from Gorgias or the API will show up in this list.</p>
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <div className="bg-surface border border-line rounded-xl2 shadow-panel overflow-hidden divide-y divide-line">
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => onOpenTicket(t.id)}
              className="w-full text-left px-5 py-4 hover:bg-ink-900/[0.02] transition-colors grid grid-cols-[1fr_auto] gap-4 items-center"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-ink-900 truncate">{t.customer_name || t.customer_email}</span>
                  <PriorityBadge priority={t.priority} />
                  <CategoryBadge category={t.category} />
                  <AutoSentBadge autoSent={t.auto_sent} />
                </div>
                <p className="text-sm text-ink-600 truncate">{t.subject}</p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                {t.suggestion && <div className="w-28"><ConfidenceBar value={t.suggestion.confidence} size="sm" /></div>}
                <span className="font-mono text-xs text-ink-400 w-16 text-right">{timeAgo(t.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

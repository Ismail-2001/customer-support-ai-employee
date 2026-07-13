import { useEffect, useState } from "react";
import { useConnection } from "./lib/useConnection";
import { api } from "./lib/api";
import { ConnectScreen } from "./components/ConnectScreen";
import { Sidebar, type View } from "./components/Sidebar";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { KnowledgeBasePage } from "./pages/KnowledgeBasePage";

type Health = { shopify_connected: boolean; gorgias_connected: boolean; auto_send_enabled: boolean } | null;

export default function App() {
  const { connection, setConnection } = useConnection();
  const [view, setView] = useState<View>("tickets");
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [health, setHealth] = useState<Health>(null);

  useEffect(() => {
    if (connection) api.health(connection).then(setHealth).catch(() => setHealth(null));
  }, [connection]);

  if (!connection) {
    return <ConnectScreen onConnect={setConnection} />;
  }

  return (
    <div className="flex bg-bg min-h-screen font-sans">
      <Sidebar
        view={view}
        onNavigate={(v) => { setView(v); setOpenTicketId(null); }}
        onDisconnect={() => setConnection(null)}
        health={health}
      />
      <main className="flex-1 px-8 py-7 overflow-x-hidden">
        {view === "tickets" && !openTicketId && (
          <TicketsPage connection={connection} onOpenTicket={setOpenTicketId} />
        )}
        {view === "tickets" && openTicketId && (
          <TicketDetailPage connection={connection} ticketId={openTicketId} onBack={() => setOpenTicketId(null)} />
        )}
        {view === "analytics" && <AnalyticsPage connection={connection} />}
        {view === "knowledge-base" && <KnowledgeBasePage connection={connection} />}
      </main>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RoleGuard } from "@/components/RoleGuard";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Counter, Ticket } from "@/lib/types";

export default function CashierDashboard() {
  return <RoleGuard role="CASHIER"><CashierContent /></RoleGuard>;
}

function CashierContent() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => counters.find((item) => item.id === selectedId) || counters[0], [counters, selectedId]);

  const load = useCallback(() => {
    api<Counter[]>("/cashier/counters").then((rows) => { setCounters(rows); setSelectedId((id) => id || rows[0]?.id || null); }).catch((e) => setError(e.message));
  }, []);
  useEffect(() => { load(); const timer = window.setInterval(load, 4000); return () => clearInterval(timer); }, [load]);

  async function action(path: string, method = "PATCH", body?: object) {
    setBusy(true); setError("");
    try { await api<Counter | Ticket>(path, { method, body: body ? JSON.stringify(body) : undefined }); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Action impossible"); }
    finally { setBusy(false); }
  }

  if (!selected) return <div className="app-shell"><AppHeader label="Caissier" /><main className="center-page"><p>Aucun guichet configuré. Contactez l'administrateur.</p></main></div>;
  const ticket = selected.current_ticket;
  return (
    <div className="app-shell">
      <AppHeader label="Espace caissier" />
      <main className="dashboard-main cashier-main">
        <section className="cashier-top"><div><span className="eyebrow">Poste de service</span><h1>{selected.name}</h1></div><label className="compact-select">Changer de guichet<select value={selected.id} onChange={(e) => setSelectedId(Number(e.target.value))}>{counters.map((counter) => <option key={counter.id} value={counter.id}>{counter.name}</option>)}</select></label></section>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="counter-status panel"><div><span className={"status-dot " + selected.status.toLowerCase()} /> <strong>{selected.status === "OPEN" ? "Guichet ouvert" : selected.status === "PAUSED" ? "En pause" : "Guichet fermé"}</strong></div><div className="inline-actions">
          {selected.status === "CLOSED" && <button className="button button-primary button-small" disabled={busy} onClick={() => action("/cashier/counters/" + selected.id + "/status", "PATCH", { status: "OPEN" })}>Ouvrir</button>}
          {selected.status === "OPEN" && !ticket && <button className="button button-secondary button-small" disabled={busy} onClick={() => action("/cashier/counters/" + selected.id + "/status", "PATCH", { status: "PAUSED" })}>Pause</button>}
          {selected.status === "PAUSED" && <button className="button button-primary button-small" disabled={busy} onClick={() => action("/cashier/counters/" + selected.id + "/status", "PATCH", { status: "OPEN" })}>Reprendre</button>}
        </div></div>
        <section className="current-service panel">
          <span className="section-kicker">Client en cours</span>
          {ticket ? <><div className="current-ticket-row"><div className="ticket-orb small">{ticket.code}</div><div><h2>{ticket.service_name}</h2><StatusBadge status={ticket.status} /></div></div>
            <div className="action-grid">
              {ticket.status === "CALLED" && <><button className="button button-primary" disabled={busy} onClick={() => action("/cashier/tickets/" + ticket.id + "/start")}>Client présent · Commencer</button><button className="button button-danger button-ghost" disabled={busy} onClick={() => action("/cashier/tickets/" + ticket.id + "/no-show")}>Marquer absent</button></>}
              {ticket.status === "IN_PROGRESS" && <button className="button button-success" disabled={busy} onClick={() => action("/cashier/tickets/" + ticket.id + "/close", "PATCH", { comment: "Service terminé", auto_call_next: true })}>Terminer et appeler le suivant</button>}
            </div></> : <div className="empty-state"><span>✓</span><h2>Aucun client en cours</h2><p>Le prochain ticket sera sélectionné dans l'ordre d'arrivée.</p><button className="button button-primary button-large" disabled={busy || selected.status !== "OPEN"} onClick={() => action("/cashier/counters/" + selected.id + "/next-ticket", "POST")}>Appeler le prochain ticket</button></div>}
        </section>
      </main>
    </div>
  );
}


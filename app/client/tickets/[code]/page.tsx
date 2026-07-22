"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Ticket } from "@/lib/types";

interface QueuePosition {
  ticket: Ticket;
  current_called_code: string | null;
  active_counters: number;
  average_service_minutes: number;
}

export default function TicketTrackingPage() {
  const params = useParams<{ code: string }>();
  const code = params.code.toUpperCase();
  const [data, setData] = useState<QueuePosition | null>(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(() => {
    api<QueuePosition>("/queues/position/" + code)
      .then(setData)
      .catch((reason) => setError(reason.message));
  }, [code]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, Number(process.env.NEXT_PUBLIC_API_POLL_MS || 4000));
    return () => window.clearInterval(timer);
  }, [load]);

  async function cancel() {
    if (!data || !window.confirm("Annuler définitivement ce ticket ?")) return;
    setCancelling(true);
    try {
      await api<Ticket>("/client/tickets/" + data.ticket.id + "/cancel", { method: "PATCH" });
      load();
    } catch (reason) {
      setError(reason instanceof Error && "status" in reason && reason.status === 401 ? "Connectez-vous pour annuler ce ticket." : reason instanceof Error ? reason.message : "Annulation impossible");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <main className="tracking-page">
      <nav className="public-nav"><Brand /><Link href="/login">Mon espace</Link></nav>
      {error && <div className="alert alert-error">{error}</div>}
      {!data ? <div className="center-page"><div className="loader" /><p>Recherche du ticket…</p></div> : (
        <section className="tracking-card">
          <span className="eyebrow">Suivi en direct</span>
          <p className="muted">Votre numéro de ticket</p>
          <div className="ticket-orb">{data.ticket.code}</div>
          <StatusBadge status={data.ticket.status} />
          {data.ticket.status === "CALLED" && <div className="callout success"><strong>C'est votre tour !</strong><span>Présentez-vous au {data.ticket.counter_name}.</span></div>}
          <div className="tracking-metrics">
            <div><span>Position dans la file</span><strong>{data.ticket.position === 0 ? "Appelé" : data.ticket.position ?? "—"}</strong></div>
            <div><span>Temps d'attente estimé</span><strong>{data.ticket.estimated_wait_minutes ?? "—"} min</strong></div>
          </div>
          <div className="queue-progress"><span style={{ width: data.ticket.position ? Math.max(12, 100 - data.ticket.position * 8) + "%" : "100%" }} /></div>
          <p className="live-note"><i /> Mise à jour automatique · {data.active_counters} guichet(s) actif(s)</p>
          {data.ticket.status === "WAITING" && <button className="button button-danger button-ghost" onClick={cancel} disabled={cancelling}>{cancelling ? "Annulation…" : "Annuler le ticket"}</button>}
          <Link className="back-link" href="/">Retour à l'accueil</Link>
        </section>
      )}
    </main>
  );
}


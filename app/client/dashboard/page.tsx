"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { RoleGuard } from "@/components/RoleGuard";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { Service, Ticket } from "@/lib/types";

export default function ClientDashboard() {
  return <RoleGuard role="CLIENT"><ClientContent /></RoleGuard>;
}

function ClientContent() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [current, setCurrent] = useState<Ticket | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api<Service[]>("/services"), api<Ticket | null>("/client/tickets/current")])
      .then(([serviceRows, ticket]) => {
        setServices(serviceRows);
        setCurrent(ticket);
        setSelected(serviceRows[0]?.id || null);
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function createTicket() {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const ticket = await api<Ticket>("/client/tickets", {
        method: "POST",
        body: JSON.stringify({ service_id: selected }),
      });
      router.push("/client/tickets/" + ticket.code);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Création impossible");
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <AppHeader label="Espace client" />
      <main className="dashboard-main client-main">
        <section className="page-intro"><span className="eyebrow">Bonjour</span><h1>Que venez-vous faire aujourd'hui ?</h1><p>Choisissez un service. Votre ticket sera ajouté à la file unique.</p></section>
        {error && <div className="alert alert-error">{error}</div>}
        {current ? (
          <section className="active-ticket-card">
            <div><span className="section-kicker">Ticket actif</span><h2>{current.code}</h2><StatusBadge status={current.status} /></div>
            <div className="ticket-metrics"><p><strong>{current.position ?? "—"}</strong><span>Position</span></p><p><strong>{current.estimated_wait_minutes ?? "—"} min</strong><span>Temps estimé</span></p></div>
            <button className="button button-primary" onClick={() => router.push("/client/tickets/" + current.code)}>Suivre mon ticket</button>
          </section>
        ) : (
          <>
            <section className="service-grid" aria-busy={loading}>
              {services.map((service, index) => (
                <button key={service.id} className={"service-card " + (selected === service.id ? "selected" : "")} onClick={() => setSelected(service.id)}>
                  <span className="service-icon">{["↧", "↥", "+", "•••"][index] || "•"}</span>
                  <strong>{service.name}</strong><small>Environ {service.average_minutes} min par service</small>
                </button>
              ))}
            </section>
            <button className="button button-primary button-large continue-button" onClick={createTicket} disabled={loading || !selected}>{loading ? "Chargement…" : "Confirmer et prendre mon ticket"}</button>
          </>
        )}
      </main>
    </div>
  );
}


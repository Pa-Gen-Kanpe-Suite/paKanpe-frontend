"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/api";
import type { Service, Ticket } from "@/lib/types";

export default function AgentDashboard() {
  return <RoleGuard role="AGENT"><AgentContent /></RoleGuard>;
}

function AgentContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [created, setCreated] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { api<Service[]>("/services").then(setServices).catch((e) => setError(e.message)); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setCreated(null);
    const form = new FormData(event.currentTarget);
    try {
      const ticket = await api<Ticket>("/agent/tickets/physical", {
        method: "POST",
        body: JSON.stringify({ service_id: Number(form.get("service_id")), visitor_name: form.get("visitor_name"), visitor_phone: form.get("visitor_phone") || null }),
      });
      setCreated(ticket);
      event.currentTarget.reset();
    } catch (e) { setError(e instanceof Error ? e.message : "Création impossible"); }
    finally { setLoading(false); }
  }

  return (
    <div className="app-shell">
      <AppHeader label="Accueil physique" />
      <main className="dashboard-main split-dashboard">
        <section><span className="eyebrow">Agent d'accueil</span><h1>Créer un ticket physique</h1><p className="muted">Le ticket rejoint immédiatement la même file que les tickets mobiles.</p>
          <form className="panel form-stack" onSubmit={submit}>
            <label>Nom du client<input name="visitor_name" required minLength={2} autoFocus /></label>
            <label>Téléphone <small>(facultatif)</small><input name="visitor_phone" type="tel" /></label>
            <label>Service<select name="service_id" required>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="button button-primary button-full" disabled={loading}>{loading ? "Création…" : "Générer le ticket"}</button>
          </form>
        </section>
        <aside className="ticket-preview panel">
          {created ? <><span className="section-kicker">Ticket créé</span><div className="ticket-orb">{created.code}</div><h2>{created.service_name}</h2><p>Position : <strong>{created.position}</strong></p><p>Attente estimée : <strong>{created.estimated_wait_minutes} min</strong></p><button className="button button-dark" onClick={() => window.print()}>Imprimer le ticket</button></> : <div className="empty-state"><span>＋</span><h2>Le reçu apparaîtra ici</h2><p>Remplissez le formulaire pour générer un numéro.</p></div>}
        </aside>
      </main>
    </div>
  );
}


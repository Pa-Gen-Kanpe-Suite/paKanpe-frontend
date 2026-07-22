"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/api";
import type { Counter, Statistics } from "@/lib/types";

export default function AdminDashboard() {
  return <RoleGuard role="ADMIN"><AdminContent /></RoleGuard>;
}

function AdminContent() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(() => Promise.all([api<Statistics>("/admin/statistics/overview"), api<Counter[]>("/admin/counters")]).then(([s, c]) => { setStats(s); setCounters(c); }).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); const timer = window.setInterval(load, 8000); return () => clearInterval(timer); }, [load]);

  async function addCounter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try { await api("/admin/counters", { method: "POST", body: JSON.stringify({ number: Number(form.get("number")), name: form.get("name") }) }); event.currentTarget.reset(); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Création impossible"); }
  }
  async function setStatus(counter: Counter, status: "OPEN" | "CLOSED") {
    try { await api("/admin/counters/" + counter.id + "/status", { method: "PATCH", body: JSON.stringify({ status }) }); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Modification impossible"); }
  }

  return (
    <div className="app-shell admin-shell">
      <AppHeader label="Administration" />
      <main className="dashboard-main admin-main">
        <section className="page-intro admin-intro"><div><span className="eyebrow">Tableau de bord · Aujourd'hui</span><h1>Vue d'ensemble de l'agence</h1></div><a className="button button-dark button-small" href="/display" target="_blank">Ouvrir l'écran public</a></section>
        {error && <div className="alert alert-error">{error}</div>}
        <section className="stats-grid">
          <article><span>Tickets émis</span><strong>{stats?.tickets_issued ?? "—"}</strong><small>{stats?.waiting ?? 0} en attente</small></article>
          <article><span>Temps moyen</span><strong>{stats?.average_wait_minutes ?? "—"} min</strong><small>Attente observée</small></article>
          <article><span>Guichets actifs</span><strong>{stats?.active_counters ?? "—"}</strong><small>sur {counters.length} configurés</small></article>
          <article className="danger-stat"><span>Absences</span><strong>{stats?.absent ?? "—"}</strong><small>{stats?.cancelled ?? 0} annulations</small></article>
        </section>
        <section className="admin-grid">
          <div className="panel"><div className="panel-title"><div><span className="section-kicker">Exploitation</span><h2>Gestion des guichets</h2></div></div><div className="counter-list">{counters.map((counter) => <article key={counter.id}><div><span className={"status-dot " + counter.status.toLowerCase()} /><strong>{counter.name}</strong><small>{counter.current_ticket ? "Ticket " + counter.current_ticket.code : "Aucun ticket actif"}</small></div><button className="button button-ghost button-small" disabled={Boolean(counter.current_ticket)} onClick={() => setStatus(counter, counter.status === "OPEN" ? "CLOSED" : "OPEN")}>{counter.status === "OPEN" ? "Fermer" : "Ouvrir"}</button></article>)}</div></div>
          <div className="panel"><span className="section-kicker">Configuration</span><h2>Ajouter un guichet</h2><form onSubmit={addCounter} className="form-stack"><label>Numéro<input name="number" type="number" min="1" required /></label><label>Nom<input name="name" placeholder="Guichet 4" required /></label><button className="button button-primary">Ajouter</button></form><div className="mini-stats"><p><span>Services terminés</span><strong>{stats?.completed ?? 0}</strong></p><p><span>En service</span><strong>{stats?.in_service ?? 0}</strong></p><p><span>Durée moyenne</span><strong>{stats?.average_service_minutes ?? 0} min</strong></p></div></div>
        </section>
      </main>
    </div>
  );
}


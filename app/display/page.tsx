"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Board { called: { code: string; counter_name: string; called_at: string }[]; waiting_count: number; updated_at: string }

export default function DisplayPage() {
  const [board, setBoard] = useState<Board | null>(null);
  const load = useCallback(() => api<Board>("/display").then(setBoard), []);
  useEffect(() => { load(); const timer = setInterval(load, 2000); return () => clearInterval(timer); }, [load]);
  const current = board?.called[0];
  return (
    <main className="display-page">
      <header><span className="brand-mark">PGK</span><div><strong>PA GEN KANPE</strong><small>UNIBANK · Numéros appelés</small></div><time>{new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</time></header>
      <section className="display-current"><span>Maintenant</span>{current ? <><strong>{current.code}</strong><p>Veuillez vous présenter au <b>{current.counter_name}</b></p></> : <><strong>—</strong><p>Aucun ticket appelé pour le moment</p></>}</section>
      <section className="display-recent"><h2>Appels récents</h2><div>{board?.called.slice(1).map((item) => <article key={item.code + item.called_at}><strong>{item.code}</strong><span>{item.counter_name}</span></article>)}</div></section>
      <footer><span><i /> Mise à jour en direct</span><strong>{board?.waiting_count ?? 0} personnes en attente</strong></footer>
    </main>
  );
}


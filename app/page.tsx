"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  function track(event: FormEvent) {
    event.preventDefault();
    if (code.trim()) router.push("/client/tickets/" + code.trim().toUpperCase());
  }
  return (
    <main className="landing">
      <nav className="public-nav"><Brand /><Link href="/display">Écran d'appel</Link></nav>
      <section className="hero">
        <div className="eyebrow">Une file plus juste. Une journée plus simple.</div>
        <h1>Votre tour, sans rester debout.</h1>
        <p>Prenez un ticket à distance, suivez votre position et arrivez au bon moment.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/register">Prendre un ticket</Link>
          <Link className="button button-secondary" href="/login">Se connecter</Link>
        </div>
        <form className="track-form" onSubmit={track}>
          <label htmlFor="ticket-code">Vous avez déjà un ticket ?</label>
          <div><input id="ticket-code" placeholder="Ex. A0024" value={code} onChange={(e) => setCode(e.target.value)} /><button className="button button-dark">Suivre</button></div>
        </form>
      </section>
      <section className="benefit-grid">
        <article><span>01</span><h2>Choisissez</h2><p>Indiquez le service bancaire dont vous avez besoin.</p></article>
        <article><span>02</span><h2>Suivez</h2><p>Votre position et le temps estimé sont actualisés.</p></article>
        <article><span>03</span><h2>Présentez-vous</h2><p>Une alerte vous prévient lorsque votre tour approche.</p></article>
      </section>
      <footer><Link href="/login">Je suis un employé de la banque</Link><span>PA GEN KANPE · MVP LOG3550</span></footer>
    </main>
  );
}


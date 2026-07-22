"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.get("full_name"),
        email: form.get("email"),
        phone: form.get("phone"),
        bank_identifier: form.get("bank_identifier") || null,
        password: form.get("password"),
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      const detail = Array.isArray(payload.detail) ? payload.detail[0]?.msg : payload.detail;
      setError(detail || "Inscription impossible");
      setLoading(false);
      return;
    }
    router.push("/client/dashboard");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-wide">
        <Brand />
        <div className="auth-heading"><span className="eyebrow">Compte client</span><h1>Reprenez le contrôle de votre temps.</h1><p>Quelques informations suffisent pour prendre votre premier ticket.</p></div>
        <form onSubmit={submit} className="form-grid">
          <label>Nom complet<input name="full_name" autoComplete="name" required minLength={2} /></label>
          <label>Téléphone<input name="phone" type="tel" autoComplete="tel" required minLength={8} /></label>
          <label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label>Identifiant bancaire <small>(facultatif)</small><input name="bank_identifier" /></label>
          <label className="span-two">Mot de passe<input name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="8 caractères, une majuscule et un chiffre" /></label>
          {error && <div className="alert alert-error span-two" role="alert">{error}</div>}
          <button className="button button-primary button-full span-two" disabled={loading}>{loading ? "Création…" : "Créer mon compte"}</button>
        </form>
        <p className="auth-switch">Déjà inscrit ? <Link href="/login">Se connecter</Link></p>
      </section>
      <aside className="auth-aside register-aside"><div><span>Simple · Rapide · Équitable</span><h2>Une seule file pour tout le monde.</h2><p>Tickets mobiles et tickets physiques sont traités dans leur ordre d'arrivée.</p></div></aside>
    </main>
  );
}


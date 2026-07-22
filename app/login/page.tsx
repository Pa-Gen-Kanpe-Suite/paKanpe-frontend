"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";
import { roleHome } from "@/lib/api";
import type { User } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.detail || "Connexion impossible");
      setLoading(false);
      return;
    }
    const user = payload.user as User;
    router.push(roleHome(user.role));
    router.refresh();
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <div className="auth-heading"><span className="eyebrow">Espace sécurisé</span><h1>Bon retour parmi nous.</h1><p>Connectez-vous pour accéder à votre espace.</p></div>
        <form onSubmit={submit} className="form-stack">
          <label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label>Mot de passe<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <button className="button button-primary button-full" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button>
        </form>
        <p className="auth-switch">Nouveau client ? <Link href="/register">Créer un compte</Link></p>
        <Link className="back-link" href="/">← Retour à l'accueil</Link>
      </section>
      <aside className="auth-aside"><div><span>PA GEN KANPE</span><blockquote>« Votre temps vous appartient. »</blockquote><p>Une expérience bancaire plus fluide, équitable et accessible.</p></div></aside>
    </main>
  );
}


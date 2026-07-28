"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/Brand";
import { auth, roleHome, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const response = await auth.login(email, password);
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Rediriger selon le rôle
      router.push(roleHome(response.user.role));
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail || err.message);
      } else {
        setError("Une erreur est survenue");
      }
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <div className="auth-heading">
          <span className="eyebrow">Espace sécurisé</span>
          <h1>Bon retour parmi nous.</h1>
          <p>Connectez-vous pour accéder à votre espace.</p>
        </div>
        <form onSubmit={submit} className="form-stack">
          <label>
            Adresse e-mail
            <input 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
            />
          </label>
          <label>
            Mot de passe
            <input 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required 
            />
          </label>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          <button 
            className="button button-primary button-full" 
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="auth-switch">
          Nouveau client ? <Link href="/register">Créer un compte</Link>
        </p>
        <Link className="back-link" href="/">
          ← Retour à l'accueil
        </Link>
      </section>
      <aside className="auth-aside">
        <div>
          <span>PA GEN KANPE</span>
          <blockquote>« Votre temps vous appartient. »</blockquote>
          <p>Une expérience bancaire plus fluide, équitable et accessible.</p>
        </div>
      </aside>
    </main>
  );
}
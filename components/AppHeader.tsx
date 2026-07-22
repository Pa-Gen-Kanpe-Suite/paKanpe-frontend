"use client";

import { useRouter } from "next/navigation";
import { Brand } from "./Brand";

export function AppHeader({ label }: { label?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <header className="app-header">
      <Brand />
      <div className="header-actions">
        {label && <span className="role-pill">{label}</span>}
        <button className="button button-ghost button-small" onClick={logout}>Déconnexion</button>
      </div>
    </header>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { roleHome } from "@/lib/api";
import type { Role, User } from "@/lib/types";

export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<User>;
      })
      .then((user) => {
        if (user.role !== role) router.replace(roleHome(user.role));
        else setAllowed(true);
      })
      .catch(() => router.replace("/login"));
  }, [role, router]);

  if (!allowed) return <main className="center-page"><div className="loader" /><p>Vérification de votre accès…</p></main>;
  return children;
}


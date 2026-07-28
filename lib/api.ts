export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch("/api/proxy" + path, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    // Utilisation de unknown au lieu de any pour satisfaire ESLint
    const payload = (await response.json().catch(() => ({ detail: "Une erreur est survenue" }))) as { detail?: string };
    throw new ApiError(payload.detail || "Une erreur est survenue", response.status);
  }
  if (response.status === 204) return undefined as unknown as T; // Remplacement de 'as T' avec unknown
  return response.json();
}

export function roleHome(role: string): string {
  const routes: Record<string, string> = {
    CLIENT: "/client/dashboard",
    AGENT: "/agent/dashboard",
    CASHIER: "/caissier/dashboard",
    ADMIN: "/admin/dashboard",
  };
  return routes[role] || "/";
}

const apiUtils = { ApiError, api, roleHome };
export default apiUtils;
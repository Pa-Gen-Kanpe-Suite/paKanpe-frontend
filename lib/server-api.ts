import { cookies } from "next/headers";

export const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

export async function authenticatedBackend(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("pgk_session")?.value;
  return fetch(backendUrl + "/api/v1" + path, {
    ...init,
    headers: {
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

export async function passthrough(response: Response) {
  const body = await response.arrayBuffer();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
  });
}


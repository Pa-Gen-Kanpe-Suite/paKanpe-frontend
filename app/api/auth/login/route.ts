import { cookies } from "next/headers";
import { backendUrl, passthrough } from "@/lib/server-api";

export async function POST(request: Request) {
  const response = await fetch(backendUrl + "/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
  if (!response.ok) return passthrough(response);
  const payload = await response.json();
  const cookieStore = await cookies();
  cookieStore.set("pgk_session", payload.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return Response.json({ user: payload.user });
}


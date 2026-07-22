import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("pgk_session");
  return Response.json({ message: "Déconnecté" });
}


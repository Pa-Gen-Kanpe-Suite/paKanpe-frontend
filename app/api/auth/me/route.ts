import { authenticatedBackend, passthrough } from "@/lib/server-api";

export async function POST() {
  return passthrough(await authenticatedBackend("/auth/me"));
}


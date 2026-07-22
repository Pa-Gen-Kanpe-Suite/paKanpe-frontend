import { authenticatedBackend, passthrough } from "@/lib/server-api";

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: Context) {
  const { path } = await context.params;
  const url = new URL(request.url);
  const destination = "/" + path.join("/") + url.search;
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const response = await authenticatedBackend(destination, {
    method: request.method,
    headers: hasBody ? { "Content-Type": request.headers.get("content-type") || "application/json" } : {},
    body: hasBody ? await request.arrayBuffer() : undefined,
  });
  return passthrough(response);
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const PUT = forward;
export const DELETE = forward;


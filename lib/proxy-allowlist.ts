const ALLOWED_READ_ONLY_ROUTES = new Set([
  "/services",
  "/display",
  "/queues/position",
  "/auth/me",
]);

export function isAllowedProxyRoute(method: string, path: string): boolean {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "");

  if (!normalizedPath) {
    return false;
  }

  if (normalizedPath.includes("..") || normalizedPath.includes("\\")) {
    return false;
  }

  if (method !== "GET") {
    return false;
  }

  if (normalizedPath.startsWith("queues/position/")) {
    return true;
  }

  return ALLOWED_READ_ONLY_ROUTES.has(`/${normalizedPath}`) || ALLOWED_READ_ONLY_ROUTES.has(`/${normalizedPath.split("/")[0]}`);
}

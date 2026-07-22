import { NextRequest, NextResponse } from "next/server";

const protectedAreas = ["/client/dashboard", "/agent", "/caissier", "/admin"];

export function proxy(request: NextRequest) {
  const protectedPath = protectedAreas.some((path) => request.nextUrl.pathname.startsWith(path));
  if (protectedPath && !request.cookies.get("pgk_session")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/client/dashboard/:path*", "/agent/:path*", "/caissier/:path*", "/admin/:path*"],
};

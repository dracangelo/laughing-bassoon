import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { enforceIpBlock } from "@/lib/ipBlock";

export function middleware(request: NextRequest) {
  const blocked = enforceIpBlock(request);
  if (blocked) return blocked;

  const protectedPath = request.nextUrl.pathname.startsWith("/admin");
  const hasSession = request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token");

  if (protectedPath && !hasSession) {
    const loginUrl = new URL("/account", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};

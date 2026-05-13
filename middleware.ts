import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { enforceIpBlock } from "@/lib/ipBlock";
import { verifySessionToken } from "@/lib/auth-token";
import { verifySignedResource } from "@/lib/resourceProtection";

export function middleware(request: NextRequest) {
  const blocked = enforceIpBlock(request);
  if (blocked) return blocked;

  const protectedPath =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/b2b") ||
    request.nextUrl.pathname.startsWith("/account/orders") ||
    request.nextUrl.pathname.startsWith("/account/invoices");
  const authCookie = request.cookies.get("ace_auth")?.value;
  const hasSession = request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token") || Boolean(authCookie);

  if (request.nextUrl.pathname.startsWith("/protected/")) {
    const expires = Number(request.nextUrl.searchParams.get("expires") || 0);
    const signature = request.nextUrl.searchParams.get("signature") || "";
    const valid = verifySignedResource(request.nextUrl.pathname, expires, signature);
    if (!valid && !authCookie) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  if (protectedPath && !hasSession) {
    const loginUrl = new URL("/account", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
    if (!authCookie) {
      const loginUrl = new URL("/account", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      const user = verifySessionToken(authCookie);
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/blocked", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/b2b", "/account/orders", "/account/invoices", "/protected/:path*"]
};

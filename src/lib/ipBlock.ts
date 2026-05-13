import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const blockedIps = new Map<string, string>([
  ["203.0.113.10", "/blocked"]
]);

export function getClientIp(request: NextRequest) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

export function enforceIpBlock(request: NextRequest) {
  const ip = getClientIp(request);
  const redirect = blockedIps.get(ip);
  if (!redirect) return null;
  return NextResponse.redirect(new URL(redirect, request.url));
}

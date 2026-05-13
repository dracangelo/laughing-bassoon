import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { signResource } from "@/lib/resourceProtection";

export async function GET(request: Request) {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const url = new URL(request.url);
  const path = "/protected/turbos";
  const signed = signResource(path, 900);
  return NextResponse.json({
    url: `${url.origin}${path}?expires=${signed.expires}&signature=${signed.signature}`
  });
}

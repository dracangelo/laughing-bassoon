import { NextResponse } from "next/server";
import { getSessionRecord } from "@/lib/data-access";
import { jsonError } from "@/lib/http";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sid = searchParams.get("sid");
  if (!sid) return jsonError("Missing session id");
  const session = await getSessionRecord(sid);
  const active = Boolean(session && !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now());
  return NextResponse.json({ active, session: active ? session : null });
}

import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { getLookupStats } from "@/lib/data-access";

export async function GET() {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  return NextResponse.json(await getLookupStats());
}

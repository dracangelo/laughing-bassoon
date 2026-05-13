import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { readAppData } from "@/lib/persistence";

export async function GET() {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const lookups = (await readAppData()).lookups;
  return NextResponse.json({
    totalLookups: lookups.length,
    apiCalls: lookups.filter((entry) => entry.source === "api").length,
    dbHits: lookups.filter((entry) => entry.source === "db").length,
    cacheHits: lookups.filter((entry) => entry.source === "cache").length
  });
}

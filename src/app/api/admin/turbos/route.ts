import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { readAppData } from "@/lib/persistence";
import { jsonError } from "@/lib/http";

export async function GET() {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  return NextResponse.json({ turbos: (await readAppData()).turbos });
}

import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { nextId, readAppData, updateAppData } from "@/lib/persistence";

export async function GET() {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  return NextResponse.json({ audits: (await readAppData()).auditRuns });
}

export async function POST() {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const audit = await updateAppData((data) => {
    const created = {
      id: nextId(data.auditRuns),
      provider: "Sucuri/Pentest Tools",
      status: "scheduled",
      notes: "External audit must be run with live credentials and public deployment URL.",
      createdAt: new Date().toISOString()
    };
    data.auditRuns.push(created);
    return created;
  });
  return NextResponse.json({ audit, status: "scheduled" });
}

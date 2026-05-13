import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { getSessions, revokeSessionRecord, revokeSessionsForUser } from "@/lib/data-access";

const revokeSchema = z.object({
  sessionId: z.string().optional(),
  userId: z.number().int().positive().optional(),
  exceptSessionId: z.string().optional()
});

export async function GET() {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  return NextResponse.json({ sessions: await getSessions() });
}

export async function DELETE(request: Request) {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = revokeSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid session revoke request");

  if (parsed.data.sessionId) {
    const session = await revokeSessionRecord(parsed.data.sessionId);
    if (!session) return jsonError("Session not found", 404);
    return NextResponse.json({ status: "revoked", session });
  }

  if (parsed.data.userId) {
    const sessions = await revokeSessionsForUser(parsed.data.userId, parsed.data.exceptSessionId);
    return NextResponse.json({ status: "revoked_user_sessions", sessions });
  }

  return jsonError("Provide a sessionId or userId");
}

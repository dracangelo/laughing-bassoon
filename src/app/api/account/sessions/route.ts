import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, requireSessionUser } from "@/lib/auth";
import { getSessions, revokeSessionRecord, revokeSessionsForUser } from "@/lib/data-access";
import { verifySessionToken } from "@/lib/auth-token";
import { cookies } from "next/headers";
import { jsonError } from "@/lib/http";

const schema = z.object({
  sessionId: z.string().optional(),
  revokeOthers: z.boolean().optional()
});

export async function GET() {
  const user = await requireSessionUser();
  return NextResponse.json({ user, sessions: await getSessions({ userId: user.id }) });
}

export async function DELETE(request: Request) {
  const user = await requireSessionUser();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid session action");

  const token = cookies().get("ace_auth")?.value;
  let currentSessionId: string | undefined;
  if (token) {
    try {
      currentSessionId = verifySessionToken(token).sid;
    } catch {
      currentSessionId = undefined;
    }
  }

  if (parsed.data.revokeOthers) {
    const sessions = await revokeSessionsForUser(user.id, currentSessionId);
    return NextResponse.json({ status: "revoked_others", sessions });
  }

  if (parsed.data.sessionId) {
    const target = await revokeSessionRecord(parsed.data.sessionId);
    if (!target || target.userId !== user.id) return jsonError("Session not found", 404);
    return NextResponse.json({ status: "revoked", session: target, currentUser: await getSessionUser() });
  }

  return jsonError("Provide a sessionId or revokeOthers flag");
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { authenticateUser, setAuthCookie } from "@/lib/auth";
import { createSessionToken } from "@/lib/auth-token";
import { jsonError } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128)
});

export async function POST(request: Request) {
  const limiter = await rateLimit("auth:login", 10, 60_000);
  if (!limiter.allowed) return jsonError("Too many login attempts. Please wait a moment.", 429);
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid login details");
  const user = await authenticateUser(parsed.data.email, parsed.data.password);
  if (!user) return jsonError("Invalid email or password", 401);
  const sessionId = crypto.randomUUID();
  await setAuthCookie(createSessionToken(user, sessionId), user, {
    sessionId,
    userAgent: request.headers.get("user-agent") || undefined,
    ipAddress: request.headers.get("x-forwarded-for") || undefined
  });
  return NextResponse.json({ user, status: "authenticated" });
}

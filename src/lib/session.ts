import crypto from "crypto";
import { cookies } from "next/headers";

const sessionCookieName = "ace_session";

export function getOrCreateSessionId() {
  const jar = cookies();
  const existing = jar.get(sessionCookieName)?.value;
  if (existing) return existing;
  const created = crypto.randomUUID();
  jar.set(sessionCookieName, created, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return created;
}

export function readSessionId() {
  return cookies().get(sessionCookieName)?.value || null;
}

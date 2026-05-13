import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { sanitizeText } from "@/lib/sanitize";
import { getRedis } from "@/lib/redis";
import { createSessionToken, verifySessionToken } from "@/lib/auth-token";
import { createSessionRecord, createUserRecord, findUserByEmail, getSessionRecord, revokeSessionRecord, touchSessionRecord } from "@/lib/data-access";

export type SessionUser = {
  id: number;
  email: string;
  role: "customer" | "b2b" | "admin";
  firstName: string;
  lastName: string;
  company?: string;
};

const authCookieName = "ace_auth";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  role?: "customer" | "b2b";
}) {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("An account already exists for that email address.");
  }

  const user = await createUserRecord({
      email,
      passwordHash: await bcrypt.hash(input.password, 10),
      role: input.role || "customer",
      firstName: sanitizeText(input.firstName, 40),
      lastName: sanitizeText(input.lastName, 40),
      phone: input.phone ? sanitizeText(input.phone, 32) : undefined,
      company: input.company ? sanitizeText(input.company, 80) : undefined
  });

  return toSessionUser(user);
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? toSessionUser(user) : null;
}

export async function setAuthCookie(token: string, user: SessionUser, metadata?: { sessionId?: string; userAgent?: string; ipAddress?: string }) {
  const sessionId = metadata?.sessionId || crypto.randomUUID();
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000).toISOString();
  await createSessionRecord({
    id: sessionId,
    userId: user.id,
    email: user.email,
    role: user.role,
    userAgent: metadata?.userAgent,
    ipAddress: metadata?.ipAddress,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    expiresAt
  });

  const redis = getRedis();
  if (redis) {
    redis.set(`session:${sessionId}`, "active", "EX", sessionLifetimeSeconds).catch(() => undefined);
  }
  cookies().set(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionLifetimeSeconds
  });
}

export async function clearAuthCookie() {
  const token = cookies().get(authCookieName)?.value;
  const redis = getRedis();
  if (token) {
    try {
      const payload = verifySessionToken(token);
      await revokeSessionRecord(payload.sid);
      if (redis) redis.del(`session:${payload.sid}`).catch(() => undefined);
    } catch {
      // no-op for invalid cookies
    }
  }
  cookies().set(authCookieName, "", { httpOnly: true, maxAge: 0, path: "/" });
}

export async function getSessionUser() {
  const token = cookies().get(authCookieName)?.value;
  if (!token) return null;
  try {
    const payload = verifySessionToken(token);
    const session = await getSessionRecord(payload.sid);
    if (!session || session.revokedAt || new Date(session.expiresAt).getTime() <= Date.now()) {
      return null;
    }
    const redis = getRedis();
    if (redis) {
      const active = await redis.get(`session:${payload.sid}`).catch(() => null);
      if (active !== "active") return null;
    }
    await touchSessionRecord(payload.sid);
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      company: payload.company
    };
  } catch {
    return null;
  }
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Authentication required");
  return user;
}

export function isAdmin(user: SessionUser | null) {
  return user?.role === "admin";
}

export function isB2B(user: SessionUser | null) {
  return user?.role === "b2b" || user?.role === "admin";
}

function toSessionUser(user: { id: number; email: string; role: "customer" | "b2b" | "admin"; firstName: string; lastName: string; company?: string }): SessionUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company
  };
}

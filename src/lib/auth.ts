import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { updateAppData, nextId, readAppData, type StoredUser } from "@/lib/persistence";
import { sanitizeText } from "@/lib/sanitize";
import { getRedis } from "@/lib/redis";
import { createSessionToken, verifySessionToken } from "@/lib/auth-token";

export type SessionUser = {
  id: number;
  email: string;
  role: "customer" | "b2b" | "admin";
  firstName: string;
  lastName: string;
  company?: string;
};

const authCookieName = "ace_auth";
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
  const existing = (await readAppData()).users.find((user) => user.email === email);
  if (existing) {
    throw new Error("An account already exists for that email address.");
  }

  const user = await updateAppData(async (data) => {
    const created: StoredUser = {
      id: nextId(data.users),
      email,
      passwordHash: await bcrypt.hash(input.password, 10),
      role: input.role || "customer",
      firstName: sanitizeText(input.firstName, 40),
      lastName: sanitizeText(input.lastName, 40),
      phone: input.phone ? sanitizeText(input.phone, 32) : undefined,
      company: input.company ? sanitizeText(input.company, 80) : undefined,
      createdAt: new Date().toISOString()
    };
    data.users.push(created);
    return created;
  });

  return toSessionUser(user);
}

export async function authenticateUser(email: string, password: string) {
  const user = (await readAppData()).users.find((entry) => entry.email === email.trim().toLowerCase());
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? toSessionUser(user) : null;
}

export function setAuthCookie(token: string) {
  const redis = getRedis();
  if (redis) {
    redis.set(`session:${token}`, "active", "EX", 60 * 60 * 24 * 7).catch(() => undefined);
  }
  cookies().set(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  const token = cookies().get(authCookieName)?.value;
  const redis = getRedis();
  if (token && redis) redis.del(`session:${token}`).catch(() => undefined);
  cookies().set(authCookieName, "", { httpOnly: true, maxAge: 0, path: "/" });
}

export function getSessionUser() {
  const token = cookies().get(authCookieName)?.value;
  if (!token) return null;
  try {
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function requireSessionUser() {
  const user = getSessionUser();
  if (!user) throw new Error("Authentication required");
  return user;
}

export function isAdmin(user: SessionUser | null) {
  return user?.role === "admin";
}

export function isB2B(user: SessionUser | null) {
  return user?.role === "b2b" || user?.role === "admin";
}

function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company
  };
}

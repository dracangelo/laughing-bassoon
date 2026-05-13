import jwt from "jsonwebtoken";
import type { SessionUser } from "@/lib/auth";

const sessionSecret = process.env.NEXTAUTH_SECRET || "dev-ace-turbo-secret";

export function createSessionToken(user: SessionUser) {
  return jwt.sign(user, sessionSecret, { expiresIn: "7d" });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, sessionSecret) as SessionUser;
}

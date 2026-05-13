import jwt from "jsonwebtoken";
import type { SessionUser } from "@/lib/auth";

const sessionSecret = process.env.NEXTAUTH_SECRET || "dev-ace-turbo-secret";

export type SessionTokenPayload = SessionUser & {
  sid: string;
  exp?: number;
  iat?: number;
};

export function createSessionToken(user: SessionUser, sid: string) {
  return jwt.sign({ ...user, sid }, sessionSecret, { expiresIn: "7d" });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, sessionSecret) as SessionTokenPayload;
}

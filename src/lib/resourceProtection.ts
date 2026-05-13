import crypto from "crypto";
import { getSessionUser } from "@/lib/auth";

const signingSecret = process.env.NEXTAUTH_SECRET || "dev-ace-turbo-secret";

export function signResource(path: string, expiresInSeconds = 900) {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `${path}:${expires}`;
  const signature = crypto.createHmac("sha256", signingSecret).update(payload).digest("hex");
  return { expires, signature };
}

export function verifySignedResource(path: string, expires: number, signature: string) {
  if (expires < Math.floor(Date.now() / 1000)) return false;
  const payload = `${path}:${expires}`;
  const expected = crypto.createHmac("sha256", signingSecret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function canAccessProtectedResources() {
  return Boolean(getSessionUser());
}

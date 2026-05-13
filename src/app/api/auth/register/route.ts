import { NextResponse } from "next/server";
import { z } from "zod";
import { registerUser, setAuthCookie } from "@/lib/auth";
import { createSessionToken } from "@/lib/auth-token";
import { jsonError } from "@/lib/http";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
  firstName: z.string().min(1).max(40),
  lastName: z.string().min(1).max(40),
  phone: z.string().max(40).optional(),
  company: z.string().max(80).optional(),
  role: z.enum(["customer", "b2b"]).default("customer")
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid registration details");
  const user = await registerUser(parsed.data);
  setAuthCookie(createSessionToken(user));
  return NextResponse.json({ user, status: "registered" }, { status: 201 });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactMessage, listContactMessages } from "@/lib/contact";
import { jsonError } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().min(10).max(2000)
});

export async function GET() {
  return NextResponse.json({ messages: await listContactMessages() });
}

export async function POST(request: Request) {
  const limiter = await rateLimit("contact:submit", 10, 60_000);
  if (!limiter.allowed) return jsonError("Too many contact submissions. Please try again later.", 429);
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid contact form data");
  return NextResponse.json({ message: await createContactMessage(parsed.data), status: "received" }, { status: 201 });
}

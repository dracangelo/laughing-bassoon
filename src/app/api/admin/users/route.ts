import { NextResponse } from "next/server";
import { z } from "zod";

const blockSchema = z.object({
  ipAddress: z.string().ip(),
  reason: z.string().min(3).max(160),
  redirectUrl: z.string().url().optional()
});

export async function POST(request: Request) {
  const parsed = blockSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid IP block request" }, { status: 400 });
  return NextResponse.json({ status: "ip_block_validated", block: parsed.data });
}

import { NextResponse } from "next/server";
import { z } from "zod";

const cartSchema = z.object({
  turboId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().max(20)
});

export async function POST(request: Request) {
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  return NextResponse.json({ item: parsed.data, status: "added" });
}

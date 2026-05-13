import { NextResponse } from "next/server";
import { z } from "zod";
import { addCartItem, buildCartView, clearCart, updateCartItem } from "@/lib/cart";
import { jsonError } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";

const cartSchema = z.object({
  turboId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().max(20)
});

export async function GET() {
  return NextResponse.json(await buildCartView());
}

export async function POST(request: Request) {
  const limiter = await rateLimit("cart:add", 40, 60_000);
  if (!limiter.allowed) return jsonError("Too many cart updates. Please slow down.", 429);

  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid cart item");
  const cart = await addCartItem(parsed.data.turboId, parsed.data.quantity);
  return NextResponse.json({ cart, status: "added" });
}

export async function PATCH(request: Request) {
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid cart item");
  const cart = await updateCartItem(parsed.data.turboId, parsed.data.quantity);
  return NextResponse.json({ cart, status: "updated" });
}

export async function DELETE() {
  const cart = await clearCart();
  return NextResponse.json({ cart, status: "cleared" });
}

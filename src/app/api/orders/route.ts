import { NextResponse } from "next/server";
import { orderSchema } from "@/validators/orderSchema";
import { createInvoiceNumber } from "@/lib/invoice";

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid order", issues: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    orderId: 1001,
    invoice: createInvoiceNumber(1001),
    status: "ready_for_stripe_checkout",
    order: parsed.data
  });
}

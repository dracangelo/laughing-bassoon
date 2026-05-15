import { NextResponse } from "next/server";
import Stripe from "stripe";
import { orderSchema } from "@/validators/orderSchema";
import { createOrderFromCart, listOrdersForCurrentUser } from "@/lib/orders";
import { stripe } from "@/lib/stripe";
import { jsonError } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";

export async function GET() {
  return NextResponse.json({ orders: await listOrdersForCurrentUser() });
}

export async function POST(request: Request) {
  const limiter = await rateLimit("orders:create", 10, 60_000);
  if (!limiter.allowed) return jsonError("Too many checkout attempts. Please try again shortly.", 429);

  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid order", issues: parsed.error.flatten() }, { status: 400 });

  const order = await createOrderFromCart({
    email: parsed.data.email,
    shippingAddress: parsed.data.address
  });

  if (!order) return NextResponse.json({ error: "Failed to create order" }, { status: 500 });

  if (!stripe) {
    return NextResponse.json({
      order,
      checkoutUrl: `/checkout?order=${order.id}&mock=1`,
      mode: "mock"
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/account/orders?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout?cancel=1`,
    customer_email: order.email,
    metadata: { orderId: String(order.id) },
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: { name: item.name, metadata: { sku: item.sku } }
      }
    }))
  });

  return NextResponse.json({
    order: { ...order, stripeSessionId: session.id },
    checkoutUrl: session.url,
    mode: "stripe"
  });
}

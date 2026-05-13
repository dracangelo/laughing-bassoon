import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { z } from "zod";
import { getAllOrders, updateOrderStatusRecord } from "@/lib/data-access";

const schema = z.object({
  id: z.number(),
  status: z.string().min(2)
});

export async function GET() {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  return NextResponse.json({ orders: await getAllOrders() });
}

export async function PATCH(request: Request) {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid order update");
  const order = await updateOrderStatusRecord(parsed.data.id, parsed.data.status);
  if (!order) return jsonError("Order not found", 404);
  return NextResponse.json({ order, status: "updated" });
}

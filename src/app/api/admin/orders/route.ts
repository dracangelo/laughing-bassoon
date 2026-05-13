import { NextResponse } from "next/server";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { readAppData, updateAppData } from "@/lib/persistence";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
  status: z.string().min(2)
});

export async function GET() {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  return NextResponse.json({ orders: (await readAppData()).orders });
}

export async function PATCH(request: Request) {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid order update");
  const order = await updateAppData((data) => {
    const existing = data.orders.find((entry) => entry.id === parsed.data.id);
    if (!existing) return null;
    existing.status = parsed.data.status;
    return existing;
  });
  if (!order) return jsonError("Order not found", 404);
  return NextResponse.json({ order, status: "updated" });
}

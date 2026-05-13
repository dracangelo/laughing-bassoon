import { readFile } from "fs/promises";
import path from "path";
import { getOrderById } from "@/lib/orders";
import { getSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return jsonError("Authentication required", 401);
  const order = await getOrderById(Number(params.id));
  if (!order) return jsonError("Order not found", 404);
  if (order.userId !== user.id && order.email !== user.email && user.role !== "admin") return jsonError("Forbidden", 403);
  if (!order.invoicePath) return jsonError("Invoice not generated yet", 404);

  const file = await readFile(order.invoicePath);
  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${path.basename(order.invoicePath)}"`
    }
  });
}

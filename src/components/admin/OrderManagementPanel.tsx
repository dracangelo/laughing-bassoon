"use client";

import { useState } from "react";
import type { StoredOrder } from "@/lib/persistence";

const statusOptions = ["pending", "paid", "processing", "fulfilled", "cancelled"];

export function OrderManagementPanel({ initialOrders }: { initialOrders: StoredOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [message, setMessage] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function updateStatus(id: number, status: string) {
    setPendingId(id);
    setMessage("");

    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status })
    });

    const data = await response.json();
    setPendingId(null);

    if (!response.ok) {
      setMessage(data.error || "Order update failed.");
      return;
    }

    setOrders((current) => current.map((order) => (order.id === id ? data.order : order)));
    setMessage(`Order ${data.order.invoiceNumber} updated to ${data.order.status}.`);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total orders", String(orders.length), "text-aceBlue"],
          ["Pending", String(orders.filter((order) => order.status.includes("pending")).length), "text-amber-300"],
          ["Paid", String(orders.filter((order) => order.status === "paid").length), "text-emerald-300"],
          ["Revenue", `GBP ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}`, "text-slate-100"]
        ].map(([label, value, tone]) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4" key={label}>
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className={`text-3xl font-black ${tone}`}>{value}</p>
          </article>
        ))}
      </div>
      {orders.map((order) => (
        <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={order.id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-black text-slate-100">{order.invoiceNumber}</h2>
              <p className="text-slate-400">
                {order.email} · GBP {order.total.toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {order.status} · {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-slate-500">{order.shippingAddress}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
                defaultValue={order.status}
                disabled={pendingId === order.id}
                onChange={(event) => updateStatus(order.id, event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 grid gap-2 rounded-[20px] border border-slate-800 bg-[#0f151b] p-4 text-sm text-slate-400">
            {order.items.map((item) => (
              <div className="flex items-start justify-between gap-3" key={`${order.id}-${item.sku}-${item.turboId}`}>
                <span>{item.name} x {item.quantity}</span>
                <span>GBP {(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
      {message ? <p className="text-sm text-slate-400">{message}</p> : null}
    </div>
  );
}

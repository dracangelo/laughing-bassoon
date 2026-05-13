import type { StoredOrder } from "@/lib/persistence";
import { OrderManagementPanel } from "@/components/admin/OrderManagementPanel";
import { getAllOrders } from "@/lib/data-access";

export default async function OrdersPage() {
  const orders = await getAllOrders();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">Order Management</h1>
      <p className="mt-3 text-slate-400">View, process, update orders and trigger invoice emails.</p>
      <div className="mt-6">
        <OrderManagementPanel initialOrders={orders as StoredOrder[]} />
      </div>
    </main>
  );
}

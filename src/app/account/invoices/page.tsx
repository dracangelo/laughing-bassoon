import type { StoredOrder } from "@/lib/persistence";
import { listOrdersForCurrentUser } from "@/lib/orders";

export default async function AccountInvoicesPage() {
  const orders = await listOrdersForCurrentUser();

  return (
    <main className="mx-auto max-w-[960px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Invoices</h1>
      <div className="grid gap-4">
        {orders.length ? orders.map((order: StoredOrder) => (
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6" key={order.id}>
            <h2 className="text-xl font-black text-slate-100">{order.invoiceNumber}</h2>
            <p className="mb-3 text-slate-400">Status: {order.status}</p>
            {order.invoicePath ? (
              <a className="rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href={`/api/orders/${order.id}/invoice`}>
                Download PDF
              </a>
            ) : (
              <p className="text-sm text-slate-500">Invoice becomes available after payment confirmation.</p>
            )}
          </article>
        )) : <p className="text-slate-400">No invoices available yet.</p>}
      </div>
    </main>
  );
}

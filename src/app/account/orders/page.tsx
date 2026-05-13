import Link from "next/link";
import { listOrdersForCurrentUser } from "@/lib/orders";

export default async function AccountOrdersPage() {
  const orders = await listOrdersForCurrentUser();

  return (
    <main className="mx-auto max-w-[960px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Order History</h1>
      <div className="grid gap-4">
        {orders.length ? orders.map((order) => (
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" key={order.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-100">{order.invoiceNumber}</h2>
                <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-100">GBP {order.total.toFixed(2)}</p>
                <p className="text-sm uppercase tracking-[0.15em] text-aceBlue">{order.status}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href={`/account/invoices?order=${order.id}`}>Download invoice</Link>
            </div>
          </article>
        )) : <p className="text-slate-400">No orders yet.</p>}
      </div>
    </main>
  );
}

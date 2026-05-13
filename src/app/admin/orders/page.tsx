import { readAppData } from "@/lib/persistence";

export default async function OrdersPage() {
  const orders = (await readAppData()).orders;
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">Order Management</h1>
      <p className="mt-3 text-slate-400">View, process, update orders and trigger invoice emails.</p>
      <div className="mt-6 grid gap-4">
        {orders.map((order) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={order.id}>
            <h2 className="font-black text-slate-100">{order.invoiceNumber}</h2>
            <p className="text-slate-400">{order.email} · {order.status} · GBP {order.total.toFixed(2)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

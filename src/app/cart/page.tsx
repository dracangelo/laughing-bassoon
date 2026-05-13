import Link from "next/link";
import { buildCartView } from "@/lib/cart";

export default async function CartPage() {
  const cart = await buildCartView();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Shopping Cart</h1>
      <section className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
        {cart.items.length ? (
          <>
            <div className="grid gap-4">
              {cart.items.map((item) => (
                <article className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4" key={item!.turboId}>
                  <div>
                    <h2 className="font-black text-slate-100">{item!.name}</h2>
                    <p className="text-sm text-slate-400">{item!.sku} · Qty {item!.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-100">GBP {item!.lineTotal.toFixed(2)}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg font-black text-slate-100">Total: GBP {cart.total.toFixed(2)}</p>
              <Link className="inline-flex rounded-full bg-aceBlue px-5 py-3 font-black text-[#081018]" href="/checkout">Secure checkout</Link>
            </div>
          </>
        ) : (
          <p className="text-slate-400">Your cart is empty.</p>
        )}
      </section>
    </main>
  );
}

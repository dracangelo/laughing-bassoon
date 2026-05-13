import Link from "next/link";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartItem, type CartLineItem } from "@/components/cart/CartItem";
import { buildCartView } from "@/lib/cart";

export default async function CartPage() {
  const cart = await buildCartView();
  const items = cart.items.filter((item): item is CartLineItem => Boolean(item));
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Shopping Cart</h1>
      <section className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
        {items.length ? (
          <>
            <div className="grid gap-4">
              {items.map((item) => (
                <CartItem item={item} key={item.turboId} />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg font-black text-slate-100">Total: GBP {cart.total.toFixed(2)}</p>
              <div className="flex flex-wrap gap-3">
                <CartDrawer items={items} total={cart.total} />
                <Link className="inline-flex rounded-full bg-aceBlue px-5 py-3 font-black text-[#081018]" href="/checkout">Secure checkout</Link>
              </div>
            </div>
          </>
        ) : (
          <p className="text-slate-400">Your cart is empty.</p>
        )}
      </section>
    </main>
  );
}

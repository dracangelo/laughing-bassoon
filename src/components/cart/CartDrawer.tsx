"use client";

import Link from "next/link";
import { useState } from "react";
import { CartItem, type CartLineItem } from "@/components/cart/CartItem";

export function CartDrawer({ items, total }: { items: CartLineItem[]; total: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200" onClick={() => setOpen(true)} type="button">
        Cart preview
      </button>
      {open ? (
        <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-800 bg-[#10161c] p-5 shadow-ace">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-100">Cart</h2>
            <button className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300" onClick={() => setOpen(false)} type="button">
              Close
            </button>
          </div>
          <div className="grid gap-4">
            {items.map((item) => <CartItem item={item} key={item.turboId} />)}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="font-black text-slate-100">GBP {total.toFixed(2)}</p>
            <Link className="rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href="/checkout">Checkout</Link>
          </div>
        </aside>
      ) : null}
    </>
  );
}

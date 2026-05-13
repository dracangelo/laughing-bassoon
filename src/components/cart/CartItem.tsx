export type CartLineItem = {
  turboId: number;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export function CartItem({ item }: { item: CartLineItem }) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <div>
        <h2 className="font-black text-slate-100">{item.name}</h2>
        <p className="text-sm text-slate-400">{item.sku} · Qty {item.quantity} · GBP {item.unitPrice.toFixed(2)} each</p>
      </div>
      <p className="font-bold text-slate-100">GBP {item.lineTotal.toFixed(2)}</p>
    </article>
  );
}

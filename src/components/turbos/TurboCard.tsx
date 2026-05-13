import Link from "next/link";
import type { StoredTurbo } from "@/lib/persistence";

export function TurboCard({ turbo, isTrade }: { turbo: StoredTurbo; isTrade: boolean }) {
  const price = isTrade && turbo.tradePrice ? turbo.tradePrice : turbo.price;

  return (
    <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-aceRed">{turbo.type}</p>
          <h2 className="mt-2 text-xl font-black text-slate-100">{turbo.sku}</h2>
        </div>
        <span className="rounded-full bg-[#0f151b] px-3 py-1 text-xs font-bold text-slate-400">{turbo.stock} stock</span>
      </div>
      <p className="mt-3 text-slate-400">{turbo.description}</p>
      <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-aceBlue">
        {isTrade ? "Trade" : "Retail"} GBP {price.toFixed(2)}
      </p>
      <Link className="mt-4 inline-flex rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href={`/turbos/${turbo.seoSlug}`}>
        View product
      </Link>
    </article>
  );
}

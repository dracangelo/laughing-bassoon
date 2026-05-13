import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser, isB2B } from "@/lib/auth";
import { readAppData } from "@/lib/persistence";

export const metadata: Metadata = {
  title: "Turbo Search",
  description: "Search Ace Turbo stock by make, model, year, engine, BHP and part number.",
  alternates: { canonical: "/turbos" }
};

export default async function TurbosPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const partNumber = typeof searchParams.partNumber === "string" ? searchParams.partNumber : "";
  const user = getSessionUser();
  const turbos = (await readAppData()).turbos.filter((item) => !partNumber || item.sku.includes(partNumber.toUpperCase()));

  return (
    <main className="mx-auto max-w-[1080px] px-4 py-12">
      <h1 className="mb-3 text-4xl font-black text-slate-100">Turbo Search</h1>
      <p className="mb-7 max-w-2xl text-slate-400">Filter stock by vehicle fitment or turbo part number. Trade users automatically see protected B2B pricing after sign-in.</p>
      <form className="grid gap-3 rounded-[28px] border border-slate-800 bg-[#141b22] p-5 shadow-ace md:grid-cols-6" action="/turbos">
        {["Make", "Model", "Year", "Engine", "BHP"].map((label) => (
          <label className="grid gap-1 text-sm font-bold text-slate-100" key={label}>
            {label}
            <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name={label.toLowerCase()} />
          </label>
        ))}
        <label className="grid gap-1 text-sm font-bold text-slate-100">
          Part
          <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="partNumber" defaultValue={partNumber} />
        </label>
        <button className="rounded-2xl bg-aceRed px-4 py-3 font-black text-[#140b0b] md:col-span-6" type="submit">Search stock</button>
      </form>
      <section className="mt-7 grid gap-4 md:grid-cols-2">
        {turbos.map((turbo) => (
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-5" key={turbo.sku}>
            <h2 className="text-xl font-black text-slate-100">{turbo.sku}</h2>
            <p className="text-slate-400">{turbo.description}</p>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-aceBlue">
              {isB2B(user) && turbo.tradePrice ? `Trade GBP ${turbo.tradePrice.toFixed(2)}` : `Retail GBP ${turbo.price.toFixed(2)}`}
            </p>
            <Link className="mt-4 inline-flex rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href={`/turbos/${turbo.seoSlug}`}>View product</Link>
          </article>
        ))}
      </section>
    </main>
  );
}

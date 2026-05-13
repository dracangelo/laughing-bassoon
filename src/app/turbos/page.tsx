import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turbo Search",
  description: "Search Ace Turbo stock by make, model, year, engine, BHP and part number.",
  alternates: { canonical: "/turbos" }
};

export default function TurbosPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const partNumber = typeof searchParams.partNumber === "string" ? searchParams.partNumber : "";

  return (
    <main className="mx-auto max-w-[1080px] px-4 py-12">
      <h1 className="mb-3 text-4xl font-black">Turbo Search</h1>
      <p className="mb-7 max-w-2xl text-slate-600">Filter stock by vehicle fitment or turbo part number. Production search connects to MySQL through Prisma with Zod validation on every request.</p>
      <form className="grid gap-3 bg-white p-5 shadow-ace md:grid-cols-6" action="/turbos">
        {["Make", "Model", "Year", "Engine", "BHP"].map((label) => (
          <label className="grid gap-1 text-sm font-bold" key={label}>
            {label}
            <input className="border border-slate-200 px-3 py-2" name={label.toLowerCase()} />
          </label>
        ))}
        <label className="grid gap-1 text-sm font-bold">
          Part
          <input className="border border-slate-200 px-3 py-2" name="partNumber" defaultValue={partNumber} />
        </label>
        <button className="bg-aceRed px-4 py-3 font-black text-white md:col-span-6" type="submit">Search stock</button>
      </form>
      <section className="mt-7 grid gap-4 md:grid-cols-2">
        {["ACE-GT1749V", "ACE-BW-K03"].map((sku) => (
          <article className="border border-slate-200 bg-white p-5" key={sku}>
            <h2 className="text-xl font-black">{sku}</h2>
            <p className="text-slate-600">OEM remanufactured turbocharger, product page and cart workflow ready.</p>
            <a className="mt-4 inline-flex bg-black px-4 py-2 font-bold text-white" href={`/turbos/${sku.toLowerCase()}`}>View product</a>
          </article>
        ))}
      </section>
    </main>
  );
}

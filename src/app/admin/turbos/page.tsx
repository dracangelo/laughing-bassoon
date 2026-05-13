import { readAppData } from "@/lib/persistence";

export default async function AdminTurbosPage() {
  const turbos = (await readAppData()).turbos;
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-5 text-4xl font-black text-slate-100">Turbo Data Entry</h1>
      <form className="grid gap-4 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace md:grid-cols-2" action="/api/turbos" method="post">
        {["SKU", "Make", "Model", "Engine", "BHP", "Price", "Stock", "Type"].map((field) => (
          <label className="grid gap-1 font-bold text-slate-100" key={field}>{field}<input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" required /></label>
        ))}
        <button className="rounded-2xl bg-aceRed px-5 py-3 font-black text-[#140b0b] md:col-span-2" type="submit">Validate and save draft</button>
      </form>
      <div className="mt-8 grid gap-4">
        {turbos.map((turbo) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={turbo.id}>
            <h2 className="font-black text-slate-100">{turbo.sku}</h2>
            <p className="text-slate-400">{turbo.make} {turbo.model} {turbo.engine}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

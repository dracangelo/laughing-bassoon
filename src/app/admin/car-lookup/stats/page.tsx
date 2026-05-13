import { readAppData } from "@/lib/persistence";

export default async function LookupStatsPage() {
  const lookups = (await readAppData()).lookups;
  const stats = [
    ["Total lookups", String(lookups.length)],
    ["API calls", String(lookups.filter((entry) => entry.source === "api").length)],
    ["DB hits", String(lookups.filter((entry) => entry.source === "db").length)],
    ["Cache hits", String(lookups.filter((entry) => entry.source === "cache").length)]
  ];

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-5 text-4xl font-black text-slate-100">Lookup Stats Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5 shadow-ace" key={label}>
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="text-4xl font-black text-slate-100">{value}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

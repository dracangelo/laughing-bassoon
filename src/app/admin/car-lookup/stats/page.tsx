export default function LookupStatsPage() {
  const stats = [
    ["Total lookups", "1,284"],
    ["API calls", "312"],
    ["DB hits", "654"],
    ["Cache hits", "318"]
  ];

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-5 text-4xl font-black">Lookup Stats Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <article className="bg-white p-5 shadow-ace" key={label}>
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="text-4xl font-black">{value}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

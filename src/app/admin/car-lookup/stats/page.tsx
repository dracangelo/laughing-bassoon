import { LookupStatsPanel } from "@/components/admin/LookupStatsPanel";
import { getLookupStats } from "@/lib/data-access";

export default async function LookupStatsPage() {
  const lookupStats = await getLookupStats();
  const stats = [
    ["Total lookups", String(lookupStats.totalLookups)],
    ["API calls", String(lookupStats.apiCalls)],
    ["DB hits", String(lookupStats.dbHits)],
    ["Cache hits", String(lookupStats.cacheHits)]
  ];

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-5 text-4xl font-black text-slate-100">Lookup Stats Dashboard</h1>
      <LookupStatsPanel
        stats={stats.map(([label, value], index) => ({
          label,
          value,
          tone: index === 0 ? "blue" : index === 1 ? "red" : index === 2 ? "amber" : "blue"
        }))}
      />
    </main>
  );
}

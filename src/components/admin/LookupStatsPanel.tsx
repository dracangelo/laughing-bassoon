export function LookupStatsPanel({ stats }: { stats: Array<{ label: string; value: string; tone?: "blue" | "red" | "amber" }> }) {
  const toneMap = {
    blue: "text-aceBlue",
    red: "text-aceRed",
    amber: "text-amber-300"
  } as const;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((item) => (
        <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5 shadow-ace" key={item.label}>
          <p className="text-sm font-bold text-slate-500">{item.label}</p>
          <p className={`text-4xl font-black ${toneMap[item.tone || "blue"]}`}>{item.value}</p>
        </article>
      ))}
    </div>
  );
}

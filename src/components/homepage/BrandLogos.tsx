const brands = [
  ["Continental", "The Future in Motion"],
  ["Mitsubishi", "Turbocharger"],
  ["Garrett", "Advancing Motion"],
  ["BorgWarner", "OEM systems"],
  ["IHI", "Turbo"],
  ["BMTS", "Technology"]
];

export function BrandLogos() {
  return (
    <section className="mx-auto -mt-8 grid max-w-[1180px] grid-cols-2 gap-3 px-4 pb-8 md:grid-cols-3 xl:grid-cols-6" aria-label="Turbocharger manufacturers">
      {brands.map(([name, strapline]) => (
        <div className="rounded-2xl border border-slate-800 bg-[#141b22] px-4 py-4 shadow-sm" key={name}>
          <strong className="block text-lg font-black uppercase tracking-[0.08em] text-slate-100">{name}</strong>
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{strapline}</span>
        </div>
      ))}
    </section>
  );
}

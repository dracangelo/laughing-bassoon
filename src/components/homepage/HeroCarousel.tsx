import { VehicleSearchForm } from "./VehicleSearchForm";

export function HeroCarousel() {
  return (
    <section className="ace-hero relative overflow-hidden border-b border-slate-800" aria-labelledby="heroTitle">
      <div className="machine-lines" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-10 px-4 pb-16 pt-24 md:grid-cols-[1.2fr_.8fr] md:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-aceBlue">Ace Turbo platform</p>
          <h1 id="heroTitle" className="max-w-3xl text-[clamp(40px,6vw,86px)] font-black uppercase leading-[0.92] tracking-[0.04em] text-slate-100">
            Turbo lookup built for real workshop speed.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Search by registration, part number, or exact vehicle fitment with a cleaner, more technical front end that feels like Ace Turbo rather than a clone of anyone else.
          </p>
        </div>
        <div className="relative rounded-[28px] border border-slate-700 bg-[#161d24] p-4 shadow-ace md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-100">Vehicle match</p>
              <p className="text-sm text-slate-400">Secure fitment search</p>
            </div>
            <div className="rounded-full border border-amber-700/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">DVLA ready</div>
          </div>
          <VehicleSearchForm />
        </div>
      </div>
    </section>
  );
}

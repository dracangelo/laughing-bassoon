export function TurboFilter({ defaults = {} }: { defaults?: Record<string, string> }) {
  const fields = ["Make", "Model", "Year", "Engine", "BHP"];

  return (
    <form className="grid gap-3 rounded-[28px] border border-slate-800 bg-[#141b22] p-5 shadow-ace md:grid-cols-6" action="/turbos">
      {fields.map((label) => {
        const name = label.toLowerCase();
        return (
          <label className="grid gap-1 text-sm font-bold text-slate-100" key={label}>
            {label}
            <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name={name} defaultValue={defaults[name] || ""} />
          </label>
        );
      })}
      <label className="grid gap-1 text-sm font-bold text-slate-100">
        Part
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="partNumber" defaultValue={defaults.partNumber || ""} />
      </label>
      <button className="rounded-2xl bg-aceRed px-4 py-3 font-black text-[#140b0b] md:col-span-6" type="submit">Search stock</button>
    </form>
  );
}

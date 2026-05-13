export default function AdminTurbosPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-5 text-4xl font-black">Turbo Data Entry</h1>
      <form className="grid gap-4 bg-white p-6 shadow-ace md:grid-cols-2">
        {["SKU", "Manufacturer", "Make", "Model", "Engine", "BHP", "Price", "Stock"].map((field) => (
          <label className="grid gap-1 font-bold" key={field}>{field}<input className="border border-slate-200 px-3 py-2" required /></label>
        ))}
        <button className="bg-aceRed px-5 py-3 font-black text-white md:col-span-2" type="submit">Validate and save draft</button>
      </form>
    </main>
  );
}

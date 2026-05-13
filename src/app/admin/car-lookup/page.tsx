export default function CarLookupViewerPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-4 text-4xl font-black">Car Reg Lookup Viewer</h1>
      <div className="overflow-hidden bg-white shadow-ace">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-white"><tr><th className="p-3">Reg</th><th>Make</th><th>Source</th><th>Time</th></tr></thead>
          <tbody><tr><td className="p-3">AB12CDE</td><td>Demo</td><td>cache</td><td>Today</td></tr></tbody>
        </table>
      </div>
    </main>
  );
}

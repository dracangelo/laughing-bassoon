import type { StoredLookup } from "@/lib/persistence";
import { getLookupRecords } from "@/lib/data-access";

export default async function CarLookupViewerPage() {
  const lookups = await getLookupRecords();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Car Reg Lookup Viewer</h1>
      <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#141b22] shadow-ace">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-white"><tr><th className="p-3">Reg</th><th>Source</th><th>IP</th><th>Time</th></tr></thead>
          <tbody>
            {lookups.map((lookup: StoredLookup) => (
              <tr className="border-t border-slate-800 text-slate-300" key={lookup.id}>
                <td className="p-3">{lookup.registration}</td>
                <td>{lookup.source}</td>
                <td>{lookup.userIp || "N/A"}</td>
                <td>{new Date(lookup.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

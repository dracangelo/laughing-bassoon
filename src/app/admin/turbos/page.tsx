import type { StoredTurbo } from "@/lib/persistence";
import { TurboDataEntry } from "@/components/admin/TurboDataEntry";
import { getTurbos } from "@/lib/data-access";

export default async function AdminTurbosPage() {
  const turbos = await getTurbos();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-5 text-4xl font-black text-slate-100">Turbo Data Entry</h1>
      <TurboDataEntry initialTurbos={turbos as StoredTurbo[]} />
    </main>
  );
}

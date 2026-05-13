import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { TurboCard } from "@/components/turbos/TurboCard";
import { TurboFilter } from "@/components/turbos/TurboFilter";
import { getSessionUser, isB2B } from "@/lib/auth";
import { getTurbos } from "@/lib/data-access";
import type { StoredTurbo } from "@/lib/persistence";

export const metadata: Metadata = {
  title: "Turbo Search",
  description: "Search Ace Turbo stock by make, model, year, engine, BHP and part number.",
  alternates: { canonical: "/turbos" }
};

export default async function TurbosPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const partNumber = typeof searchParams.partNumber === "string" ? searchParams.partNumber : "";
  const user = await getSessionUser();
  const turbos = await getTurbos({
    partNumber: partNumber ? partNumber.toUpperCase() : undefined,
    make: typeof searchParams.make === "string" ? searchParams.make : undefined,
    model: typeof searchParams.model === "string" ? searchParams.model : undefined,
    engine: typeof searchParams.engine === "string" ? searchParams.engine : undefined,
    year: typeof searchParams.year === "string" && searchParams.year ? Number(searchParams.year) : undefined,
    bhp: typeof searchParams.bhp === "string" && searchParams.bhp ? Number(searchParams.bhp) : undefined
  });

  return (
    <main className="mx-auto max-w-[1080px] px-4 py-12">
      <h1 className="mb-3 text-4xl font-black text-slate-100">Turbo Search</h1>
      <p className="mb-7 max-w-2xl text-slate-400">Filter stock by vehicle fitment or turbo part number. Trade users automatically see protected B2B pricing after sign-in.</p>
      <TurboFilter
        defaults={{
          partNumber,
          make: typeof searchParams.make === "string" ? searchParams.make : "",
          model: typeof searchParams.model === "string" ? searchParams.model : "",
          year: typeof searchParams.year === "string" ? searchParams.year : "",
          engine: typeof searchParams.engine === "string" ? searchParams.engine : "",
          bhp: typeof searchParams.bhp === "string" ? searchParams.bhp : ""
        }}
      />
      <AdSlot className="mt-6" slot="2480110010" />
      <section className="mt-7 grid gap-4 md:grid-cols-2">
        {turbos.map((turbo: StoredTurbo) => (
          <TurboCard isTrade={isB2B(user)} key={turbo.sku} turbo={turbo} />
        ))}
      </section>
    </main>
  );
}

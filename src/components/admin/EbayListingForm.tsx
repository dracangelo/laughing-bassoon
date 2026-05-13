"use client";

import { useMemo, useState } from "react";
import type { StoredEbayListing, StoredTurbo } from "@/lib/persistence";

export function EbayListingForm({
  initialListings,
  turbos
}: {
  initialListings: StoredEbayListing[];
  turbos: StoredTurbo[];
}) {
  const [listings, setListings] = useState(initialListings);
  const [selectedTurboId, setSelectedTurboId] = useState<string>(turbos[0] ? String(turbos[0].id) : "");
  const [listingType, setListingType] = useState<"Turbo" | "CHRA">("Turbo");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const selectedTurbo = useMemo(
    () => turbos.find((turbo) => turbo.id === Number(selectedTurboId)) || null,
    [selectedTurboId, turbos]
  );

  function hydrateFromTurbo(turbo: StoredTurbo | null, type: "Turbo" | "CHRA") {
    if (!turbo) return;
    setTitle(`${turbo.make} ${turbo.model} ${turbo.engine} ${type === "CHRA" ? "CHRA cartridge" : "turbocharger"} ${turbo.sku}`);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTurbo) {
      setMessage("Select a turbo record first.");
      return;
    }

    setPending(true);
    setMessage("");

    const response = await fetch("/api/ebay", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        turboId: selectedTurbo.id,
        listingType,
        turboNumber: selectedTurbo.sku,
        title
      })
    });

    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(data.error || "Could not create eBay listing.");
      return;
    }

    setListings((current) => [data.listing, ...current]);
    setMessage(data.listing.ready === false ? "Draft created. Add eBay credentials to submit live." : "Listing submitted to eBay.");
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form className="grid gap-4 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-black text-slate-100">Create listing</h2>
        <label className="grid gap-1 text-sm font-bold text-slate-200">
          Turbo record
          <select
            className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedTurboId(nextId);
              hydrateFromTurbo(turbos.find((turbo) => turbo.id === Number(nextId)) || null, listingType);
            }}
            value={selectedTurboId}
          >
            {turbos.map((turbo) => (
              <option key={turbo.id} value={turbo.id}>
                {turbo.sku} · {turbo.make} {turbo.model} {turbo.engine}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-slate-200">
          Listing type
          <select
            className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
            onChange={(event) => {
              const nextType = event.target.value as "Turbo" | "CHRA";
              setListingType(nextType);
              hydrateFromTurbo(selectedTurbo, nextType);
            }}
            value={listingType}
          >
            <option value="Turbo">Turbo</option>
            <option value="CHRA">CHRA</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-slate-200">
          Listing title
          <input
            className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Listing title"
            required
            value={title}
          />
        </label>
        <div className="rounded-[24px] border border-slate-800 bg-[#0f151b] p-4 text-sm text-slate-400">
          <p className="font-bold text-slate-200">Selected turbo</p>
          {selectedTurbo ? (
            <p className="mt-2">
              {selectedTurbo.sku} · retail GBP {selectedTurbo.price.toFixed(2)}
              {selectedTurbo.tradePrice ? ` · trade GBP ${selectedTurbo.tradePrice.toFixed(2)}` : ""}
            </p>
          ) : (
            <p className="mt-2">No turbo selected.</p>
          )}
        </div>
        <button className="rounded-2xl bg-aceBlue px-5 py-3 font-black text-[#081018]" disabled={pending} type="submit">
          {pending ? "Submitting..." : "Create listing draft"}
        </button>
        {message ? <p className="text-sm text-slate-400">{message}</p> : null}
      </form>

      <div className="grid gap-4">
        {listings.map((listing) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={listing.id}>
            <h2 className="font-black text-slate-100">{listing.title}</h2>
            <p className="mt-1 text-slate-400">
              {listing.listingType} · {listing.status} · {listing.turboNumber}
            </p>
            {listing.ebayItemId ? <p className="mt-1 text-sm text-slate-500">eBay item: {listing.ebayItemId}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

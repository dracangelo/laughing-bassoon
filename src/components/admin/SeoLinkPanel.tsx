"use client";

import { useState } from "react";
import type { StoredTurbo } from "@/lib/persistence";

export function SeoLinkPanel({ turbos }: { turbos: StoredTurbo[] }) {
  const [selectedTurboId, setSelectedTurboId] = useState<string>(turbos[0] ? String(turbos[0].id) : "");
  const [campaign, setCampaign] = useState("trade-retargeting");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ path: string; campaignUrl: string } | null>(null);

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const turbo = turbos.find((entry) => entry.id === Number(selectedTurboId));
    if (!turbo) {
      setMessage("Pick a turbo to generate SEO links.");
      return;
    }

    const response = await fetch("/api/seo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        make: turbo.make,
        model: turbo.model,
        engine: turbo.engine,
        sku: turbo.sku,
        campaign
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Could not generate SEO links.");
      return;
    }

    setResult(data);
    setMessage("Canonical and campaign links generated.");
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form className="grid gap-4 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" onSubmit={handleGenerate}>
        <h2 className="text-2xl font-black text-slate-100">Generate SEO links</h2>
        <label className="grid gap-1 text-sm font-bold text-slate-200">
          Turbo record
          <select
            className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
            onChange={(event) => setSelectedTurboId(event.target.value)}
            value={selectedTurboId}
          >
            {turbos.map((turbo) => (
              <option key={turbo.id} value={turbo.id}>
                {turbo.sku} · {turbo.make} {turbo.model}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-slate-200">
          Campaign name
          <input
            className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
            onChange={(event) => setCampaign(event.target.value)}
            value={campaign}
          />
        </label>
        <button className="rounded-2xl bg-aceBlue px-5 py-3 font-black text-[#081018]" type="submit">
          Generate links
        </button>
        {message ? <p className="text-sm text-slate-400">{message}</p> : null}
      </form>

      <div className="grid gap-4">
        <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-aceBlue">Canonical</p>
          <p className="mt-3 break-all rounded-2xl border border-slate-800 bg-[#0f151b] px-4 py-3 text-sm text-slate-300">
            {result?.path || "/turbos/example-slug"}
          </p>
        </article>
        <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-aceRed">Campaign URL</p>
          <p className="mt-3 break-all rounded-2xl border border-slate-800 bg-[#0f151b] px-4 py-3 text-sm text-slate-300">
            {result?.campaignUrl || "/turbos/example-slug?utm_source=google&utm_medium=cpc&utm_campaign=trade-retargeting"}
          </p>
        </article>
      </div>
    </div>
  );
}

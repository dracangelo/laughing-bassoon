"use client";

import { useMemo, useState } from "react";
import type { StoredTurbo } from "@/lib/persistence";

type FormState = {
  sku: string;
  make: string;
  model: string;
  year: string;
  engine: string;
  bhp: string;
  type: string;
  price: string;
  stock: string;
  seoSlug: string;
};

type ValidationIssues = Partial<Record<keyof FormState, string[]>>;

const emptyForm: FormState = {
  sku: "",
  make: "",
  model: "",
  year: "",
  engine: "",
  bhp: "",
  type: "",
  price: "",
  stock: "0",
  seoSlug: ""
};

function mapTurboToForm(turbo: StoredTurbo): FormState {
  return {
    sku: turbo.sku,
    make: turbo.make,
    model: turbo.model,
    year: turbo.year ? String(turbo.year) : "",
    engine: turbo.engine,
    bhp: turbo.bhp ? String(turbo.bhp) : "",
    type: turbo.type,
    price: turbo.price.toString(),
    stock: turbo.stock.toString(),
    seoSlug: turbo.seoSlug
  };
}

export function TurboDataEntry({ initialTurbos }: { initialTurbos: StoredTurbo[] }) {
  const [turbos, setTurbos] = useState(initialTurbos);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [issues, setIssues] = useState<ValidationIssues>({});
  const [pending, setPending] = useState(false);

  const selectedTurbo = useMemo(
    () => turbos.find((turbo) => turbo.id === selectedId) || null,
    [selectedId, turbos]
  );

  function setField(name: keyof FormState, value: string) {
    setIssues((current) => ({ ...current, [name]: undefined }));
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setIssues({});

    const payload = {
      sku: form.sku,
      make: form.make,
      model: form.model,
      year: form.year ? Number(form.year) : undefined,
      engine: form.engine,
      bhp: form.bhp ? Number(form.bhp) : undefined,
      type: form.type,
      price: Number(form.price),
      stock: Number(form.stock),
      seoSlug: form.seoSlug || undefined
    };

    const response = await fetch(selectedId ? `/api/turbos/${selectedId}` : "/api/turbos", {
      method: selectedId ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      if (data.issues?.fieldErrors) {
        setIssues(data.issues.fieldErrors as ValidationIssues);
      }
      setMessage(data.error || "Turbo save failed.");
      return;
    }

    const turbo = data.turbo as StoredTurbo;
    setTurbos((current) => {
      if (selectedId) {
        return current.map((item) => (item.id === turbo.id ? turbo : item));
      }

      return [turbo, ...current];
    });

    setMessage(selectedId ? "Turbo updated." : "Turbo created.");
    setSelectedId(turbo.id);
    setForm(mapTurboToForm(turbo));
  }

  async function handleDelete(id: number) {
    setPending(true);
    setMessage("");

    const response = await fetch(`/api/turbos/${id}`, { method: "DELETE" });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(data.error || "Turbo delete failed.");
      return;
    }

    setTurbos((current) => current.filter((turbo) => turbo.id !== id));
    if (selectedId === id) resetForm();
    setMessage("Turbo removed.");
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <form className="grid gap-4 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace md:grid-cols-2" onSubmit={handleSubmit}>
        {[
          ["sku", "SKU"],
          ["make", "Make"],
          ["model", "Model"],
          ["engine", "Engine"],
          ["year", "Year"],
          ["bhp", "BHP"],
          ["type", "Type"],
          ["price", "Price"],
          ["stock", "Stock"],
          ["seoSlug", "SEO slug"]
        ].map(([name, label]) => (
          <label className="grid gap-1 font-bold text-slate-100" key={name}>
            {label}
            <input
              className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
              name={name}
              onChange={(event) => setField(name as keyof FormState, event.target.value)}
              required={name !== "seoSlug" && name !== "year" && name !== "bhp"}
              value={form[name as keyof FormState]}
            />
            {issues[name as keyof FormState]?.map((issue) => (
              <span className="text-xs font-medium text-red-300" key={issue}>{issue}</span>
            ))}
          </label>
        ))}
        {Object.values(issues).some(Boolean) ? (
          <div className="rounded-[20px] border border-red-950 bg-red-950/40 p-4 text-sm text-red-200 md:col-span-2">
            <p className="font-black uppercase tracking-[0.14em]">Validation summary</p>
            <ul className="mt-2 grid gap-1">
              {Object.entries(issues).flatMap(([field, fieldIssues]) => (fieldIssues || []).map((issue) => (
                <li key={`${field}-${issue}`}>{field}: {issue}</li>
              )))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button className="rounded-2xl bg-aceRed px-5 py-3 font-black text-[#140b0b]" disabled={pending} type="submit">
            {pending ? "Saving..." : selectedTurbo ? "Update turbo" : "Create turbo"}
          </button>
          <button
            className="rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-200"
            disabled={pending}
            onClick={resetForm}
            type="button"
          >
            New entry
          </button>
          {selectedTurbo ? (
            <button
              className="rounded-2xl border border-red-900 bg-red-950/60 px-5 py-3 font-black text-red-200"
              disabled={pending}
              onClick={() => handleDelete(selectedTurbo.id)}
              type="button"
            >
              Delete turbo
            </button>
          ) : null}
        </div>
        {message ? <p className="text-sm text-slate-400 md:col-span-2">{message}</p> : null}
      </form>

      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4">
            <p className="text-sm font-bold text-slate-500">Tracked SKUs</p>
            <p className="text-3xl font-black text-aceBlue">{turbos.length}</p>
          </article>
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4">
            <p className="text-sm font-bold text-slate-500">Low stock</p>
            <p className="text-3xl font-black text-amber-300">{turbos.filter((turbo) => turbo.stock < 3).length}</p>
          </article>
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4">
            <p className="text-sm font-bold text-slate-500">Avg retail</p>
            <p className="text-3xl font-black text-slate-100">
              GBP {turbos.length ? (turbos.reduce((sum, turbo) => sum + turbo.price, 0) / turbos.length).toFixed(0) : "0"}
            </p>
          </article>
        </div>
        {turbos.map((turbo) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={turbo.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-slate-100">{turbo.sku}</h2>
                <p className="text-slate-400">
                  {turbo.make} {turbo.model} {turbo.engine}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  GBP {turbo.price.toFixed(2)} · stock {turbo.stock} · {turbo.type}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Updated {new Date(turbo.updatedAt).toLocaleDateString()}</p>
              </div>
              <button
                className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200"
                onClick={() => {
                  setSelectedId(turbo.id);
                  setForm(mapTurboToForm(turbo));
                }}
                type="button"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

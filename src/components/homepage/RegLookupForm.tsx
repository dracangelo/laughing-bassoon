"use client";

import { useState } from "react";
import { sanitizeRegistration } from "@/lib/sanitize-strings";

export function RegLookupForm() {
  const [message, setMessage] = useState("");

  async function submitReg(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const registration = sanitizeRegistration(String(form.get("registration") || ""));
    const response = await fetch("/api/car-lookup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ registration })
    });
    const data = await response.json();
    setMessage(data.message || `Lookup recorded from ${data.source}.`);
  }

  return (
    <aside className="angle-panel rounded-[28px] border border-slate-800 bg-[#141b22] px-4 py-5 shadow-ace" aria-label="Find your turbo">
      <h2 className="mb-1 pl-3 text-sm font-black uppercase tracking-[0.18em] text-slate-100">Find Your Turbo</h2>
      <p className="mb-4 pl-3 text-xs uppercase tracking-[0.18em] text-slate-500">Reg, serial or vehicle search</p>
      <form className="mb-2" onSubmit={submitReg}>
        <label className="mb-1 block pl-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="registration">Registration</label>
        <div className="grid grid-cols-[auto_1fr_auto] overflow-hidden rounded-2xl border border-slate-700 bg-[#0e1419]">
          <span className="grid place-items-center bg-aceBlue px-3 text-[10px] font-bold text-white">UK</span>
          <input id="registration" name="registration" className="min-w-0 bg-transparent px-3 py-3 font-black uppercase text-slate-100 outline-none" maxLength={12} placeholder="AB12CDE" required />
          <button className="bg-slate-950 px-4 text-xs font-black uppercase tracking-[0.12em] text-white" type="submit">Check</button>
        </div>
      </form>
      <p className="my-3 pl-3 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">or</p>
      <form className="mb-2" action="/turbos">
        <label className="mb-1 block pl-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="turboNumber">Turbo Number</label>
        <div className="grid grid-cols-[1fr_auto] overflow-hidden rounded-2xl border border-slate-700 bg-[#0e1419]">
          <input id="turboNumber" name="turboNumber" className="min-w-0 bg-transparent px-3 py-3 text-sm text-slate-200 outline-none" maxLength={32} placeholder="753420-5006S" />
          <button className="bg-[#1a232c] px-4 text-xs font-black uppercase tracking-[0.12em] text-aceBlue" type="submit">Find</button>
        </div>
      </form>
      <p className="my-3 pl-3 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">or</p>
      <form className="grid gap-2" action="/turbos">
        <label className="pl-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Vehicle Details</label>
        {["Select Make:", "Select Model:", "Select Year", "Engine Size", "Select BHP"].map((label) => (
          <select className="w-full rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-[12px] text-slate-300" key={label} required>
            <option value="">{label}</option>
            <option>Alfa Romeo</option>
            <option>BMW</option>
          </select>
        ))}
        <button className="mt-2 h-11 rounded-2xl bg-aceRed text-xs font-black uppercase tracking-[0.18em] text-[#140b0b]" type="submit">Search Vehicle</button>
      </form>
      {message ? <p className="mt-3 pl-3 text-xs text-aceBlueDeep">{message}</p> : null}
    </aside>
  );
}

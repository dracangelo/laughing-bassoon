"use client";

import { useState } from "react";

export function VehicleSearchForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid grid-cols-1 gap-3 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("Vehicle search validated. Backend turbo matching endpoint is ready to connect.");
      }}
    >
      <select className="h-11 rounded-2xl border border-slate-700 bg-[#0f151b] px-4 text-slate-200" name="make" required defaultValue="Alfa Romeo">
        <option>Alfa Romeo</option>
        <option>Audi</option>
        <option>BMW</option>
        <option>Ford</option>
        <option>Mercedes-Benz</option>
        <option>Volkswagen</option>
      </select>
      <select className="h-11 rounded-2xl border border-slate-700 bg-[#0f151b] px-4 text-slate-200" name="model" required defaultValue="146">
        <option>146</option>
        <option>Giulietta</option>
        <option>A3</option>
        <option>Focus</option>
        <option>Golf</option>
      </select>
      <select className="h-11 rounded-2xl border border-slate-700 bg-[#0f151b] px-4 text-slate-200" name="engine" required defaultValue="">
        <option value="">Select Engine</option>
        <option>1.6 Diesel</option>
        <option>1.9 JTD</option>
        <option>2.0 TDI</option>
      </select>
      <button type="submit" className="h-11 rounded-2xl bg-aceBlue px-4 font-bold text-[#081018]">Find matching turbos</button>
      {message ? <p className="md:col-span-2 text-sm text-slate-400">{message}</p> : null}
    </form>
  );
}

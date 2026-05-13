"use client";

import { useState } from "react";

export function AuthPanel() {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const mode = String(form.get("mode"));
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form))
    });
    const data = await response.json();
    setMessage(data.error || `${mode === "login" ? "Signed in" : "Registered"} successfully.`);
    if (response.ok) window.location.href = "/account/orders";
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form className="grid gap-3 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" onSubmit={submit}>
        <h2 className="text-2xl font-black text-slate-100">Sign in</h2>
        <input type="hidden" name="mode" value="login" />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" type="email" name="email" placeholder="Email" required />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" type="password" name="password" placeholder="Password" required />
        <button className="rounded-2xl bg-aceBlue px-4 py-3 font-black text-[#081018]" type="submit">Sign in</button>
      </form>
      <form className="grid gap-3 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" onSubmit={submit}>
        <h2 className="text-2xl font-black text-slate-100">Register</h2>
        <input type="hidden" name="mode" value="register" />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="firstName" placeholder="First name" required />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="lastName" placeholder="Last name" required />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" type="email" name="email" placeholder="Email" required />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" type="password" name="password" placeholder="Password (12+ chars)" required />
        <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="company" placeholder="Company (optional)" />
        <select className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="role" defaultValue="customer">
          <option value="customer">Customer</option>
          <option value="b2b">B2B trade account</option>
        </select>
        <button className="rounded-2xl bg-aceRed px-4 py-3 font-black text-[#140b0b]" type="submit">Create account</button>
      </form>
      {message ? <p className="md:col-span-2 text-sm text-slate-400">{message}</p> : null}
    </div>
  );
}

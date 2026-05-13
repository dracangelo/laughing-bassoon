"use client";

import { useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form))
    });
    const data = await response.json();
    setMessage(data.error || "Message received. We will get back to you shortly.");
  }

  return (
    <form className="grid gap-3 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" onSubmit={submit}>
      <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="name" placeholder="Name" required />
      <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" type="email" name="email" placeholder="Email" required />
      <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="phone" placeholder="Phone" />
      <textarea className="min-h-40 rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-3 text-slate-100" name="message" placeholder="How can we help?" required />
      <button className="rounded-2xl bg-aceBlue px-4 py-3 font-black text-[#081018]" type="submit">Send message</button>
      {message ? <p className="text-sm text-slate-400">{message}</p> : null}
    </form>
  );
}

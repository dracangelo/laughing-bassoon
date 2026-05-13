"use client";

import { useState } from "react";

export function CheckoutPanel() {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: [{ turboId: 1, quantity: 1 }],
        email: form.get("email"),
        address: form.get("address")
      })
    });
    const data = await response.json();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }
    setMessage(data.error || "Order created.");
  }

  return (
    <form className="grid gap-4 rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace" onSubmit={submit}>
      <label className="grid gap-1 font-bold text-slate-100">Email <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="email" type="email" required /></label>
      <label className="grid gap-1 font-bold text-slate-100">Delivery address <textarea className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="address" required /></label>
      <button className="rounded-2xl bg-aceBlue px-5 py-3 font-black text-[#081018]" type="submit">Continue to payment</button>
      {message ? <p className="text-sm text-slate-400">{message}</p> : null}
    </form>
  );
}

"use client";

import { useState } from "react";

export function AddToCartButton({ turboId }: { turboId: number }) {
  const [message, setMessage] = useState("");

  async function add() {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ turboId, quantity: 1 })
    });
    const data = await response.json();
    setMessage(data.error || "Added to cart.");
  }

  return (
    <div className="grid gap-2">
      <button className="w-full rounded-full bg-aceRed px-4 py-3 font-black text-[#140b0b]" onClick={add} type="button">Add to cart</button>
      {message ? <p className="text-sm text-slate-400">{message}</p> : null}
    </div>
  );
}

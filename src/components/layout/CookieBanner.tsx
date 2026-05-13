"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem("ace-cookie-preference"));
  }, []);

  function choose(value: "analytics" | "essential") {
    localStorage.setItem("ace-cookie-preference", value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="fixed inset-x-4 bottom-4 z-50 flex flex-col items-stretch justify-center gap-3 bg-slate-950 p-4 text-white shadow-ace md:flex-row md:items-center" aria-label="Cookie consent">
      <p className="m-0 text-sm">We use essential cookies and optional analytics cookies for visitor reporting and AdWords measurement.</p>
      <button className="border border-white/30 px-3 py-2" type="button" onClick={() => choose("analytics")}>Accept</button>
      <button className="border border-white/30 px-3 py-2" type="button" onClick={() => choose("essential")}>Essential only</button>
    </section>
  );
}

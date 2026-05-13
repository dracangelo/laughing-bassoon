import Script from "next/script";

export function AdSlot({
  slot,
  label = "Sponsored",
  className = ""
}: {
  slot: string;
  label?: string;
  className?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <aside className={`rounded-[24px] border border-slate-800 bg-[#111820] p-4 ${className}`} aria-label={label}>
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      {client ? (
        <>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <ins
            className="adsbygoogle block min-h-[120px]"
            data-ad-client={client}
            data-ad-format="auto"
            data-ad-slot={slot}
            data-full-width-responsive="true"
          />
          <Script id={`adsense-${slot}`} strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </>
      ) : (
        <div className="grid min-h-[120px] place-items-center rounded-2xl border border-dashed border-slate-700 bg-[#0d1319] px-4 text-center text-sm text-slate-500">
          Ad placement zone · configure NEXT_PUBLIC_ADSENSE_CLIENT and slot {slot}
        </div>
      )}
    </aside>
  );
}

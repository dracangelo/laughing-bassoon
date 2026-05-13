import Script from "next/script";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getTurboContent } from "@/lib/turboContent";
import type { StoredTurbo } from "@/lib/persistence";

export function TurboDetail({
  turbo,
  price,
  isTrade
}: {
  turbo: StoredTurbo;
  price: number;
  isTrade: boolean;
}) {
  const content = getTurboContent(turbo);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${turbo.make} ${turbo.model} ${turbo.engine} Turbocharger`,
    sku: turbo.sku,
    image: content.gallery.map((item) => item.src),
    description: turbo.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price,
      availability: turbo.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-12">
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_360px]">
        <section className="grid gap-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px]">
            <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
              <div className="overflow-hidden rounded-[22px] border border-slate-800 bg-[#0f151b]">
                <img alt={content.gallery[0].alt} className="block aspect-[4/3] w-full object-cover" src={content.gallery[0].src} />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {content.highlights.map((highlight) => (
                  <span className="rounded-full border border-slate-700 bg-[#0f151b] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-200" key={highlight}>
                    {highlight}
                  </span>
                ))}
              </div>
            </article>

            <div className="grid gap-4">
              {content.gallery.slice(1).map((image) => (
                <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4" key={image.src}>
                  <div className="overflow-hidden rounded-[18px] border border-slate-800 bg-[#0f151b]">
                    <img alt={image.alt} className="block aspect-[4/3] w-full object-cover" src={image.src} />
                  </div>
                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">{image.label}</p>
                </article>
              ))}
            </div>
          </div>

          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-7 shadow-ace">
            <p className="mb-2 text-sm font-black uppercase text-aceRed">{turbo.type}</p>
            <h1 className="mb-4 text-4xl font-black text-slate-100">{turbo.make} {turbo.model} {turbo.engine}</h1>
            <p className="max-w-3xl text-slate-400">{turbo.description}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-lg font-black text-slate-100">Technical specification</h2>
                <dl className="grid gap-3">
                  {content.technicalSpecs.map((item) => (
                    <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3 text-sm" key={item.label}>
                      <dt className="font-bold text-slate-500">{item.label}</dt>
                      <dd className="text-right text-slate-200">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h2 className="mb-3 text-lg font-black text-slate-100">Warranty & service</h2>
                <p className="text-sm leading-7 text-slate-300">{content.warrantySummary}</p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-400">
                  {content.serviceNotes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "OEM references", items: content.oemNumbers },
              { title: "Included in the box", items: content.included },
              { title: "Fitment notes", items: content.fitmentNotes },
              { title: "Inspection checklist", items: content.inspectionChecklist }
            ].map((section) => (
              <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={section.title}>
                <h2 className="mb-3 text-lg font-black text-slate-100">{section.title}</h2>
                <ul className="grid gap-2 text-sm leading-6 text-slate-400">
                  {section.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <aside className="grid h-fit gap-4">
          <article className="rounded-[28px] bg-slate-950 p-7 text-white shadow-ace">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{isTrade ? "Protected trade price" : "Retail price"}</p>
            <p className="mt-2 text-3xl font-black">GBP {price.toFixed(2)}</p>
            <p className="mb-6 text-slate-300">{turbo.stock > 0 ? `${turbo.stock} units in stock` : "Out of stock"}</p>
            <AddToCartButton turboId={turbo.id} />
          </article>
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5">
            <h2 className="mb-3 text-lg font-black text-slate-100">Workshop guidance</h2>
            <ul className="grid gap-2 text-sm leading-6 text-slate-400">
              <li>• Confirm OE reference before dispatch.</li>
              <li>• Replace oil feed consumables where contamination is present.</li>
              <li>• Retain diagnostic notes for warranty-backed claims.</li>
            </ul>
          </article>
        </aside>
      </div>
    </main>
  );
}

const items = [
  ["Secure Shopping Cart", "Persistent cart, Stripe-ready checkout and invoice/email workflow."],
  ["SEO & Ads", "Clean URLs, Schema.org product data, sitemap and AdWords placement zones."],
  ["eBay Listing Tools", "Create Turbo or CHRA listing drafts from the product database."],
  ["Abuse Controls", "Middleware hooks for IP blocks, redirects, rate limits and protected resources."]
];

export function FeaturedTurbos() {
  return (
    <section className="mx-auto mb-12 grid max-w-[1180px] grid-cols-1 gap-4 px-4 md:grid-cols-4" aria-label="Website capability modules">
      {items.map(([title, body]) => (
        <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-5 shadow-sm" key={title}>
          <h2 className="mb-2 text-lg font-black uppercase tracking-[0.04em] text-slate-100">{title}</h2>
          <p className="text-sm leading-relaxed text-slate-400">{body}</p>
        </article>
      ))}
    </section>
  );
}

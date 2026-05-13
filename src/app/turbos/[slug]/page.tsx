import type { Metadata } from "next";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getSessionUser, isB2B } from "@/lib/auth";
import { readAppData } from "@/lib/persistence";
import Script from "next/script";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return {
    title: params.slug.toUpperCase(),
    description: "SEO optimised turbo product page with product schema hooks, stock, pricing and add-to-cart.",
    alternates: { canonical: `/turbos/${params.slug}` }
  };
}

export default async function TurboDetailPage({ params }: { params: { slug: string } }) {
  const user = getSessionUser();
  const turbo = (await readAppData()).turbos.find((entry) => entry.seoSlug === params.slug);
  if (!turbo) return <main className="mx-auto max-w-[900px] px-4 py-12 text-slate-400">Turbo not found.</main>;
  const price = isB2B(user) && turbo.tradePrice ? turbo.tradePrice : turbo.price;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${turbo.make} ${turbo.model} ${turbo.engine} Turbocharger`,
    sku: turbo.sku,
    image: turbo.images,
    description: turbo.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price,
      availability: turbo.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="mx-auto grid max-w-[1080px] gap-8 px-4 py-12 md:grid-cols-[1fr_360px]">
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <section className="rounded-[28px] border border-slate-800 bg-[#141b22] p-7 shadow-ace">
        <p className="mb-2 text-sm font-black uppercase text-aceRed">{turbo.type}</p>
        <h1 className="mb-4 text-4xl font-black text-slate-100">{turbo.make} {turbo.model} {turbo.engine}</h1>
        <p className="text-slate-400">{turbo.description}</p>
        <dl className="mt-6 grid gap-2 text-slate-300">
          <div><dt className="font-bold">SKU</dt><dd>{turbo.sku}</dd></div>
          <div><dt className="font-bold">BHP</dt><dd>{turbo.bhp || "N/A"}</dd></div>
          <div><dt className="font-bold">Stock</dt><dd>{turbo.stock}</dd></div>
        </dl>
      </section>
      <aside className="rounded-[28px] bg-slate-950 p-7 text-white">
        <p className="text-3xl font-black">GBP {price.toFixed(2)}</p>
        <p className="mb-6 text-slate-300">In stock</p>
        {isB2B(user) ? <p className="mb-4 text-sm uppercase tracking-[0.16em] text-aceBlue">Protected trade price</p> : null}
        <AddToCartButton turboId={turbo.id} />
      </aside>
    </main>
  );
}

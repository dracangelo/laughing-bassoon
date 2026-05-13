import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return {
    title: params.slug.toUpperCase(),
    description: "SEO optimised turbo product page with product schema hooks, stock, pricing and add-to-cart.",
    alternates: { canonical: `/turbos/${params.slug}` }
  };
}

export default function TurboDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main className="mx-auto grid max-w-[1080px] gap-8 px-4 py-12 md:grid-cols-[1fr_360px]">
      <section className="bg-white p-7 shadow-ace">
        <p className="mb-2 text-sm font-black uppercase text-aceRed">OEM remanufactured</p>
        <h1 className="mb-4 text-4xl font-black">{params.slug.toUpperCase()}</h1>
        <p className="text-slate-600">Product specifications, compatible vehicles, images and Schema.org product markup belong here once current Ace Turbo data is migrated.</p>
      </section>
      <aside className="bg-slate-950 p-7 text-white">
        <p className="text-3xl font-black">GBP 295.00</p>
        <p className="mb-6 text-slate-300">In stock</p>
        <button className="w-full bg-aceRed px-4 py-3 font-black" type="button">Add to cart</button>
      </aside>
    </main>
  );
}

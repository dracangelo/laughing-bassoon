import type { Metadata } from "next";
import { TurboDetail } from "@/components/turbos/TurboDetail";
import { getSessionUser, isB2B } from "@/lib/auth";
import { getTurboBySlug } from "@/lib/data-access";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return {
    title: params.slug.toUpperCase(),
    description: "SEO optimised turbo product page with product schema hooks, stock, pricing and add-to-cart.",
    alternates: { canonical: `/turbos/${params.slug}` }
  };
}

export default async function TurboDetailPage({ params }: { params: { slug: string } }) {
  const user = await getSessionUser();
  const turbo = await getTurboBySlug(params.slug);
  if (!turbo) return <main className="mx-auto max-w-[900px] px-4 py-12 text-slate-400">Turbo not found.</main>;
  const price = isB2B(user) && turbo.tradePrice ? turbo.tradePrice : turbo.price;
  return <TurboDetail isTrade={isB2B(user)} price={price} turbo={turbo} />;
}

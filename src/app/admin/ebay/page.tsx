import { readAppData } from "@/lib/persistence";

export default async function EbayPage() {
  const listings = (await readAppData()).ebayListings;
  return <main className="mx-auto max-w-[900px] px-4 py-10"><h1 className="text-4xl font-black text-slate-100">eBay Listing Manager</h1><p className="mt-3 text-slate-400">Select product records to generate Turbo and CHRA Trading API listing drafts.</p><div className="mt-6 grid gap-4">{listings.map((listing) => <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={listing.id}><h2 className="font-black text-slate-100">{listing.title}</h2><p className="text-slate-400">{listing.listingType} · {listing.status}</p></article>)}</div></main>;
}

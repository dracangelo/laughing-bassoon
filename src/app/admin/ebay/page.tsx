import { EbayListingForm } from "@/components/admin/EbayListingForm";
import { getTurbos } from "@/lib/data-access";
import { readAppData } from "@/lib/persistence";

export default async function EbayPage() {
  const [listings, turbos] = await Promise.all([readAppData().then((data) => data.ebayListings), getTurbos()]);
  return (
    <main className="mx-auto max-w-[1180px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">eBay Listing Manager</h1>
      <p className="mt-3 text-slate-400">Select product records, generate Turbo or CHRA drafts, and submit live when eBay credentials are configured.</p>
      <div className="mt-6">
        <EbayListingForm initialListings={listings} turbos={turbos} />
      </div>
    </main>
  );
}

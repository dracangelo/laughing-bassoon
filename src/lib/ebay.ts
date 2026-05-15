import { sanitizePartNumber } from "@/lib/sanitize-strings";

export function createEbayListingDraft(input: { listingType: "Turbo" | "CHRA"; turboNumber: string; title: string }) {
  return {
    title: input.title.slice(0, 80),
    category: input.listingType === "CHRA" ? "CHRA Cartridge" : "Turbocharger",
    turboNumber: sanitizePartNumber(input.turboNumber),
    readyForTradingApi: Boolean(process.env.EBAY_AUTH_TOKEN)
  };
}

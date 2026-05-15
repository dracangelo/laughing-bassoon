import axios from "axios";
import { nextId, updateAppData } from "@/lib/persistence";
import { sanitizeText } from "@/lib/sanitize";
import { sanitizePartNumber } from "@/lib/sanitize-strings";

export async function submitEbayListing(input: {
  turboId?: number;
  listingType: "Turbo" | "CHRA";
  title: string;
  turboNumber: string;
}) {
  const draft = await updateAppData((data) => {
    const created = {
      id: nextId(data.ebayListings),
      turboId: input.turboId,
      listingType: input.listingType,
      title: sanitizeText(input.title, 80),
      turboNumber: sanitizePartNumber(input.turboNumber),
      status: "draft" as const,
      createdAt: new Date().toISOString()
    };
    data.ebayListings.push(created);
    return created;
  });

  if (!process.env.EBAY_AUTH_TOKEN) {
    return { ...draft, status: "draft", ready: false };
  }

  try {
    const response = await axios.post(
      "https://api.ebay.com/ws/api.dll",
      {
        title: draft.title,
        category: draft.listingType,
        turboNumber: draft.turboNumber
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EBAY_AUTH_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    await updateAppData((data) => {
      const listing = data.ebayListings.find((entry) => entry.id === draft.id);
      if (listing) {
        listing.status = "submitted";
        listing.ebayItemId = String(response.data?.itemId || "");
      }
    });

    return { ...draft, status: "submitted" as const, ebayItemId: String(response.data?.itemId || "") };
  } catch {
    await updateAppData((data) => {
      const listing = data.ebayListings.find((entry) => entry.id === draft.id);
      if (listing) listing.status = "failed";
    });
    return { ...draft, status: "failed" as const };
  }
}

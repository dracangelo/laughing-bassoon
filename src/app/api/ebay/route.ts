import { NextResponse } from "next/server";
import { z } from "zod";
import { createEbayListingDraft } from "@/lib/ebay";

const schema = z.object({
  listingType: z.enum(["Turbo", "CHRA"]),
  turboNumber: z.string().min(3),
  title: z.string().min(3)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid eBay listing request" }, { status: 400 });
  return NextResponse.json({ draft: createEbayListingDraft(parsed.data) });
}

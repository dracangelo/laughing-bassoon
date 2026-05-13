import { NextResponse } from "next/server";
import { z } from "zod";
import { submitEbayListing } from "@/lib/ebayTrading";
import { jsonError } from "@/lib/http";

const schema = z.object({
  turboId: z.number().optional(),
  listingType: z.enum(["Turbo", "CHRA"]),
  turboNumber: z.string().min(3),
  title: z.string().min(3)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid eBay listing request");
  return NextResponse.json({ listing: await submitEbayListing(parsed.data) });
}

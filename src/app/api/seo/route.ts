import { NextResponse } from "next/server";
import { z } from "zod";
import { campaignUrl, turboSeoUrl } from "@/lib/seoGenerator";

const schema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  engine: z.string().min(1),
  sku: z.string().min(1),
  campaign: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid SEO request" }, { status: 400 });
  const path = turboSeoUrl(parsed.data);
  return NextResponse.json({ path, campaignUrl: campaignUrl(path, parsed.data.campaign) });
}

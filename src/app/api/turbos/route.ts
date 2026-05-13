import { NextResponse } from "next/server";
import { turboSchema, turboSearchSchema } from "@/validators/turboSchema";
import { jsonError } from "@/lib/http";
import { createTurboRecord, getTurbos } from "@/lib/data-access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = turboSearchSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return jsonError("Invalid search");

  const results = await getTurbos(parsed.data);
  return NextResponse.json({ results });
}

export async function POST(request: Request) {
  const parsed = turboSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid turbo data", issues: parsed.error.flatten() }, { status: 400 });
  }

  const turbo = await createTurboRecord({
    sku: parsed.data.sku,
    make: parsed.data.make,
    model: parsed.data.model,
    year: parsed.data.year,
    engine: parsed.data.engine,
    bhp: parsed.data.bhp,
    type: parsed.data.type,
    price: parsed.data.price,
    tradePrice: Math.round(parsed.data.price * 0.9 * 100) / 100,
    stock: parsed.data.stock,
    seoSlug: parsed.data.seoSlug || parsed.data.sku.toLowerCase(),
    description: `${parsed.data.make} ${parsed.data.model} ${parsed.data.engine} turbocharger`,
    images: ["/images/ace-turbo-preview.svg"]
  });

  return NextResponse.json({ turbo, status: "created" }, { status: 201 });
}

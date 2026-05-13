import { NextResponse } from "next/server";
import { turboSchema, turboSearchSchema } from "@/validators/turboSchema";

const demoTurbos = [
  { id: 1, sku: "ACE-GT1749V", make: "Alfa Romeo", model: "146", engine: "1.9 JTD", bhp: 150, price: 295, stock: 8, seoSlug: "alfa-romeo-146-19-jtd-ace-gt1749v" },
  { id: 2, sku: "ACE-BW-K03", make: "Volkswagen", model: "Golf", engine: "2.0 TDI", bhp: 140, price: 325, stock: 5, seoSlug: "volkswagen-golf-20-tdi-ace-bw-k03" }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = turboSearchSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid search" }, { status: 400 });

  const filters = parsed.data;
  const results = demoTurbos.filter((turbo) => {
    if (filters.partNumber && !turbo.sku.includes(filters.partNumber)) return false;
    if (filters.make && turbo.make !== filters.make) return false;
    if (filters.model && turbo.model !== filters.model) return false;
    return true;
  });
  return NextResponse.json({ results });
}

export async function POST(request: Request) {
  const parsed = turboSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid turbo data", issues: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ turbo: parsed.data, status: "validated" }, { status: 201 });
}

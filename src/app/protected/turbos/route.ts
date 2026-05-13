import { readAppData } from "@/lib/persistence";

export async function GET() {
  const data = await readAppData();
  const header = ["sku", "make", "model", "engine", "price", "tradePrice", "stock"];
  const rows = data.turbos.map((turbo) =>
    [turbo.sku, turbo.make, turbo.model, turbo.engine, turbo.price, turbo.tradePrice || "", turbo.stock].join(",")
  );
  return new Response([header.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ace-turbos.csv"'
    }
  });
}

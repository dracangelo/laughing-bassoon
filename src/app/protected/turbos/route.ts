import type { StoredTurbo } from "@/lib/persistence";
import { getTurbos } from "@/lib/data-access";

export async function GET() {
  const data = await getTurbos();
  const header = ["sku", "make", "model", "engine", "price", "tradePrice", "stock"];
  const rows = data.map((turbo: StoredTurbo) =>
    [turbo.sku, turbo.make, turbo.model, turbo.engine, turbo.price, turbo.tradePrice || "", turbo.stock].join(",")
  );
  return new Response([header.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ace-turbos.csv"'
    }
  });
}

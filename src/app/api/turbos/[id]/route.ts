import { NextResponse } from "next/server";
import { turboSchema } from "@/validators/turboSchema";
import { readAppData, updateAppData } from "@/lib/persistence";
import { jsonError } from "@/lib/http";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const turbo = (await readAppData()).turbos.find((entry) => entry.id === Number(params.id));
  if (!turbo) return jsonError("Turbo not found", 404);
  return NextResponse.json({ turbo });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const parsed = turboSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid turbo data");

  const turbo = await updateAppData((data) => {
    const existing = data.turbos.find((entry) => entry.id === Number(params.id));
    if (!existing) return null;
    Object.assign(existing, parsed.data, { updatedAt: new Date().toISOString() });
    return existing;
  });

  if (!turbo) return jsonError("Turbo not found", 404);
  return NextResponse.json({ turbo, status: "updated" });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const deleted = await updateAppData((data) => {
    const index = data.turbos.findIndex((entry) => entry.id === Number(params.id));
    if (index < 0) return null;
    return data.turbos.splice(index, 1)[0];
  });

  if (!deleted) return jsonError("Turbo not found", 404);
  return NextResponse.json({ status: "deleted" });
}

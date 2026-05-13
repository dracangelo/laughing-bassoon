import { NextResponse } from "next/server";
import { turboSchema } from "@/validators/turboSchema";
import { jsonError } from "@/lib/http";
import { deleteTurboRecord, getTurboById, updateTurboRecord } from "@/lib/data-access";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const turbo = await getTurboById(Number(params.id));
  if (!turbo) return jsonError("Turbo not found", 404);
  return NextResponse.json({ turbo });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const parsed = turboSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid turbo data");

  const turbo = await updateTurboRecord(Number(params.id), parsed.data);

  if (!turbo) return jsonError("Turbo not found", 404);
  return NextResponse.json({ turbo, status: "updated" });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const deleted = await deleteTurboRecord(Number(params.id));

  if (!deleted) return jsonError("Turbo not found", 404);
  return NextResponse.json({ status: "deleted" });
}

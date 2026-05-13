import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { syncCloudflareIpBlock } from "@/lib/cloudflare";
import { createIpBlockRecord, deleteIpBlockRecord, getIpBlocks, getUsers, updateUserRoleRecord } from "@/lib/data-access";

const blockSchema = z.object({
  ipAddress: z.string().ip(),
  reason: z.string().min(3).max(160),
  redirectUrl: z.string().url().optional()
});

const userUpdateSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(["customer", "b2b", "admin"])
});

const blockDeleteSchema = z.object({
  blockId: z.number().int().positive()
});

export async function GET() {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const [users, ipBlocks] = await Promise.all([getUsers(), getIpBlocks()]);
  return NextResponse.json({ users, ipBlocks });
}

export async function POST(request: Request) {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = blockSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid IP block request");

  const block = await createIpBlockRecord({
    ipAddress: parsed.data.ipAddress,
    reason: parsed.data.reason,
    redirectUrl: parsed.data.redirectUrl
  });

  await syncCloudflareIpBlock(block.ipAddress, block.reason);
  return NextResponse.json({ status: "ip_blocked", block });
}

export async function PATCH(request: Request) {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = userUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid user update");

  const updated = await updateUserRoleRecord(parsed.data.userId, parsed.data.role);

  if (!updated) return jsonError("User not found", 404);
  return NextResponse.json({ status: "user_updated", user: updated });
}

export async function DELETE(request: Request) {
  const user = await requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = blockDeleteSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid IP block delete request");
  const deleted = await deleteIpBlockRecord(parsed.data.blockId);
  if (!deleted) return jsonError("IP block not found", 404);
  return NextResponse.json({ status: "ip_block_removed", block: deleted });
}

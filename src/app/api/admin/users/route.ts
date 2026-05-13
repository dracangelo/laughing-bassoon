import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin, requireSessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { nextId, readAppData, updateAppData } from "@/lib/persistence";
import { syncCloudflareIpBlock } from "@/lib/cloudflare";

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
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const data = await readAppData();
  return NextResponse.json({ users: data.users, ipBlocks: data.ipBlocks });
}

export async function POST(request: Request) {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = blockSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid IP block request");

  const block = await updateAppData((data) => {
    const created = {
      id: nextId(data.ipBlocks),
      ipAddress: parsed.data.ipAddress,
      reason: parsed.data.reason,
      redirectUrl: parsed.data.redirectUrl,
      blockedAt: new Date().toISOString()
    };
    data.ipBlocks.push(created);
    return created;
  });

  await syncCloudflareIpBlock(block.ipAddress, block.reason);
  return NextResponse.json({ status: "ip_blocked", block });
}

export async function PATCH(request: Request) {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = userUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid user update");

  const updated = await updateAppData((data) => {
    const existing = data.users.find((entry) => entry.id === parsed.data.userId);
    if (!existing) return null;
    existing.role = parsed.data.role;
    return existing;
  });

  if (!updated) return jsonError("User not found", 404);
  return NextResponse.json({ status: "user_updated", user: updated });
}

export async function DELETE(request: Request) {
  const user = requireSessionUser();
  if (!isAdmin(user)) return jsonError("Admin access required", 403);
  const parsed = blockDeleteSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid IP block delete request");
  const deleted = await updateAppData((data) => {
    const index = data.ipBlocks.findIndex((entry) => entry.id === parsed.data.blockId);
    if (index < 0) return null;
    return data.ipBlocks.splice(index, 1)[0];
  });
  if (!deleted) return jsonError("IP block not found", 404);
  return NextResponse.json({ status: "ip_block_removed", block: deleted });
}

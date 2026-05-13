import { NextResponse } from "next/server";
import { listBlogPosts, upsertBlogPost } from "@/lib/blog";
import { z } from "zod";
import { jsonError } from "@/lib/http";

const schema = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  title: z.string().min(5),
  excerpt: z.string().min(10),
  body: z.string().min(30),
  coverImage: z.string().optional(),
  publishedAt: z.string(),
  tags: z.array(z.string()).default([])
});

export async function GET() {
  return NextResponse.json({ posts: await listBlogPosts() });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Invalid blog post payload");
  return NextResponse.json({ post: await upsertBlogPost(parsed.data), status: "saved" });
}

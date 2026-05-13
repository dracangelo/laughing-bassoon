import { readAppData, updateAppData, nextId, type StoredBlogPost } from "@/lib/persistence";
import { sanitizeText, slugify } from "@/lib/sanitize";

export async function listBlogPosts() {
  return (await readAppData()).blogPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBlogPost(slug: string) {
  return (await readAppData()).blogPosts.find((post) => post.slug === slug) || null;
}

export async function upsertBlogPost(input: Omit<StoredBlogPost, "id" | "slug"> & { id?: number; slug?: string }) {
  return updateAppData((data) => {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title);
    const record: StoredBlogPost = {
      id: input.id || nextId(data.blogPosts),
      slug,
      title: sanitizeText(input.title, 120),
      excerpt: sanitizeText(input.excerpt, 200),
      body: sanitizeText(input.body, 5000),
      coverImage: input.coverImage,
      publishedAt: input.publishedAt,
      tags: input.tags.map((tag) => slugify(tag))
    };
    const index = data.blogPosts.findIndex((post) => post.id === record.id);
    if (index >= 0) data.blogPosts[index] = record;
    else data.blogPosts.push(record);
    return record;
  });
}

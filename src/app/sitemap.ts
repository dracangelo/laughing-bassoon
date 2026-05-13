import type { MetadataRoute } from "next";
import { listBlogPosts } from "@/lib/blog";
import { getTurbos } from "@/lib/data-access";
import type { StoredBlogPost, StoredTurbo } from "@/lib/persistence";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXTAUTH_URL || "https://aceturbo.co.uk").replace(/\/$/, "");
  const [turbos, posts] = await Promise.all([getTurbos(), listBlogPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${base}/turbos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${base}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${base}/news`,
      lastModified: posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${base}/b2b`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];

  const turboRoutes: MetadataRoute.Sitemap = turbos.map((turbo: StoredTurbo) => ({
    url: `${base}/turbos/${turbo.seoSlug}`,
    lastModified: new Date(turbo.updatedAt || turbo.createdAt),
    changeFrequency: "weekly",
    priority: 0.85
  }));

  const newsRoutes: MetadataRoute.Sitemap = posts.map((post: StoredBlogPost) => ({
    url: `${base}/news/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [...staticRoutes, ...turboRoutes, ...newsRoutes];
}

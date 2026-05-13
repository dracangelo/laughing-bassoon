import type { Metadata } from "next";
import { getBlogPost } from "@/lib/blog";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  return {
    title: post?.title || "News",
    description: post?.excerpt || "Ace Turbo news and advice",
    alternates: { canonical: `/news/${params.slug}` }
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) return <main className="mx-auto max-w-[900px] px-4 py-12 text-slate-400">Article not found.</main>;

  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-aceBlue">{post.tags.join(" · ")}</p>
      <h1 className="mb-4 text-5xl font-black text-slate-100">{post.title}</h1>
      <p className="mb-8 text-lg text-slate-400">{post.excerpt}</p>
      <article className="rounded-[32px] border border-slate-800 bg-[#141b22] p-8 text-slate-300">
        <p className="leading-8">{post.body}</p>
      </article>
    </main>
  );
}

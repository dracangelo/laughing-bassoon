import Link from "next/link";
import { listBlogPosts } from "@/lib/blog";

export default async function NewsPage() {
  const posts = await listBlogPosts();
  return (
    <main className="mx-auto max-w-[980px] px-4 py-12">
      <h1 className="mb-3 text-4xl font-black text-slate-100">Advice & News</h1>
      <p className="mb-8 text-slate-400">SEO content pages for diagnostics, buying advice, workshop workflow, and maintenance.</p>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6" key={post.id}>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-aceBlue">{new Date(post.publishedAt).toLocaleDateString()}</p>
            <h2 className="text-2xl font-black text-slate-100">{post.title}</h2>
            <p className="mt-3 text-slate-400">{post.excerpt}</p>
            <Link className="mt-4 inline-flex rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href={`/news/${post.slug}`}>Read article</Link>
          </article>
        ))}
      </div>
    </main>
  );
}

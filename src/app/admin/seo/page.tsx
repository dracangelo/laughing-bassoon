import { SeoLinkPanel } from "@/components/admin/SeoLinkPanel";
import { getTurbos } from "@/lib/data-access";

export default async function SeoPage() {
  const turbos = await getTurbos();
  return (
    <main className="mx-auto max-w-[1180px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">SEO Link Generator</h1>
      <p className="mt-3 text-slate-400">Create canonical product URLs and campaign-tagged links from live turbo records through `/api/seo`.</p>
      <div className="mt-6">
        <SeoLinkPanel turbos={turbos} />
      </div>
    </main>
  );
}

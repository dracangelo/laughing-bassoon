import { readAppData } from "@/lib/persistence";

export default async function AuditPage() {
  const audits = (await readAppData()).auditRuns;
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">Security Audit</h1>
      <p className="mt-3 text-slate-400">Track external audit scheduling before launch.</p>
      <div className="mt-6 grid gap-4">
        {audits.map((audit) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={audit.id}>
            <h2 className="font-black text-slate-100">{audit.provider}</h2>
            <p className="text-slate-400">{audit.status}</p>
            <p className="text-sm text-slate-500">{audit.notes}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

import { getSessionUser, isB2B } from "@/lib/auth";
import Link from "next/link";

export default async function B2BPage() {
  const user = await getSessionUser();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">B2B Area</h1>
      <section className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
        {isB2B(user) ? (
          <>
            <p className="text-slate-300">Trade pricing, protected product resources and account sessions are active for your account.</p>
            <Link className="mt-4 inline-flex rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href="/turbos">Browse trade stock</Link>
          </>
        ) : (
          <p className="text-slate-400">This area is password-protected. Register for a B2B account or ask us to upgrade your existing login.</p>
        )}
      </section>
    </main>
  );
}

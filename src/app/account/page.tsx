import { cookies } from "next/headers";
import Link from "next/link";
import { AccountSessionPanel } from "@/components/account/AccountSessionPanel";
import { AuthPanel } from "@/components/account/AuthPanel";
import { getSessionUser } from "@/lib/auth";
import { verifySessionToken } from "@/lib/auth-token";
import { getSessions } from "@/lib/data-access";

export default async function AccountPage() {
  const user = await getSessionUser();
  const sessions = user ? await getSessions({ userId: user.id }) : [];
  const token = cookies().get("ace_auth")?.value;
  const currentSessionId = token ? (() => {
    try {
      return verifySessionToken(token).sid;
    } catch {
      return undefined;
    }
  })() : undefined;

  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Account</h1>
      <p className="mb-6 text-slate-400">Register, sign in, review order history, manage active sessions, and download invoice PDFs.</p>
      {user ? (
        <div className="grid gap-6">
          <section className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
            <p className="text-sm uppercase tracking-[0.16em] text-aceBlue">Signed in as</p>
            <h2 className="mt-2 text-2xl font-black text-slate-100">{user.firstName} {user.lastName}</h2>
            <p className="mt-1 text-slate-400">{user.email} · {user.role}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href="/account/orders">Order history</Link>
              <Link className="rounded-full border border-slate-700 px-4 py-2 font-bold text-slate-200" href="/account/invoices">Invoices</Link>
            </div>
          </section>
          <AccountSessionPanel currentSessionId={currentSessionId} initialSessions={sessions} />
        </div>
      ) : (
        <AuthPanel />
      )}
    </main>
  );
}

import { AuthPanel } from "@/components/account/AuthPanel";

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Account</h1>
      <p className="mb-6 text-slate-400">Register, sign in, review order history and download invoice PDFs.</p>
      <AuthPanel />
    </main>
  );
}

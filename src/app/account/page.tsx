export default function AccountPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black">Account</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <form className="grid gap-3 bg-white p-6 shadow-ace">
          <h2 className="text-2xl font-black">Login</h2>
          <input className="border border-slate-200 px-3 py-2" type="email" placeholder="Email" />
          <input className="border border-slate-200 px-3 py-2" type="password" placeholder="Password" />
          <button className="bg-black px-4 py-3 font-black text-white" type="submit">Sign in</button>
        </form>
        <section className="bg-white p-6 shadow-ace">
          <h2 className="mb-2 text-2xl font-black">Orders & invoices</h2>
          <p className="text-slate-600">Order history and invoice downloads will be available after authentication is connected.</p>
        </section>
      </div>
    </main>
  );
}

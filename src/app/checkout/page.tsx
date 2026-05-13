export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black">Secure Checkout</h1>
      <form className="grid gap-4 bg-white p-6 shadow-ace">
        <label className="grid gap-1 font-bold">Email <input className="border border-slate-200 px-3 py-2" type="email" required /></label>
        <label className="grid gap-1 font-bold">Delivery address <textarea className="border border-slate-200 px-3 py-2" required /></label>
        <button className="bg-aceRed px-5 py-3 font-black text-white" type="submit">Continue to Stripe</button>
      </form>
    </main>
  );
}

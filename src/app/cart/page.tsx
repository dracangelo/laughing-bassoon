export default function CartPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black">Shopping Cart</h1>
      <section className="bg-white p-6 shadow-ace">
        <p className="text-slate-600">Persistent cart state and Stripe checkout wiring are prepared through `/api/cart` and `/api/orders`.</p>
        <a className="mt-5 inline-flex bg-black px-5 py-3 font-black text-white" href="/checkout">Secure checkout</a>
      </section>
    </main>
  );
}

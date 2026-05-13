import { CheckoutPanel } from "@/components/cart/CheckoutPanel";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-4 text-4xl font-black text-slate-100">Secure Checkout</h1>
      <CheckoutPanel />
    </main>
  );
}

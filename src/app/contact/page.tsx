import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12">
      <h1 className="mb-3 text-4xl font-black text-slate-100">Contact Ace Turbo</h1>
      <p className="mb-6 text-slate-400">Use the contact form for quotes, stock checks, trade enquiries, and support.</p>
      <div className="mb-6 flex flex-wrap gap-3">
        <a className="rounded-full bg-aceBlue px-4 py-2 font-bold text-[#081018]" href="tel:+441234567890">Call us</a>
        <a className="rounded-full border border-slate-700 px-4 py-2 text-slate-300" href="mailto:orders@aceturbo.co.uk">orders@aceturbo.co.uk</a>
      </div>
      <ContactForm />
    </main>
  );
}

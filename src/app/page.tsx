import { AdSlot } from "@/components/ads/AdSlot";
import { BrandLogos } from "@/components/homepage/BrandLogos";
import { FeaturedTurbos } from "@/components/homepage/FeaturedTurbos";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { RegLookupForm } from "@/components/homepage/RegLookupForm";
import { TurboSvg } from "@/components/homepage/TurboSvg";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <BrandLogos />
      <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-6 px-4 pb-12 md:grid-cols-[360px_1fr]">
        <RegLookupForm />
        <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-[#141b22] px-6 py-7 shadow-ace md:px-10">
          <div className="machine-lines" aria-hidden="true" />
          <div className="relative grid min-h-[320px] grid-cols-1 items-center gap-6 md:grid-cols-[minmax(280px,.9fr)_1fr]">
            <TurboSvg />
            <article className="max-w-xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-aceBlue">Independent front-end direction</p>
              <h2 className="mb-5 text-[30px] font-black uppercase leading-tight text-slate-100">
                Ace Turbo now reads like a workshop platform, not a Turboactive clone.
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-400">
                We still support the same core jobs: fast reg lookup, turbo search, secure checkout, B2B access, reporting, SEO links and eBay listing workflows. The difference is the presentation now leans into a cleaner industrial system with its own tone.
              </p>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-400">
                The visual system uses rounded technical panels, blueprint-style grids, strong uppercase typography and neutral workshop surfaces, which keeps the page aligned to your requirements without mimicking the reference image.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+441234567890"
                  className="inline-flex min-h-11 items-center rounded-full bg-aceBlue px-5 font-black text-[#081018]"
                >
                  Call us for a quote
                </a>
                <a
                  href="/turbos"
                  className="inline-flex min-h-11 items-center rounded-full border border-slate-700 bg-[#0f151b] px-5 font-black text-slate-200"
                >
                  Browse turbos
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-4 pb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-aceRed">Lookup flow</p>
            <h2 className="mb-3 text-2xl font-black uppercase text-slate-100">Sanitise first</h2>
            <p className="text-sm leading-6 text-slate-400">Registrations are cleaned before any cache, database or DVLA check, matching the updated project task.</p>
          </article>
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-aceRed">Commerce</p>
            <h2 className="mb-3 text-2xl font-black uppercase text-slate-100">Secure by design</h2>
            <p className="text-sm leading-6 text-slate-400">Cart, checkout, invoices, email and B2B paths stay visible in the UX without dragging the page back toward the source image.</p>
          </article>
          <article className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-aceRed">Admin tooling</p>
            <h2 className="mb-3 text-2xl font-black uppercase text-slate-100">Built to expand</h2>
            <p className="text-sm leading-6 text-slate-400">The hidden admin area, lookup reporting, SEO generation and eBay listing tools remain intact behind the new visual direction.</p>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-4 pb-8">
        <AdSlot slot="2480110011" />
      </section>
      <FeaturedTurbos />
    </main>
  );
}

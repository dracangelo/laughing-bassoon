import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0d1217]">
      <div className="header-grid" aria-hidden="true" />
      <nav className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-4 px-4 py-4 text-sm font-bold lg:grid-cols-[1fr_auto_1fr]" aria-label="Main navigation">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-400 lg:justify-start">
          <Link href="/turbos">Find Turbos</Link>
          <Link href="/news">Advice</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/brands">Genuine Turbochargers</Link>
        </div>
        <Link href="/" className="grid text-center uppercase leading-none" aria-label="Ace Turbo home">
          <span className="text-3xl font-black tracking-[0.18em] text-slate-100">ACE <strong className="text-aceBlue">TURBO</strong></span>
          <small className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-slate-500">Workshop-grade turbo supply</small>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-end">
          <a href="tel:+441234567890" className="rounded-full border border-slate-700 px-4 py-2 text-slate-300">Contact Us</a>
          <Link href="/cart" className="rounded-full border border-slate-700 px-4 py-2 text-slate-300">Cart</Link>
          <Link href="/b2b" className="rounded-full bg-slate-950 px-4 py-2 text-white">B2B Area</Link>
        </div>
      </nav>
      <form className="part-search absolute bottom-[-22px] left-1/2 z-10 grid h-11 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 grid-cols-[1fr_56px] border border-slate-700 bg-[#121920] shadow-ace" action="/turbos">
        <label className="sr-only" htmlFor="partNumber">Search part number</label>
        <input id="partNumber" name="partNumber" className="min-w-0 border-0 bg-transparent px-5 text-sm text-slate-300 outline-none" maxLength={32} placeholder="Search part number or SKU" />
        <button type="submit" className="rounded-full bg-aceBlue text-xl text-[#081018]" aria-label="Search part number">⌕</button>
      </form>
    </header>
  );
}

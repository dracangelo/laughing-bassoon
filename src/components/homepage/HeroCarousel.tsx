"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { VehicleSearchForm } from "./VehicleSearchForm";

const slides = [
  {
    eyebrow: "Ace Turbo platform",
    title: "Turbo lookup built for real workshop speed.",
    copy:
      "Search by registration, part number, or exact vehicle fitment with a cleaner, more technical front end that feels like Ace Turbo rather than a clone of anyone else.",
    accent: "DVLA ready",
    meta: "Registration, fitment, and stock workflows"
  },
  {
    eyebrow: "Trade operations",
    title: "From quote desk to B2B pricing in one flow.",
    copy:
      "Protected trade pricing, secure checkout, invoices, and account history stay available without cluttering the front page or leaning on the source reference.",
    accent: "B2B live",
    meta: "Accounts, checkout, and invoice delivery"
  },
  {
    eyebrow: "Admin tooling",
    title: "Built to manage data, SEO, and marketplace output.",
    copy:
      "Lookup reporting, turbo data entry, SEO link generation, and eBay listing drafts all feed from the same platform surface instead of being scattered across spreadsheets.",
    accent: "Ops focus",
    meta: "SEO, eBay, and reporting"
  }
];

export function HeroCarousel() {
  return (
    <section className="ace-hero relative overflow-hidden border-b border-slate-800" aria-labelledby="heroTitle">
      <div className="machine-lines" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-10 px-4 pb-16 pt-24 md:grid-cols-[1.2fr_.8fr] md:items-end">
        <Swiper
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          className="max-w-3xl"
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={24}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              <div className="pb-10">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-aceBlue">{slide.eyebrow}</p>
                <h1
                  id={index === 0 ? "heroTitle" : undefined}
                  className="max-w-3xl text-[clamp(40px,6vw,86px)] font-black uppercase leading-[0.92] tracking-[0.04em] text-slate-100"
                >
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">{slide.copy}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-slate-700 bg-[#12181f] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
                    {slide.accent}
                  </span>
                  <span className="text-sm text-slate-500">{slide.meta}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="relative rounded-[28px] border border-slate-700 bg-[#161d24] p-4 shadow-ace md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-100">Vehicle match</p>
              <p className="text-sm text-slate-400">Secure fitment search</p>
            </div>
            <div className="rounded-full border border-amber-700/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">DVLA ready</div>
          </div>
          <VehicleSearchForm />
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

export function BlogHero() {
  const locale = useLocale();
  const isId = locale === "id";

  const scrollToArchive = () => {
    const el = document.getElementById("blog-directory-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 pb-8 sm:pb-12">
      <SubpageBreadcrumb
        sectionIndex={isId ? "06 / CATATAN" : "06 / NOTES"}
        sectionLabel="Catatan & Artikel"
        sectionLabelEn="Notes & Essays"
        rightMeta="ENGINEERING JOURNAL"
      />

      {/* Executive Editorial Hero Card */}
      <div className="bg-white/95 rounded-3xl border border-[#ded8cb] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 Cols): Authoritative Editorial Headline & Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 flex flex-col gap-5"
          >
            {/* Eyebrow Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f3ee] text-[#111827] border border-[#ded8cb] font-mono text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                <span>ENGINEERING JOURNAL • VOL. 04</span>
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#686660] bg-[#fbf9f3] border border-[#ded8cb] px-3 py-1 rounded-full">
                SMK Telkom Malang
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-[#0b0c0c] font-bold tracking-tight leading-[1.12]">
              {isId ? (
                <>
                  Gagasan, Rekayasa &amp;{" "}
                  <span className="italic font-normal text-[#2563eb] block sm:inline">
                    Refleksi Teknis.
                  </span>
                </>
              ) : (
                <>
                  Engineering Ideas &amp;{" "}
                  <span className="italic font-normal text-[#2563eb] block sm:inline">
                    Technical Essays.
                  </span>
                </>
              )}
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#4b5563] max-w-2xl leading-relaxed">
              {isId
                ? "Dokumentasi mendalam mengenai eksplorasi perangkat lunak modern, arsitektur sistem jaringan komputer, serta refleksi teknis dari implementasi lab dan proyek nyata."
                : "In-depth technical documentation covering modern software architecture, computer network engineering, and engineering notes tested directly in real lab environments."}
            </p>

            {/* Clean Editorial Blockquote */}
            <div className="bg-[#fbf9f3] px-5 py-4 rounded-2xl border border-[#ded8cb] max-w-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#ded8cb] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <p className="font-serif text-sm sm:text-base text-[#111827] italic font-semibold leading-relaxed">
                  &ldquo;
                  {isId
                    ? "Menulis dokumentasi teknis adalah cara paling jujur untuk memvalidasi pemahaman atas setiap keputusan arsitektur yang kita ambil."
                    : "Writing technical documentation is the clearest way to validate our understanding of every architectural decision we make."}
                  &rdquo;
                </p>
              </div>
            </div>

            {/* Action & Topics Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={scrollToArchive}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b0c0c] hover:bg-[#2563eb] text-white font-sans text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span>{isId ? "Jelajahi Semua Catatan" : "Browse All Notes"}</span>
                <span>↓</span>
              </button>
              <span className="font-mono text-[11px] text-[#686660] px-3 py-1.5 rounded-full bg-[#fbf9f3] border border-[#ded8cb]">
                {isId
                  ? "Fokus: Networking • Linux • Web Systems"
                  : "Focus: Networking • Linux • Web Systems"}
              </span>
            </div>
          </motion.div>

          {/* Right Column (5 Cols): Crisp Author Dossier Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-[#fbf9f3] rounded-2xl p-4 sm:p-5 border border-[#ded8cb] flex flex-col gap-4 group">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#18181b] border border-[#ded8cb]/80">
                <Image
                  src="/images/debian_real_portrait_2.jpg"
                  alt="Naufal Nizar De Bian — Author and Engineering Writer"
                  fill
                  priority
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg shadow-xs border border-[#ded8cb] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[10px] font-bold text-[#111827] uppercase tracking-wider">
                    AUTHOR • MOKLET A&apos;35
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-serif text-lg font-bold text-[#111827]">
                    Naufal Nizar De Bian
                  </h2>
                  <span className="font-mono text-[10px] bg-[#dbeafe] text-[#1e40af] font-bold px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
                    {isId ? "Penulis" : "Author"}
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {isId
                    ? "Pelajar TKJ di SMK Telkom Malang. Mendokumentasikan arsitektur jaringan komputer, sistem Linux, dan pengembangan web modern."
                    : "TKJ vocational student at SMK Telkom Malang. Documenting network topology architecture, Linux server administration, and modern web systems."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ded8cb]/80 flex items-center justify-between text-[11px] font-mono text-[#686660]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{isId ? "Terkurasi & Terstruktur" : "Curated & Verified"}</span>
                </span>
                <span className="text-[#2563eb] font-bold">Engineering Journal</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Essay Cover Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative w-full rounded-3xl overflow-hidden mt-6 sm:mt-8 bg-[#18181b] shadow-xs border border-[#ded8cb] group"
      >
        <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[460px]">
          <Image
            src="/images/blog_hero_editorial.jpg"
            alt="The Art of Code — Modern Software Architecture and Engineering Systems"
            fill
            priority
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            sizes="(max-width: 1200px) 100vw, 1280px"
          />
        </div>

        {/* Clean Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0c]/95 via-[#0b0c0c]/45 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-12 text-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="font-mono text-[10px] uppercase bg-[#2563eb] text-white px-3 py-1 rounded-full font-bold tracking-wider">
              FEATURED ESSAY
            </span>
            <span className="font-mono text-xs text-white/80 font-medium tracking-wide">
              SOFTWARE ARCHITECTURE &amp; DESIGN PRINCIPLES
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white max-w-3xl leading-tight font-bold">
            {isId
              ? "The Art of Code: Menghubungkan Presisi Rekayasa dengan Estetika Antarmuka Modern"
              : "The Art of Code: Bridging Systems Engineering Precision with Modern Interface Design"}
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-base text-zinc-200 max-w-2xl mt-2 hidden sm:block leading-relaxed">
            {isId
              ? "Eksplorasi mendalam seputar prinsip arsitektur perangkat lunak, modularitas kode, efisiensi query, dan bagaimana keandalan sistem dibangun di atas fondasi logika yang kokoh."
              : "A deep dive into software architecture principles, clean modularity, query efficiency, and building resilient user experiences upon solid engineering foundations."}
          </p>

          <div className="mt-4 pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToArchive}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#111827] font-mono text-xs font-bold hover:bg-[#dbeafe] hover:text-[#1e40af] transition-all shadow-sm cursor-pointer"
            >
              <span>{isId ? "Baca Arsip Artikel" : "Explore Essay Archive"}</span>
              <span>↓</span>
            </button>
            <span className="text-xs font-mono text-zinc-300 hidden sm:inline">
              {isId ? "5–8 menit estimasi baca" : "5–8 min estimated read"}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

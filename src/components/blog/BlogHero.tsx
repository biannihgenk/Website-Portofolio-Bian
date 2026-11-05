"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InteractiveSticker } from "@/components/ui/InteractiveSticker";

export function BlogHero() {
  const scrollToArchive = () => {
    const el = document.getElementById("blog-directory-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 pb-8 sm:pb-12">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP MASTHEAD BAR: Clean Editorial Tech Journal Header     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#ded8cb]/80"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#222222] font-bold bg-[#eae8e2] px-3 py-0.5 rounded shadow-2xs border border-[#ded8cb]">
            VOLUME 04 // 2026
          </span>
          <span className="font-mono text-xs text-[#686660]">/</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#686660] font-semibold">
            ENGINEERING ESSAYS &amp; TECH NOTES
          </span>
          <span className="font-mono text-xs text-[#686660] hidden sm:inline">/</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#2563eb] font-bold hidden sm:inline">
            MALANG, ID • MOKLET A&apos;35
          </span>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#dbeafe] text-[#1e40af] font-bold shadow-2xs border border-[#bfdbfe]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
            <span>EDITORIAL JOURNAL</span>
          </span>
        </div>
      </motion.div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. EDITORIAL COVER TYPOGRAPHY & AUTHOR SHOWCASE CARD          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative pt-6 sm:pt-8 pb-6 sm:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Bold, Refined Editorial Copy (8 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-8 flex flex-col gap-4"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 self-start bg-[#fef3c7] text-[#92400e] px-3.5 py-1 rounded-full shadow-xs border border-[#fde68a]">
            <span className="font-mono text-xs">✍️</span>
            <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
              DEBIAN&apos;S ENGINEERING JOURNAL
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#222222] font-bold tracking-tight leading-[1.12]">
            Gagasan, Rekayasa &amp; <br />
            <span className="italic font-normal text-[#2563eb] font-serif relative inline-block">
              Refleksi Teknis.
              {/* SVG Underline Accent */}
              <svg
                className="w-full h-3 text-[#2563eb]/60 absolute -bottom-2 left-0"
                fill="none"
                viewBox="0 0 240 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C55 3 145 2 238 8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
            </span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#444748] max-w-2xl leading-relaxed pt-1">
            Dokumentasi mendalam mengenai eksplorasi perangkat lunak modern, arsitektur sistem jaringan, serta refleksi teknis seputar tantangan rekayasa nyata yang dipelajari dan diuji langsung.
          </p>

          {/* Clean Editorial Subtitle Quote & Interactive Boba Fuel Sticker */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-scrapbook border border-[#ded8cb] self-start max-w-xl">
              <span className="text-xl shrink-0 text-[#2563eb]">“</span>
              <p className="font-serif text-sm sm:text-base text-[#222222] italic font-semibold leading-relaxed">
                Menulis adalah cara terbaik memperdalam pemahaman atas setiap keputusan arsitektur yang kita ambil.
              </p>
            </div>

            <InteractiveSticker
              id="blog-boba"
              imageSrc="/images/sticker_boba_coffee.png"
              alt="3D Boba Coffee Sticker"
              quote="Boba Time! 🧋"
              subquote="Teman Koding &amp; Menulis Esai"
              badge="BOBA FUEL"
              badgeColor="amber"
              size="sm"
              floatType="2"
            />
          </div>
        </motion.div>

        {/* Right Column: Clean, Premium Author Card with Debian's Real Photo (4 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-4 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#ded8cb] flex flex-col gap-3.5 relative group hover:shadow-md transition-all">
            {/* Author Portrait Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#18181b] border border-[#ded8cb]/80 group/img">
              <Image
                src="/images/debian_real_portrait_2.jpg"
                alt="Debian Setyo Firwanto - Author and Creator"
                fill
                priority
                className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Status Pill on Photo */}
              <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-[#ded8cb] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-[#222222]">
                  ACTIVE WRITER • MOKLET A&apos;35 (KELAS X)
                </span>
              </div>
            </div>

            {/* Author Meta */}
            <div className="space-y-1 px-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#222222]">
                  Naufal Nizar De Bian
                </h3>
                <span className="font-mono text-[10px] bg-[#dbeafe] text-[#1e40af] font-bold px-2 py-0.5 rounded-full">
                  Author
                </span>
              </div>
              <p className="font-sans text-xs text-[#686660] leading-relaxed">
                Pelajar &amp; pengembang perangkat lunak di SMK Telkom Malang. Menulis catatan pembelajaran arsitektur sistem dan web modern.
              </p>
            </div>

            {/* Bottom Credential Bar */}
            <div className="pt-2 border-t border-[#f0eee8] flex items-center justify-between text-[11px] font-mono text-[#686660]">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Terkurasi &amp; Asli</span>
              </span>
              <span className="text-[#2563eb] font-bold">Refleksi Pribadi</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. EDITORIAL COVER SHOWCASE (The Art of Code)                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative w-full rounded-3xl overflow-hidden mt-2 bg-[#18181b] shadow-scrapbook-lg border border-[#ded8cb] group"
      >
        <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[480px]">
          <Image
            src="/images/blog_hero_editorial.jpg"
            alt="The Art of Code - Modern Software Architecture and Editorial Cover"
            fill
            priority
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            sizes="(max-width: 1200px) 100vw, 1280px"
          />
        </div>

        {/* Atmospheric gradient overlay scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0c]/95 via-[#0b0c0c]/40 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-12 text-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="font-mono text-[10px] uppercase bg-[#2563eb] text-white px-3 py-1 rounded-full font-bold shadow-xs">
              FEATURED ESSAY
            </span>
            <span className="font-mono text-xs text-white/80 font-medium tracking-wide">
              SOFTWARE ARCHITECTURE &amp; DESIGN PRINCIPLES
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white max-w-3xl leading-tight font-bold drop-shadow-sm">
            The Art of Code: Menghubungkan Presisi Rekayasa dengan Estetika Antarmuka Modern
          </h2>

          <p className="font-sans text-xs sm:text-sm lg:text-base text-zinc-200 max-w-2xl mt-2 hidden sm:block leading-relaxed">
            Eksplorasi mendalam seputar prinsip arsitektur perangkat lunak, modularitas kode, efisiensi query, dan bagaimana pengalaman pengguna dibangun di atas fondasi logika yang kokoh.
          </p>

          {/* Read Button Action */}
          <div className="mt-4 pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToArchive}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#222222] font-mono text-xs font-bold hover:bg-[#dbeafe] hover:text-[#1e40af] transition-all shadow-md group/btn"
            >
              <span>Jelajahi Semua Catatan</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">↓</span>
            </button>
            <span className="text-xs font-mono text-zinc-300 hidden sm:inline">
              • 5–8 menit estimasi waktu baca
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

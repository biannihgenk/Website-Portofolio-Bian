"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

export function AchievementsHero() {
  return (
    <section className="relative w-full pt-2 pb-8">
      <SubpageBreadcrumb
        sectionIndex="03 / PENCAPAIAN"
        sectionLabel="Pencapaian & Sertifikasi"
        sectionLabelEn="Honors & Credentials"
        rightMeta="SMK TELKOM MALANG"
      />

      <div className="bg-white/95 rounded-3xl border border-[#ded8cb] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Copy (Col 7) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 self-start flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-[#f5f3ee] text-[#111827] font-mono text-[11px] font-bold uppercase tracking-wider border border-[#ded8cb] flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                HONORS &amp; COMPETITION ARCHIVE
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#2563eb] bg-[#dbeafe]/60 px-3 py-1.5 rounded-full font-bold border border-[#bfdbfe]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                VERIFIED CREDENTIALS
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-[#0b0c0c] tracking-tight leading-[1.12] font-bold">
              Pencapaian, Rekognisi &amp; <br />
              <span className="italic font-normal text-[#2563eb] font-serif">
                Jejak Dedikasi Nyata.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="font-sans text-base sm:text-lg text-[#4b5563] max-w-xl leading-relaxed">
              Dokumentasi resmi penghargaan kompetisi teknologi informasi, inovasi rekayasa perangkat lunak, dan sertifikasi kompetensi industri yang diraih melalui dedikasi konsisten dan standar keunggulan tinggi.
            </p>

            {/* Quote Card */}
            <div className="relative bg-[#fbf9f3] p-5 rounded-2xl border border-[#ded8cb] max-w-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#ded8cb] text-[#2563eb] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-serif text-sm sm:text-base text-[#111827] italic font-semibold leading-relaxed">
                    &ldquo;Kemenangan bukan sekadar berdiri di atas podium, melainkan bukti keberanian untuk merancang solusi berdampak dan terus menaikkan standar keahlian.&rdquo;
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#ded8cb]/70">
                    <span className="font-mono text-xs text-[#2563eb] font-bold">
                      Naufal Nizar De Bian Setyo Firwanto
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#686660] font-bold">
                      Moklet A&apos;35
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase text-[#686660] font-bold">
                      Sertifikasi
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#111827] font-bold">
                    14<span className="text-[#2563eb] text-xl">+</span>
                  </span>
                  <span className="font-sans text-xs text-[#686660]">
                    Resmi Terakreditasi
                  </span>
                </div>

                <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase text-[#686660] font-bold">
                      Kejuaraan
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#111827] font-bold">
                    03<span className="text-[#2563eb] text-xl">x</span>
                  </span>
                  <span className="font-sans text-xs text-[#686660]">
                    Podium &amp; Finalis
                  </span>
                </div>

                <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase text-[#686660] font-bold">
                      Dedikasi
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#2563eb] font-bold">
                    100%
                  </span>
                  <span className="font-sans text-xs text-[#686660]">
                    Kualitas Eksekusi
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Architectural Credential Showcase (Col 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5 relative flex flex-col justify-center"
          >
            {/* Elegant Verified Credential Card */}
            <div className="relative bg-[#fbf9f3] rounded-2xl p-5 sm:p-6 border border-[#ded8cb]">
            {/* Top Identity Header */}
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#ded8cb]/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                <span className="font-mono text-xs font-bold text-[#222222] uppercase tracking-wider">
                  HONORS &amp; AWARDS ARCHIVE
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Terverifikasi
              </span>
            </div>

            {/* Premium Framed Visual of Debian */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#18181b] my-4 border border-[#ded8cb] group shadow-inner">
              <Image
                src="/images/debian_real_landscape.jpg"
                alt="Debian Setyo Firwanto dalam almamater resmi SMK Telkom Malang"
                fill
                priority
                className="object-cover group-hover:scale-103 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 440px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Photo Pill */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-mono">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-bold">
                  Naufal Nizar De Bian
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-white/90">
                  SMK Telkom Malang • Moklet A&apos;35
                </span>
              </div>
            </div>

            {/* Structured Honors Ledger (Clean, precise, zero clutter) */}
            <div className="space-y-2 pt-1">
              <span className="font-mono text-[10px] uppercase font-bold text-[#686660] tracking-wider block">
                SOROTAN REKOGNISI RESMI
              </span>

              <div className="divide-y divide-[#ded8cb]/60 bg-[#fbf9f3] rounded-2xl border border-[#ded8cb] px-3.5 py-1 text-left">
                {/* Item 1 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-[#222222]">
                      Olimpiade Kecerdasan Artifisial (OKTAL)
                    </span>
                    <span className="font-mono text-[10px] text-[#686660]">
                      Kota Malang • Rekayasa AI &amp; Sistem Cerdas
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#1e40af] bg-[#dbeafe] px-2.5 py-0.5 rounded-md shrink-0 border border-[#bfdbfe]">
                    Juara 1
                  </span>
                </div>

                {/* Item 2 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-[#222222]">
                      Inovasi Teknologi Terapan (INOTEK)
                    </span>
                    <span className="font-mono text-[10px] text-[#686660]">
                      Bidang Teknologi Digital &amp; IoT Terapan
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#92400e] bg-[#fef3c7] px-2.5 py-0.5 rounded-md shrink-0 border border-[#fde68a]">
                    Finalis
                  </span>
                </div>

                {/* Item 3 */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-bold text-[#222222]">
                      Sertifikasi Kompetensi Industri IT
                    </span>
                    <span className="font-mono text-[10px] text-[#686660]">
                      Jaringan, Cloud &amp; Keamanan Siber
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#222222] bg-white border border-[#ded8cb] px-2.5 py-0.5 rounded-md shrink-0">
                    14+ Lisensi
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Footer Row */}
            <div className="mt-3.5 pt-3 border-t border-[#ded8cb]/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[#686660] text-[11px]">Status: Terkualifikasi</span>
              <a
                href="#achievements-directory"
                className="text-[#2563eb] hover:text-[#1d4ed8] font-bold flex items-center gap-1 transition-colors text-[11px]"
              >
                <span>Lihat Arsip Lengkap</span>
                <span>↓</span>
              </a>
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="relative my-12 sm:my-16 flex items-center justify-center">
        <div className="w-full h-px bg-[#ded8cb]" />
        <div className="absolute bg-[#fbf9f3] px-4 flex items-center gap-2 font-mono text-xs text-[#686660]">
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="font-bold tracking-wider">OFFICIAL DIRECTORY OF MILESTONES</span>
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
        </div>
      </div>
    </section>
  );
}

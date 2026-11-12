"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

export function EducationHero() {
  return (
    <section className="relative w-full pt-2">
      <SubpageBreadcrumb
        sectionIndex="04 / PENDIDIKAN"
        sectionLabel="Pendidikan Vokasi"
        sectionLabelEn="Vocational Education"
        rightMeta="SMK TELKOM MALANG"
      />

      <div className="bg-white/95 rounded-3xl border border-[#ded8cb] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
          {/* Left Column: Copy & Narrative (Col 7) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Eyebrow Stamp Header */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#f5f3ee] font-mono text-[11px] font-bold text-[#111827] uppercase tracking-wider border border-[#ded8cb]">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span>EDUCATION &amp; VOCATIONAL JOURNEY • MOKLET A&apos;35</span>
            </div>

            {/* Editorial Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-[#0b0c0c] leading-[1.12] tracking-tight font-bold">
                Pendidikan Vokasi &amp; <br />
                <span className="italic font-normal text-[#2563eb] font-serif">
                  Jejak Pembelajaran.
                </span>
              </h1>

              <div className="flex items-center gap-2 text-[#686660]">
                <svg className="w-4 h-4 text-[#2563eb] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span className="font-mono text-xs text-[#686660] font-medium">
                  SMK Telkom Malang • Teknik Komputer dan Jaringan (TKJ)
                </span>
              </div>
            </div>

            {/* Supporting Narrative */}
            <p className="font-sans text-base sm:text-lg text-[#4b5563] max-w-xl leading-relaxed">
              Menempuh pendidikan vokasi di SMK Telkom Malang dengan fokus mendalam pada arsitektur jaringan komputer, protokol routing, administrasi server Linux, serta pengembangan sistem web modern.
            </p>

            {/* Quote Callout Banner */}
            <div className="relative max-w-lg p-4 sm:p-5 rounded-2xl border border-[#ded8cb] bg-[#fbf9f3]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#ded8cb] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-serif text-sm sm:text-base text-[#111827] font-semibold italic leading-relaxed">
                    &ldquo;Teori dipelajari di kelas, keahlian diasah langsung melalui konfigurasi terminal dan perangkat keras jaringan.&rdquo;
                  </p>
                  <span className="font-mono text-[10px] uppercase text-[#2563eb] font-bold block mt-1.5">
                    — Prinsip Praktik Vokasi SMK Telkom
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#fbf9f3] rounded-xl border border-[#ded8cb]">
                <span className="font-mono text-sm font-bold text-[#111827]">X TKJ</span>
                <span className="font-sans text-xs text-[#686660] font-medium">
                  Jenjang Saat Ini
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#fbf9f3] rounded-xl border border-[#ded8cb]">
                <span className="font-mono text-sm font-bold text-[#2563eb]">Moklet A&apos;35</span>
                <span className="font-sans text-xs text-[#686660] font-medium">
                  Angkatan Siswa
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#dbeafe]/50 rounded-xl border border-[#bfdbfe]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-sans text-xs text-[#111827] font-semibold">
                  Aktif Praktikum &amp; Riset
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Lab Photo Showcase (Col 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md bg-[#fbf9f3] p-4 pb-5 rounded-2xl border border-[#ded8cb]">
              {/* Visual Photo Frame: Debian in SMK Telkom Almamater */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f5f3ee] relative border border-[#ded8cb]/80 group">
                <Image
                  src="/images/education_hero_debian.jpg"
                  alt="Debian Bian mengenakan almamater SMK Telkom Malang dengan laptop dan perangkat jaringan di lab"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 440px"
                />

                {/* Status pill badge */}
                <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-[#111827]/85 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/15 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>SMK Telkom Malang</span>
                </div>

                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold border border-white/15">
                  LAB REKAYASA TKJ
                </div>
              </div>

              {/* Clean Caption */}
              <div className="mt-4 flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg sm:text-xl text-[#111827] font-bold">
                    Naufal Nizar De Bian
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] font-mono text-[10px] font-bold uppercase text-[#1e40af] border border-[#bfdbfe]">
                    Moklet A&apos;35
                  </span>
                </div>
                <p className="font-sans text-xs text-[#686660] font-medium">
                  Teknik Komputer dan Jaringan • Sawojajar, Kota Malang
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-[#ded8cb]/70 flex items-center justify-between text-[#2563eb] font-mono text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span>Infrastruktur Jaringan &amp; Web Systems</span>
                  </span>
                  <span className="text-[10px] font-bold bg-white text-[#111827] px-2 py-0.5 rounded-md border border-[#ded8cb]">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

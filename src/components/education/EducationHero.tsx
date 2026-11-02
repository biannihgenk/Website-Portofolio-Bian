"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InteractiveSticker } from "@/components/ui/InteractiveSticker";

export function EducationHero() {
  const [noteTapped, setNoteTapped] = useState(false);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative pt-2">
      {/* Left Column: Copy & Narrative (Col 7) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-7 flex flex-col gap-6"
      >
        {/* Scrapbook Label Stamp Header */}
        <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#f0eee8] font-mono text-[11px] font-bold text-[#222222] uppercase tracking-wider shadow-xs border border-[#ded8cb]">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span>EDUCATION &amp; VOCATIONAL JOURNEY • MOKLET A&apos;35</span>
        </div>

        {/* Editorial Headline */}
        <div className="flex flex-col relative">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#222222] leading-[1.15] tracking-tight font-bold">
            Pendidikan Vokasi &amp; <br />
            <span className="relative inline-block text-[#2563eb] font-serif">
              Jejak Pembelajaran
              {/* Hand-drawn SVG doodle underline */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-3 text-[#2563eb]/60"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 260 12"
              >
                <path
                  d="M2 9C55 3 145 2 258 8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </h1>

          <div className="flex items-center gap-2 mt-3 text-[#686660]">
            <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span className="font-mono text-xs text-[#686660] font-medium">
              SMK Telkom Malang • Rekayasa Jaringan Komputer &amp; Perangkat Lunak
            </span>
          </div>
        </div>

        {/* Supporting Narrative */}
        <p className="font-sans text-base sm:text-lg text-[#444748] max-w-xl leading-relaxed">
          Menempuh pendidikan vokasi di SMK Telkom Malang dengan fokus mendalam pada arsitektur jaringan komputer, protokol routing, administrasi server Linux, serta pengembangan sistem web modern berbasis AI.
        </p>

        {/* Sticky Note / Tactile Washi Pin */}
        <motion.div
          whileHover={{ scale: 1.02, rotate: 0 }}
          onClick={() => setNoteTapped(!noteTapped)}
          className={`relative max-w-md p-4 sm:p-5 rounded-2xl shadow-xs transition-all duration-300 cursor-pointer border border-[#ded8cb] ${
            noteTapped
              ? "bg-[#bfdbfe]/50 rotate-0"
              : "bg-[#bfdbfe]/35 -rotate-1"
          }`}
          title="Klik untuk berinteraksi"
        >
          {/* Simulated Washi Tape Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[rgba(245,242,234,0.95)] backdrop-blur-xs rounded-xs shadow-tape opacity-95 border-l-2 border-r-2 border-dashed border-[#686660]/30" />
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0 mt-0.5">💡</span>
            <div>
              <p className="font-serif text-base sm:text-lg text-[#222222] font-semibold italic leading-snug">
                “Teori dipelajari di kelas, keahlian diasah langsung di terminal dan kabel jaringan.”
              </p>
              <span className="font-mono text-[10px] uppercase text-[#1e40af] font-bold block mt-1">
                — Prinsip Praktik Vokasi SMK Telkom
              </span>
            </div>
          </div>
        </motion.div>

        {/* Metric / Reflective Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-xs border border-[#ded8cb]">
            <span className="font-mono text-sm font-bold text-[#222222]">X TKJ</span>
            <span className="font-sans text-xs text-[#686660] font-medium">
              Jenjang Saat Ini
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-xs border border-[#ded8cb]">
            <span className="font-mono text-sm font-bold text-[#2563eb]">Moklet A&apos;35</span>
            <span className="font-sans text-xs text-[#686660] font-medium">
              Angkatan Siswa
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#dbeafe]/50 rounded-xl shadow-xs border border-[#ded8cb]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-sans text-xs text-[#222222] font-semibold">
              Aktif Praktikum &amp; Riset
            </span>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Tactile Polaroid Character Hero (Col 5) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-5 flex justify-center lg:justify-end"
      >
        <div className="relative w-full max-w-md">
          {/* Background Decorative Stamp Ring */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full border-2 border-dashed border-[#2563eb]/40 flex items-center justify-center -rotate-12 pointer-events-none z-0">
            <div className="text-center font-mono text-[9px] uppercase tracking-widest text-[#2563eb] font-bold leading-tight">
              SMK TELKOM<br />MALANG<br />• MOKLET A&apos;35 •
            </div>
          </div>

          {/* Polaroid Container */}
          <div className="relative bg-white p-4 pb-6 rounded-3xl shadow-scrapbook rotate-1 transition-transform duration-300 hover:rotate-0 hover:scale-[1.01] border border-[#ded8cb] z-10">
            {/* Masking Tape Top Center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-6 bg-[#dbeafe]/90 backdrop-blur-md rounded-xs shadow-tape border-l-2 border-r-2 border-dashed border-[#2563eb]/30 z-20 flex items-center justify-center">
              <span className="font-mono text-[9px] uppercase font-bold text-[#1e40af] tracking-wider">
                STUDENT PROFILE // 2026
              </span>
            </div>

            {/* Visual Photo Frame: Debian in SMK Telkom Almamater */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#f5f3ee] relative border border-[#ded8cb]/80 flex items-center justify-center group">
              <Image
                src="/images/education_hero_debian.jpg"
                alt="Debian Bian mengenakan almamater SMK Telkom Malang dengan laptop dan perangkat jaringan di lab"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 440px"
              />

              {/* Floating pill badge */}
              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-[#222222]/85 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SMK Telkom Malang</span>
              </div>

              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold border border-white/20">
                LAB REKAYASA TKJ
              </div>
            </div>

            {/* Polaroid Bottom Caption */}
            <div className="mt-4 flex flex-col gap-1 px-1">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl sm:text-2xl text-[#222222] font-bold">
                  Naufal Nizar De Bian
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] font-mono text-[10px] font-bold uppercase text-[#1e40af] border border-[#bfdbfe]">
                  Moklet A&apos;35
                </span>
              </div>
              <p className="font-sans text-xs text-[#686660] font-medium">
                Teknik Komputer dan Jaringan • Sawojajar, Kota Malang
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-[#f0eee8] flex items-center justify-between text-[#2563eb] font-mono text-xs">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Infrastruktur Jaringan &amp; Full-Stack AI</span>
                </span>
                <span className="text-[10px] font-bold bg-[#f5f2ea] text-[#222222] px-2 py-0.5 rounded-md border border-[#ded8cb]">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Tactile 3D Interactive Mascot Sticker */}
          <div className="absolute -bottom-8 -left-6 z-30">
            <InteractiveSticker
              id="edu-mascot"
              imageSrc="/images/sticker_dev_mascot.png"
              alt="Stiker Moklet TKJ Student"
              quote="Moklet TKJ A'35 🎒"
              subquote="Eksplorasi Jaringan & Fullstack di Sawojajar Lab"
              badge="Moklet Student"
              badgeColor="blue"
              floatType="1"
              size="md"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

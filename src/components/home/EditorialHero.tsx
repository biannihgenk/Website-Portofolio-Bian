"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InteractiveSticker } from "@/components/ui/InteractiveSticker";

interface EditorialHeroProps {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string;
  school?: string;
}

export function EditorialHero({
  displayName = "Naufal Nizar De Bian Setyo Firwanto",
  avatarUrl,
  bio,
  school = "SMK Telkom Malang",
}: EditorialHeroProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Fallback vocational portrait
  const fallbackPhoto =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBNrmoVQbmOgjgzU8fW6x2aFmr_pLmzPu3Ov1C2cUo_cELkM6-3NXEfEOffgUhB9tK56jVTL2sl8uHFX7NHzZE6ZYNLqF9Hk1CYTHk2LrkN0noWPfuShl5gS_-CMJ1pc0pYD2SRPy6xizzAYdTHWkIeQXNnBmPsbyYC0dqA_ePTpb_0ZIS4120TTNt5291kHYqe0gt1BJJKTJyFO1LQTR-sZ0ym-ySndPHyjcZtxCtVS_YUCtoH8GSU";

  const displayPhoto = avatarUrl || fallbackPhoto;

  return (
    <section
      id="editorial-hero"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-20 lg:py-24 overflow-visible"
    >
      {/* Soft Ambient Background Glow Accents */}
      <div className="absolute -top-24 -right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-50/25 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* LEFT COLUMN: GREETING & EDITORIAL INTRODUCTION */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6 text-left">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-wide">
              Terbuka untuk kolaborasi &amp; magang
            </span>
          </div>

          {/* Headline Greeting */}
          <div className="space-y-3">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#222222] tracking-tight leading-[1.08]">
              Membangun Solusi Digital &amp; Infrastruktur Teruji.
            </h2>

            {/* Description Text with Debian's Full Name */}
            <p className="font-sans text-base sm:text-lg text-[#6b6863] max-w-2xl leading-relaxed">
              Saya{" "}
              <strong className="text-[#222222] font-bold">
                {displayName || "Naufal Nizar De Bian Setyo Firwanto"}
              </strong>{" "}
              (Bian), Siswa{" "}
              <span className="text-blue-600 font-bold underline decoration-blue-300 decoration-2 underline-offset-4">
                {school}
              </span>{" "}
              {bio || "konsentrasi Teknik Komputer dan Jaringan (TKJ). Berdedikasi dengan fokus pada arsitektur sistem jaringan, rekayasa web modern, dan sistem digital terdistribusi."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>Hubungi Saya</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                ↗
              </span>
            </a>

            <a
              href="#about-profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#f5f2ea] text-[#222222] border border-[#ded8cb] hover:border-blue-300 font-semibold text-sm shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#6b6863]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Jelajahi Profil</span>
            </a>
          </div>

          {/* Interactive Hint with Gesture Emoji */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#6b6863] pt-1">
            <span className="text-sm">👆</span>
            <span>
              Kartu ID interaktif — klik tombol atau seret kartu untuk melihat spesifikasi teknis.
            </span>
          </div>

          {/* Quick Skill Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#ded8cb] text-[#222222] font-mono text-xs shadow-xs">
              <span>🌱</span> {school}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono text-xs shadow-xs font-bold">
              <span>⚡</span> TKJ &apos;26
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#ded8cb] text-[#222222] font-mono text-xs shadow-xs">
              <span>📍</span> Malang, East Java
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-xs shadow-xs font-semibold">
              <span>💻</span> Web &amp; Network
            </span>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* RIGHT COLUMN: 3D HANGING LANYARD ID CARD (Inspired by filoalvian.com) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center pt-8 lg:pt-0">
          {/* Lanyard Assembly Area */}
          <div className="relative flex flex-col items-center select-none">
            
            {/* Lanyard Hanging Ribbon (Directly connected to metal buckle) */}
            <div className="relative z-10 flex flex-col items-center origin-top pointer-events-none">
              {/* Dual Blue Fabric Strap */}
              <div className="w-14 sm:w-16 h-28 sm:h-36 bg-[#2563eb] shadow-lg flex items-center justify-center overflow-hidden border-x-2 border-blue-700 rounded-b-xs relative -mb-1">
                {/* Woven strap pattern */}
                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] [background-size:6px_6px]" />
                
                {/* Printed Repeating Lanyard Text with Stars */}
                <div className="flex flex-col items-center gap-4 text-white font-mono text-[9px] font-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 opacity-95 select-none">
                  <span>✦ BIAN ✦ TKJ &apos;26 ✦ SMK TELKOM</span>
                  <span>✦ NAUFAL NIZAR DE BIAN ✦</span>
                </div>
              </div>

              {/* Metal Crimp Clasp & Swivel Hook */}
              <div className="relative z-20 flex flex-col items-center">
                {/* Metal horizontal crimp bar */}
                <div className="w-14 h-4 rounded-xs bg-linear-to-b from-slate-200 via-slate-100 to-slate-400 border border-slate-400 shadow-md flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-400/80 rounded-full" />
                </div>
                {/* Chrome Swivel Ring */}
                <div className="w-7 h-5 rounded-full border-2 border-slate-300 bg-linear-to-b from-slate-100 to-slate-300 shadow-inner -mt-1" />
                {/* Metallic Snap Carabiner Hook */}
                <div className="w-4 h-6 rounded-xs bg-linear-to-b from-slate-300 via-slate-100 to-slate-400 shadow-sm border border-slate-400 -mt-1" />
              </div>
            </div>

            {/* Draggable & Flippable Card Container */}
            <motion.div
              drag
              dragConstraints={{ top: -30, bottom: 45, left: -60, right: 60 }}
              dragElastic={0.25}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98, cursor: "grabbing" }}
              className="relative z-30 cursor-grab select-none [perspective:1400px] -mt-1"
            >
              {/* Frosted Transparent Plastic Holder Pouch with Punch Hole */}
              <div className="p-3 sm:p-3.5 rounded-[32px] bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-2xl shadow-blue-500/10 relative">
                
                {/* Punch Slot at Top of Acrylic Holder */}
                <div className="w-16 h-3 mx-auto mb-2.5 bg-slate-200/90 rounded-full border border-slate-300 shadow-inner flex items-center justify-center">
                  <div className="w-8 h-1.5 rounded-full bg-slate-500/80" />
                </div>

                {/* 3D DOUBLE-SIDED CARD FLIP WRAPPER */}
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 220, damping: 20 }}
                  className="relative w-[285px] sm:w-[310px] min-h-[445px] sm:min-h-[465px] bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#ded8cb] [transform-style:preserve-3d]"
                >
                  {/* ─────────────────────────────────────────────────── */}
                  {/* FRONT SIDE OF ID CARD (Inspired by filoalvian.com) */}
                  {/* ─────────────────────────────────────────────────── */}
                  <div
                    className={`w-full h-full flex flex-col justify-between [backface-visibility:hidden] ${
                      isFlipped ? "pointer-events-none" : ""
                    }`}
                  >
                    {/* Header: Star Logo & Portfolio ID */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#ded8cb]/70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#2563eb] text-sm font-bold">★</span>
                        <span className="font-mono text-xs font-black text-[#222222] tracking-wider">
                          BianPortfolio.id
                        </span>
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[9px] text-[#6b6863] font-bold">
                        2026
                      </div>
                    </div>

                    {/* Portrait Photo Container */}
                    <div className="my-2.5 relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb] shadow-inner group">
                      <Image
                        src={displayPhoto}
                        alt="Naufal Nizar De Bian Setyo Firwanto"
                        fill
                        sizes="320px"
                        unoptimized
                        priority
                        className="object-cover"
                      />
                      {/* Active Online Indicator Pill */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#ded8cb] text-[9px] font-mono text-blue-700 font-bold flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
                        <span>STUDENT ID</span>
                      </div>
                    </div>

                    {/* Student Name & Academic Affiliation */}
                    <div className="text-left space-y-1">
                      <h3 className="font-serif font-black text-xl text-[#222222] leading-tight">
                        Naufal Nizar De Bian
                      </h3>
                      <p className="font-mono text-xs text-[#6b6863]">
                        Siswa Teknik Komputer dan Jaringan
                      </p>
                      <p className="font-mono text-xs text-[#2563eb] font-bold">
                        {school}
                      </p>
                    </div>

                    {/* Footer Row: Tags on Left + Barcode on Right */}
                    <div className="pt-2.5 border-t border-[#ded8cb]/70 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[9px] text-[#6b6863] uppercase">
                          Bidang Minat
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#222222]">
                          Network • Web • Systems
                        </span>
                      </div>

                      {/* Vector Barcode */}
                      <div className="flex flex-col items-end shrink-0">
                        <div className="h-5 w-20 flex items-center justify-end gap-[1.5px] opacity-80">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 5, 2, 1, 3, 2, 4, 1, 3].map((w, i) => (
                            <div
                              key={i}
                              className="bg-[#222222] h-full rounded-[0.5px]"
                              style={{ width: `${w}px` }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[8px] text-[#6b6863] mt-0.5">
                          TKJ-33-2026
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────── */}
                  {/* BACK SIDE OF ID CARD (Clean, Professional, No Lab Mention) */}
                  {/* ─────────────────────────────────────────────────── */}
                  <div
                    className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between rounded-2xl bg-white [transform:rotateY(180deg)] [backface-visibility:hidden] ${
                      !isFlipped ? "pointer-events-none" : ""
                    }`}
                  >
                    {/* Top Dark Brushed Magnetic Stripe */}
                    <div className="-mx-4 sm:-mx-5 -mt-4 sm:-mt-5 h-9 bg-[#1e293b] border-b border-black/20 rounded-t-xl" />

                    {/* Security Microchip & Contactless Symbol */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Golden EMV Smart Card Chip Graphic */}
                      <div className="w-11 h-8 rounded-md bg-linear-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-600/50 shadow-inner flex flex-col justify-around p-1">
                        <div className="h-[1px] bg-amber-700/50 w-full" />
                        <div className="h-[1px] bg-amber-700/50 w-full" />
                      </div>

                      {/* Contactless NFC Waves & Security Seal */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[#2563eb] font-bold" title="Contactless NFC">
                          ((( · )))
                        </span>
                        <div className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[9px] font-mono text-blue-700 font-bold">
                          VERIFIED • 2026
                        </div>
                      </div>
                    </div>

                    {/* Official Student Credentials Card Panel */}
                    <div className="space-y-2 text-left my-1 bg-[#fcfbf7] p-3 rounded-xl border border-[#ded8cb]">
                      <div>
                        <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                          Nama Lengkap
                        </span>
                        <span className="font-serif font-bold text-xs text-[#222222]">
                          Naufal Nizar De Bian Setyo Firwanto
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                            Program Keahlian
                          </span>
                          <span className="font-mono text-[10px] text-[#222222] font-semibold">
                            Teknik Komputer &amp; Jaringan
                          </span>
                        </div>
                        <div>
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                            Angkatan
                          </span>
                          <span className="font-mono text-[10px] text-blue-600 font-bold">
                            Moklet A&apos;35 (Kelas X TKJ)
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                          Institusi Pendidikan
                        </span>
                        <span className="font-mono text-[10px] text-[#222222] font-semibold">
                          {school}
                        </span>
                      </div>
                    </div>

                    {/* Official Signature Strip & Security QR Code */}
                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#ded8cb] mt-auto">
                      {/* Signature Panel */}
                      <div className="flex-1 text-left">
                        <span className="font-mono text-[8px] text-[#6b6863] uppercase block mb-1">
                          Tanda Tangan Pemegang
                        </span>
                        <div className="h-7 bg-[#f5f2ea] rounded-md border border-[#ded8cb] px-2 flex items-center justify-center">
                          <span className="font-serif italic text-xs font-bold text-[#2563eb] tracking-wide select-none">
                            Naufal Nizar De Bian
                          </span>
                        </div>
                      </div>

                      {/* Decorative Vector QR Code Matrix */}
                      <div className="w-10 h-10 rounded-md bg-white border border-[#ded8cb] p-1 flex flex-col justify-between shrink-0 shadow-2xs">
                        <div className="grid grid-cols-3 gap-[1px] w-full h-full">
                          {[1, 0, 1, 1, 1, 0, 0, 1, 1].map((dot, idx) => (
                            <div
                              key={idx}
                              className={`rounded-[0.5px] ${dot ? "bg-[#222222]" : "bg-transparent"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Row */}
                    <div className="pt-2 border-t border-[#ded8cb] flex items-center justify-between text-[9px] font-mono text-[#6b6863]">
                      <span>PORTFOLIO IDENTITY</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Valid &amp; Aktif
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* FLOATING "↺ Balik kartu" PILL (Positioned on the side, like filoalvian.com) */}
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="absolute -left-16 sm:-left-20 bottom-16 sm:bottom-20 z-40 hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-[#ded8cb] hover:border-blue-400 text-xs font-mono font-bold text-[#222222] hover:text-blue-600 shadow-md hover:shadow-lg transition-all cursor-pointer group whitespace-nowrap"
                aria-label="Balik sisi kartu"
              >
                <span className="group-hover:rotate-180 transition-transform duration-500 text-sm">
                  ↺
                </span>
                <span>Balik kartu</span>
              </button>

              {/* Interactive 3D AI Chip Sticker */}
              <div className="absolute -top-7 -right-7 sm:-right-8 z-40 hidden sm:block">
                <InteractiveSticker
                  id="hero-ai-chip"
                  imageSrc="/images/sticker_ai_chip.png"
                  alt="Stiker AI Chip"
                  quote="AI & Smart Core ⚡"
                  subquote="Integrasi LLM, Agentik & Otomasi Lab"
                  badge="Smart Processor"
                  badgeColor="emerald"
                  floatType="2"
                  size="sm"
                />
              </div>
            </motion.div>

            {/* Mobile Fallback Flip Button */}
            <div className="mt-3 md:hidden flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-blue-50 border border-[#ded8cb] text-xs font-mono font-bold text-[#222222] shadow-sm transition-all cursor-pointer"
              >
                <span>↺</span>
                <span>Balik kartu</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProfileGalleryShowcaseProps {
  avatarUrl?: string | null;
}

export function ProfileGalleryShowcase({ avatarUrl }: ProfileGalleryShowcaseProps) {

  // High quality 3D Digital Avatar generated for Debian
  const avatar3dUrl = "/images/debian_avatar_3d.jpg";

  // Real photo polaroid of Debian
  const polaroidUrl =
    avatarUrl ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBzEg0dTm5r9F3ELc8yZMzz2jl8mJO01rSTxaPNiDLccnm-VcU0WN6c7tIO7PYWSS4pvg3T-uEcUOlaGg57DF_gVdFee7w07JtNoCFiRhx6fcrtYQGa739wtXv0lSLsakZVmx7Vn3K1RmfnghgP3JeaWGIUdQAcuwIDi3nMHmKQ2AikPE3Y1eXvWCDmZXGIbJg5h4XkQA13OO0avrtzCWKuxykzw6xl6eyRV55Qs2jaEjr3ZEkEXzJF";

  return (
    <section className="w-full my-8 sm:my-12">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-scrapbook relative overflow-hidden border border-[#ded8cb]">
        {/* Subtle decorative watermark icon */}
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none text-[#222222]">
          <svg className="w-80 h-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Main 3D Tech Avatar Hero Spotlight (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center sm:items-start relative">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full rounded-2xl overflow-hidden bg-[#f5f2ea] p-3 sm:p-4 shadow-inner group border border-[#ded8cb]"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[480px] rounded-xl overflow-hidden bg-[#fbf9f3] flex items-center justify-center border border-[#e5e0d4]">
                <Image
                  src={avatar3dUrl}
                  alt="3D Digital Art Avatar of Debian Bian at SMK Telkom Malang"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Ambient Soft Glow Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating pill badge on image */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-ping" />
                  <span className="font-mono text-[11px] font-bold text-[#222222]">
                    DEBIAN BIAN • 3D TECH AVATAR
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[10px] font-bold border border-white/20">
                  SMK TELKOM MALANG
                </div>
              </div>

              {/* Bottom card label strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  <span className="font-mono text-xs font-bold text-[#222222]">
                    NAUFAL NIZAR DE BIAN
                  </span>
                  <span className="font-mono text-[10px] text-[#6b6863] uppercase">
                    / NETWORK & AI DEV
                  </span>
                </div>
                <div className="font-mono text-[10px] bg-white border border-[#ded8cb] px-2.5 py-1 rounded-full text-[#444748] font-bold">
                  FIGURE 01 • 3D AVATAR EDITION
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Portrait Snapshot (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative self-center lg:self-start w-full max-w-sm">
              <div className="bg-white p-4 pb-6 rounded-2xl shadow-sm border border-[#ded8cb]">
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f3ee] relative">
                  <Image
                    src={polaroidUrl}
                    alt="Debian (Bian) photo in green paddy fields"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#222222]/75 backdrop-blur-sm text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    REC // 35MM VIBE
                  </div>
                </div>

                <div className="mt-4 text-center flex flex-col gap-1">
                  <p className="font-serif text-lg text-[#222222] italic font-bold">
                    “Pematang Sawah, Jawa Timur”
                  </p>
                  <p className="font-mono text-xs text-[#6b6863]">
                    Breathe in nature, recharge logic & perspective.
                  </p>
                </div>
              </div>
            </div>

            {/* Postal Stamp Badge & Identity Pill */}
            <div className="flex items-center gap-4 bg-[#f5f2ea] p-4 rounded-2xl border border-[#ded8cb] shadow-xs">
              {/* Postal Stamp Replica */}
              <div className="w-16 h-16 shrink-0 bg-[#f3b9a7]/70 rounded-xl flex flex-col items-center justify-center text-center p-1 shadow-xs border-2 border-dashed border-[#222222]/30">
                <span className="font-mono text-[9px] uppercase font-bold text-[#1e0300]">
                  MALANG
                </span>
                <span className="text-sm">📮</span>
                <span className="font-mono text-[8px] font-bold text-[#1e0300]">
                  POS 65139
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#2563eb] font-bold">
                  CURRENT STATUS
                </span>
                <p className="font-sans text-xs sm:text-sm text-[#222222] font-medium leading-snug">
                  Siswa Kelas X TKJ • Eksplorasi Routing BGP/OSPF, Containerization, &amp; AI Systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

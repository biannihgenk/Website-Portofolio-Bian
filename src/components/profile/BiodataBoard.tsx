"use client";

import React from "react";
import { motion } from "framer-motion";
import { SchoolLocationMap } from "./SchoolLocationMap";

interface BiodataBoardProps {
  fullName?: string;
  nickname?: string;
  school?: string;
  studyProgram?: string;
  location?: string;
}

export function BiodataBoard({
  fullName = "Naufal Nizar De Bian Setyo Firwanto",
  nickname = "Bian",
  school = "SMK Telkom Malang",
  studyProgram = "Teknik Komputer dan Jaringan (TKJ)",
  location = "Malang, Jawa Timur, Indonesia",
}: BiodataBoardProps) {
  const cards = [
    {
      code: "IDENTITY // 01",
      title: "Nama Lengkap & Panggilan",
      main: fullName,
      details: [`Panggilan: ${nickname}`, "Alias Tech: Debian", "Angkatan: Moklet A'35 (Kelas X TKJ)"],
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      highlight: false,
    },
    {
      code: "ACADEMIC // 02",
      title: "Pendidikan & Institusi",
      main: school,
      sub: studyProgram,
      desc: "Menempuh pendidikan vokasi teknologi jaringan, mendalami routing BGP/OSPF, arsitektur server Linux, dan rekayasa perangkat lunak modern.",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      highlight: false,
    },
    {
      code: "DOMISILI // 03",
      title: "Lokasi & Tempat Tinggal",
      main: location,
      sub: "Jawa Timur, Indonesia (POS 65139)",
      desc: "Berdomisili dekat kampus SMK Telkom Malang, terbiasa beraktivitas di ekosistem kreatif dan tech community Malang.",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
      highlight: false,
    },
    {
      code: "CORE FOCUS // 04",
      title: "Spesialisasi & Eksplorasi",
      main: "Computer Networks & AI Systems",
      sub: "Hardware, Routing Protocol & Full-Stack Apps",
      desc: "Fokus pada integrasi arsitektur jaringan handal dengan aplikasi cerdas berbasis AI dan antarmuka web modern yang responsif.",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      ),
      highlight: false,
    },
    {
      code: "TECH TOOLBOX // 05",
      title: "Alat & Ekosistem Harian",
      main: "Pondasi Infrastruktur & Code",
      tags: [
        "MikroTik RouterOS",
        "Linux Debian/Ubuntu",
        "Next.js / React",
        "TypeScript",
        "Tailwind CSS",
        "Git & Docker",
      ],
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
      highlight: false,
    },
    {
      code: "OFF-SCREEN // 06",
      title: "Aktivitas di Luar Layar",
      main: "Mindful Reset & Hobby",
      desc: "Menikmati seduhan kopi di kedai lokal, bersepeda santai di udara sejuk Malang, dan memotret lanskap alam pedesaan Jawa Timur.",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      highlight: true,
    },
  ];

  return (
    <section className="w-full my-12 sm:my-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs uppercase bg-[#bfdbfe] text-[#1e40af] px-3 py-1 rounded-full font-bold">
            BIODATA RESMI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold">
            Living Biodata Board
          </h2>
        </div>
        <span className="font-mono text-xs text-[#6b6863] hidden sm:inline-block">
          SEC.02 // PROFILE_VERIFIED
        </span>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.code}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`p-6 rounded-2xl border border-[#ded8cb] shadow-scrapbook relative group hover:shadow-scrapbook-lg transition-all duration-200 ${
              card.highlight ? "bg-[#f3b9a7]/20" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-[#6b6863] uppercase tracking-wider font-bold">
                {card.code}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  card.highlight
                    ? "bg-white text-[#1e0300]"
                    : "bg-[#f5f3ee] text-[#2563eb]"
                }`}
              >
                {card.icon}
              </div>
            </div>

            <h3 className="font-mono text-xs font-bold text-[#6b6863] mb-1">
              {card.title}
            </h3>

            <p className="font-serif text-lg sm:text-xl font-bold text-[#222222] mb-1">
              {card.main}
            </p>

            {card.sub && (
              <p className="font-mono text-xs text-[#2563eb] font-semibold mb-2">
                {card.sub}
              </p>
            )}

            {card.desc && (
              <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed">
                {card.desc}
              </p>
            )}

            {card.details && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {card.details.map((detail) => (
                  <span
                    key={detail}
                    className="bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[11px] px-2.5 py-0.5 rounded-md text-[#222222]"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            )}

            {card.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[11px] px-2.5 py-1 rounded-md text-[#222222]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Interactive Location Map: Direct SMK Telkom Malang */}
      <SchoolLocationMap />
    </section>
  );
}

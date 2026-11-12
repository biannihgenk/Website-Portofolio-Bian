"use client";

import React from "react";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
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
  const locale = useLocale();
  const isId = locale === "id";
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    {
      code: "IDENTITY // 01",
      title: isId ? "Nama Lengkap & Panggilan" : "Full Name & Call Sign",
      main: fullName,
      details: isId
        ? [`Panggilan: ${nickname}`, "Alias Tech: Debian", "Angkatan: Moklet A'35 (Kelas X TKJ)"]
        : [`Nickname: ${nickname}`, "Tech Alias: Debian", "Cohort: Moklet A'35 (Grade X TKJ)"],
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
      title: isId ? "Pendidikan & Institusi" : "Institution & Program",
      main: school,
      sub: studyProgram,
      desc: isId
        ? "Menempuh pendidikan vokasi teknologi jaringan, mendalami routing BGP/OSPF, arsitektur server Linux, dan rekayasa perangkat lunak modern."
        : "Pursuing vocational network engineering, covering BGP/OSPF routing, Linux server architectures, and modern full-stack software development.",
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
      title: isId ? "Lokasi & Basis Aktivitas" : "Location & Base",
      main: location,
      sub: isId ? "Jawa Timur, Indonesia (POS 65139)" : "East Java, Indonesia (65139)",
      desc: isId
        ? "Berdomisili dekat kampus SMK Telkom Malang, aktif di laboratorium kejuruan Sawojajar dan komunitas teknologi Malang."
        : "Based near SMK Telkom Malang, actively practicing in Sawojajar vocational network labs and local engineering communities.",
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
      title: isId ? "Spesialisasi & Eksplorasi" : "Core Focus Areas",
      main: "Computer Networks & AI Systems",
      sub: isId
        ? "Hardware, Routing Protocol & Full-Stack Apps"
        : "Hardware, Routing Protocols & Full-Stack Apps",
      desc: isId
        ? "Fokus pada integrasi arsitektur jaringan andal dengan aplikasi cerdas berbasis AI dan antarmuka web modern yang responsif."
        : "Focused on bridging reliable network architectures with practical AI automation and responsive modern web interfaces.",
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
      title: isId ? "Alat & Ekosistem Harian" : "Daily Ecosystem & Stack",
      main: isId ? "Pondasi Infrastruktur & Code" : "Infrastructure & Code Stack",
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
      title: isId ? "Aktivitas di Luar Layar" : "Off-Screen Routine",
      main: isId ? "Mindful Reset & Minat" : "Mindful Reset & Interests",
      desc: isId
        ? "Menikmati seduhan kopi, bersepeda santai di udara sejuk Malang, dan mendokumentasikan lanskap alam Jawa Timur."
        : "Quiet coffee sessions, cycling around Malang, and capturing documentary landscape photography across East Java.",
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
    <section id="biodata-board" className="w-full my-12 sm:my-16 scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[11px] uppercase bg-[#dbeafe]/80 text-[#1e40af] border border-[#bfdbfe] px-3 py-1 rounded-full font-bold">
            {isId ? "BIODATA RESMI" : "OFFICIAL BIODATA"}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#111827] font-bold tracking-tight">
            {isId ? "Spesifikasi Identitas & Teknis" : "Identity & Technical Specifications"}
          </h2>
        </div>
        <span className="font-mono text-xs text-[#6b6863] hidden sm:inline-block">
          SEC.02 // PROFILE_VERIFIED
        </span>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.code}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.2) }}
            whileHover={shouldReduceMotion ? undefined : { y: -3 }}
            className={`p-6 rounded-2xl border border-[#ded8cb] hover:border-[#2563eb]/45 shadow-xs hover:shadow-md relative transition-all duration-200 ${
              card.highlight ? "bg-[#fbf9f3]" : "bg-white/95"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-[#6b6863] uppercase tracking-wider font-bold">
                {card.code}
              </span>
              <div
                className={`w-8 h-8 rounded-xl border border-[#ded8cb] flex items-center justify-center ${
                  card.highlight
                    ? "bg-white text-[#111827]"
                    : "bg-[#f5f3ee] text-[#2563eb]"
                }`}
              >
                {card.icon}
              </div>
            </div>

            <h3 className="font-mono text-xs font-bold text-[#6b6863] mb-1">
              {card.title}
            </h3>

            <p className="font-serif text-lg sm:text-xl font-bold text-[#111827] mb-1 leading-snug">
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
              <div className="flex flex-wrap gap-1.5 pt-2.5">
                {card.details.map((detail) => (
                  <span
                    key={detail}
                    className="bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[11px] px-2.5 py-0.5 rounded-md text-[#111827]"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            )}

            {card.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[11px] px-2.5 py-1 rounded-md text-[#111827]"
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

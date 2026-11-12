"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/lib/i18n/navigation";

interface ProfileGalleryShowcaseProps {
  avatarUrl?: string | null;
}

export function ProfileGalleryShowcase({ avatarUrl }: ProfileGalleryShowcaseProps) {
  void avatarUrl;
  const locale = useLocale();
  const isId = locale === "id";
  const shouldReduceMotion = useReducedMotion();

  const focusPillars = [
    {
      index: "01",
      title: isId ? "Infrastruktur & Routing Jaringan" : "Network Infrastructure & Routing",
      detail: isId
        ? "Perancangan subnetting, VLAN terstruktur, MikroTik RouterOS, dan dasar Cisco IOS."
        : "Structured subnetting, VLAN segmentation, MikroTik RouterOS, and Cisco IOS fundamentals.",
      tag: "MikroTik • Cisco",
    },
    {
      index: "02",
      title: isId ? "Administrasi Server Linux & Kontainer" : "Linux Server & Container Ops",
      detail: isId
        ? "Konfigurasi daemon Debian 12 (DNS, DHCP, Nginx, SSH) dan lingkungan Docker terisolasi."
        : "Debian 12 server daemon configuration (DNS, DHCP, Nginx, SSH) and isolated Docker hosts.",
      tag: "Debian • Docker",
    },
    {
      index: "03",
      title: isId ? "Pengembangan Web & Automasi AI" : "Full-Stack Web & AI Tooling",
      detail: isId
        ? "Membangun antarmuka bersih berbasis Next.js TypeScript, skema SQL, dan skrip otomasi."
        : "Crafting clean Next.js TypeScript applications, SQL data models, and automation tooling.",
      tag: "Next.js • TS • AI",
    },
  ];

  const fieldSnapshots = [
    {
      src: "/images/debian_real_portrait_2.jpg",
      alt: isId
        ? "Naufal Nizar De Bian berdiskusi santai saat mengeksplorasi studi kasus teknologi"
        : "Naufal Nizar De Bian during a casual tech study session",
      label: isId ? "DISKUSI & KODE" : "STUDY & BUILD",
      caption: isId
        ? "Refleksi antarmuka dan studi kasus pengembangan web."
        : "Interface refinement & full-stack software sessions.",
      objectClass: "object-cover object-[50%_15%]",
    },
    {
      src: "/images/debian_real_portrait_4.jpg",
      alt: isId
        ? "Naufal Nizar De Bian di ruang terbuka persawahan Jawa Timur"
        : "Naufal Nizar De Bian outdoors in East Java countryside",
      label: isId ? "LUAR LAYAR" : "OFF-SCREEN",
      caption: isId
        ? "Menjaga perspektif jernih di ruang terbuka Jawa Timur."
        : "Recharging focus and clarity outdoors in East Java.",
      objectClass: "object-cover object-[50%_20%]",
    },
  ];

  return (
    <section className="w-full my-8 sm:my-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* LEFT COLUMN (6 Cols): Structured Technical Learning Tracks */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="lg:col-span-6 bg-[#0b1120] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-blue-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {isId ? "PILAR KOMPETENSI // X TKJ" : "ENGINEERING PILLARS // X TKJ"}
              </span>
              <span className="font-mono text-[10px] text-slate-400 border border-slate-700/80 px-2.5 py-0.5 rounded-full">
                2024–2026
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
              {isId
                ? "Menjembatani infrastruktur jaringan fisik dengan perangkat lunak modern."
                : "Bridging physical network infrastructure with resilient web software."}
            </h2>
          </div>

          <div className="space-y-3">
            {focusPillars.map((pillar) => (
              <div
                key={pillar.index}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg shrink-0">
                    {pillar.index}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-sans text-sm font-bold text-white">
                      {pillar.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed">
                      {pillar.detail}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block font-mono text-[10px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md shrink-0">
                  {pillar.tag}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-400">
            <span>SMK Telkom Malang • Laboratorium TKJ</span>
            <Link
              href="/education"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              {isId ? "Lihat Kurikulum & Lab →" : "View Curriculum & Labs →"}
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLUMN (6 Cols): Clean Editorial Dual-Photo Perspectives */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.42, delay: 0.08, ease: "easeOut" }}
          className="lg:col-span-6 bg-white/95 rounded-3xl p-5 sm:p-8 border border-[#ded8cb] shadow-xs flex flex-col justify-between gap-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                {isId ? "Perspektif Lapangan & Keseharian" : "Field & Everyday Perspectives"}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b6863] bg-[#fbf9f3] border border-[#ded8cb] px-2.5 py-0.5 rounded-full">
              {isId ? "JAWA TIMUR" : "EAST JAVA"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldSnapshots.map((shot) => (
              <figure
                key={shot.src}
                className="bg-[#fbf9f3] rounded-2xl p-3 border border-[#ded8cb] flex flex-col gap-3 group"
              >
                <div className="relative w-full aspect-[4/4.6] rounded-xl overflow-hidden bg-[#18181b] border border-[#ded8cb]/80">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className={`${shot.objectClass} group-hover:scale-[1.03] transition-transform duration-500`}
                    sizes="(max-width: 640px) 100vw, 280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/15 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                    {shot.label}
                  </span>
                </div>
                <figcaption className="font-sans text-xs text-[#4b5563] leading-relaxed px-0.5">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="pt-3 border-t border-[#ded8cb]/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-serif italic text-[#4b5563]">
              &ldquo;
              {isId
                ? "Keseimbangan antara presisi di terminal dan kejernihan berpikir di luar layar."
                : "Balancing terminal precision with calm, clear perspective off-screen."}
              &rdquo;
            </span>
            <Link
              href="/gallery"
              className="font-mono text-[11px] font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors shrink-0"
            >
              {isId ? "Lihat Galeri →" : "Explore Gallery →"}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

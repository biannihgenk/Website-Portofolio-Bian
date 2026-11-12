"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

type TechTrack = "fullstack" | "network" | "ai";
type PhotoView = "dev" | "campus" | "outdoor";

interface TrackDetail {
  label: string;
  badge: string;
  command: string;
  stack: string;
  metric: string;
  status: string;
}

export function WorkbenchHero() {
  const [activeTrack, setActiveTrack] = useState<TechTrack>("fullstack");
  const [activePhoto, setActivePhoto] = useState<PhotoView>("dev");
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkPassed, setCheckPassed] = useState(false);

  const trackConfigs: Record<TechTrack, TrackDetail> = {
    fullstack: {
      label: "Full-Stack Web",
      badge: "Next.js 15 & TypeScript",
      command: "pnpm build && pnpm test:e2e --coverage",
      stack: "Next.js 15 App Router • TypeScript • Supabase • Tailwind CSS",
      metric: "100 Lighthouse • <20ms Edge Latency",
      status: "Production Ready & Live Deployed",
    },
    network: {
      label: "Jaringan & SysAdmin",
      badge: "MikroTik & Linux Debian",
      command: "/ip route print detail && /tool netwatch monitor",
      stack: "RouterOS v7 • Debian Linux • Docker Containers • VLAN / OSPF",
      metric: "0% Packet Loss • 1.2ms Sawojajar Gateway",
      status: "High Availability Campus Network",
    },
    ai: {
      label: "AI & Automasi",
      badge: "Python & Local LLM",
      command: "python3 -m agents.eval --model=ollama-qwen --stream",
      stack: "Python • Ollama Inference • REST Webhooks • Agentic Workflows",
      metric: "35 tok/sec • Zero External API Cost",
      status: "Autonomous Workflow Active",
    },
  };

  const photoConfigs: Record<
    PhotoView,
    {
      src: string;
      label: string;
      tag: string;
      subtitle: string;
      alt: string;
    }
  > = {
    dev: {
      src: "/images/debian_real_portrait_1.jpg",
      label: "Streetwear & Dev Look",
      tag: "CREATOR & BUILDER",
      subtitle: "Naufal Nizar De Bian • Modern Web & Creative Coder",
      alt: "Debian in white hoodie and AirPods, modern tech creator look",
    },
    campus: {
      src: "/images/debian_real_portrait_2.jpg",
      label: "Varsity Casual",
      tag: "MOKLET A'35 • KELAS X TKJ",
      subtitle: "Debian • Rekayasa Jaringan SMK Telkom Malang",
      alt: "Debian smiling in green varsity jacket",
    },
    outdoor: {
      src: "/images/debian_real_portrait_4.jpg",
      label: "Outdoor & Explorer",
      tag: "FRESH PERSPECTIVE",
      subtitle: "Debian • Keseimbangan Kode, Alam & Pikiran Jernih",
      alt: "Debian in white collared shirt in green rice fields",
    },
  };

  const currentTrack = trackConfigs[activeTrack];
  const currentPhoto = photoConfigs[activePhoto];

  const handleRunDiagnostic = () => {
    if (isRunningCheck) return;
    setIsRunningCheck(true);
    setCheckPassed(false);

    setTimeout(() => {
      setIsRunningCheck(false);
      setCheckPassed(true);
    }, 1100);
  };

  return (
    <section className="relative w-full mb-12 sm:mb-16 pt-2">
      <SubpageBreadcrumb
        sectionIndex="02 / PROYEK"
        sectionLabel="Proyek & Rekayasa"
        sectionLabelEn="Projects & Blueprints"
        rightMeta="SMK TELKOM MALANG"
      />

      {/* Outer Clean Editorial Card Container */}
      <div className="relative w-full bg-white/95 rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#ded8cb] shadow-xs overflow-hidden">
        {/* Top Clean Identification Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ded8cb]/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider">
              PROJECTS &amp; DIGITAL BLUEPRINTS
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf9f3] border border-[#ded8cb] text-xs font-mono font-medium text-[#444748]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SYS STATUS: OPERATIONAL</span>
          </div>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 pt-6 sm:pt-8">
          {/* LEFT COLUMN: Editorial Typography & Interactive Tech Station (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Title & Narrative */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-[#0b0c0c] font-bold tracking-tight leading-[1.12]">
                Rekayasa Sistem, <br />
                <span className="text-[#2563eb] italic font-normal font-serif">
                  Prototipe &amp; Solusi Nyata.
                </span>
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#4b5563] leading-relaxed pt-1 max-w-xl">
                Koleksi karya rekayasa perangkat lunak, sistem jaringan terdistribusi, dan automasi cerdas yang dibangun dengan standar performa industri, kode bersih, dan arsitektur yang terukur.
              </p>
            </div>

            {/* INTERACTIVE TRACK CONSOLE */}
            <div className="bg-[#fbf9f3] rounded-2xl p-4 sm:p-5 shadow-xs border border-[#ded8cb] space-y-4">
              {/* Console Top Bar: Track Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0eee8]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#222222]">
                    debian@workstation:
                  </span>
                  <span className="font-mono text-xs text-[#2563eb] font-semibold">
                    ~/{activeTrack}
                  </span>
                </div>

                {/* Track Switcher */}
                <div className="inline-flex flex-wrap gap-1 p-1 bg-[#f5f2ea] rounded-xl border border-[#ded8cb] max-w-full">
                  {(["fullstack", "network", "ai"] as TechTrack[]).map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => {
                        setActiveTrack(track);
                        setCheckPassed(false);
                      }}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        activeTrack === track
                          ? "bg-white text-[#2563eb] shadow-xs"
                          : "text-[#686660] hover:text-[#222222]"
                      }`}
                    >
                      {trackConfigs[track].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Code Viewport */}
              <div className="bg-[#18181b] rounded-xl p-4 text-white font-mono text-xs space-y-2.5 border border-white/10 shadow-inner">
                <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-1 border-b border-zinc-800">
                  <span className="text-[#60a5fa]">{currentTrack.badge}</span>
                  <span className="text-emerald-400 font-bold">{currentTrack.metric}</span>
                </div>

                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="text-zinc-500">$</span>
                  <span className="truncate">{currentTrack.command}</span>
                </div>

                <div className="text-zinc-300 text-[11px] space-y-1 pt-1">
                  <div>
                    <span className="text-zinc-500">Tech Stack: </span>
                    <span className="text-amber-200">{currentTrack.stack}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Status: </span>
                    <span className="text-cyan-300">{currentTrack.status}</span>
                  </div>
                </div>

                {checkPassed && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 bg-emerald-950/70 border border-emerald-500/40 rounded-lg text-emerald-300 text-[11px] font-bold flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>DIAGNOSTIC PASSED: 0 Errors • 100% Type-Safe • High Performance Build</span>
                  </motion.div>
                )}
              </div>

              {/* Console Action Bar */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[11px] text-[#686660] font-medium hidden sm:inline">
                  Klik untuk uji simulasi pipeline
                </span>
                <button
                  type="button"
                  onClick={handleRunDiagnostic}
                  disabled={isRunningCheck}
                  className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 ml-auto flex items-center gap-2 cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full bg-white ${isRunningCheck ? "animate-ping" : ""}`} />
                  <span>{isRunningCheck ? "Menjalankan Test..." : "Run Build Check"}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="relative max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 bg-[#fbf9f3] rounded-2xl border border-[#ded8cb]">
                  <span className="font-mono text-[10px] text-[#686660] uppercase block font-bold">
                    PROYEK TERVERIFIKASI
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#111827] font-bold mt-0.5">
                    08<span className="text-[#2563eb] text-xl">+</span>
                  </div>
                  <span className="font-sans text-[11px] text-[#686660]">
                    Live &amp; Siap Pakai
                  </span>
                </div>

                <div className="p-3.5 bg-[#fbf9f3] rounded-2xl border border-[#ded8cb]">
                  <span className="font-mono text-[10px] text-[#686660] uppercase block font-bold">
                    STANDAR KODE
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-emerald-600 font-bold mt-0.5">
                    100<span className="text-xl">%</span>
                  </div>
                  <span className="font-sans text-[11px] text-[#686660]">
                    Strict TypeScript
                  </span>
                </div>

                <div className="p-3.5 bg-[#fbf9f3] rounded-2xl border border-[#ded8cb]">
                  <span className="font-mono text-[10px] text-[#686660] uppercase block font-bold">
                    LATENSI JARINGAN
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#2563eb] font-bold mt-0.5">
                    &lt;20<span className="text-base text-[#686660]">ms</span>
                  </div>
                  <span className="font-sans text-[11px] text-[#686660]">
                    Edge Response
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Debian's Real Photo Showcase (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Interactive Photo Mode Switcher */}
            <div className="mb-3 flex flex-wrap justify-center items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-[#ded8cb] shadow-xs z-20 max-w-full">
              {(["dev", "campus", "outdoor"] as PhotoView[]).map((pv) => (
                <button
                  key={pv}
                  type="button"
                  onClick={() => setActivePhoto(pv)}
                  className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    activePhoto === pv
                      ? "bg-[#2563eb] text-white shadow-xs"
                      : "text-[#686660] hover:text-[#222222]"
                  }`}
                >
                  {photoConfigs[pv].label}
                </button>
              ))}
            </div>

            {/* Main Photo Frame */}
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="relative bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-[#ded8cb] z-10">
                {/* Real Photo with Smooth Crossfade */}
                <div className="relative rounded-2xl overflow-hidden bg-[#18181b] aspect-[3/4] flex items-center justify-center border border-[#ded8cb]/80 group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhoto.src}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentPhoto.src}
                        alt={currentPhoto.alt}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Real Identity Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-[#ded8cb] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div className="truncate">
                        <span className="font-mono text-xs font-bold text-[#222222] block truncate">
                          Naufal Nizar De Bian
                        </span>
                        <span className="font-mono text-[10px] text-[#686660] block truncate">
                          Builder • SMK Telkom Malang
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] bg-[#dbeafe] text-[#1e40af] font-bold px-2 py-0.5 rounded-md shrink-0">
                      Moklet A&apos;35
                    </span>
                  </div>

                  {/* Top Right Live Tag */}
                  <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white font-mono text-[10px] font-bold border border-white/20">
                    REAL PHOTO • VERIFIED
                  </div>
                </div>

                {/* Card Caption */}
                <div className="pt-3.5 flex flex-col gap-1 px-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-[#222222]">
                      “Fokus pada Solusi, Bukan Sekadar Kode.”
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#686660] leading-relaxed">
                    Setiap arsitektur dirancang dari permasalahan nyata—menghubungkan perangkat keras, otomasi cerdas, dan antarmuka web modern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

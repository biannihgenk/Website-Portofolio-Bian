"use client";

import React from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

export function ExploringFocus() {
  const t = useTranslations("exploring");

  const cards = [
    {
      index: "01",
      category: "Full-Stack & Web Architecture",
      title: t("track1Title"),
      desc: t("track1Desc"),
      tools: ["TypeScript", "Next.js 15", "Tailwind CSS", "PostgreSQL", "REST APIs"],
      status: t("track1Status"),
      statusPill: "● Active Build",
      statusColor: "text-blue-600",
      href: "#projects",
      artTheme: "web",
      telemetry: "Next.js 15 • TypeScript 5 • PostgreSQL • Tailwind",
      toolsList: [
        { name: "Next.js", ver: "v15", icon: "nextjs", color: "from-zinc-800 to-black text-white" },
        { name: "TypeScript", ver: "v5.6", icon: "ts", color: "bg-[#3178c6] text-white" },
        { name: "React", ver: "v19", icon: "react", color: "bg-[#087ea4]/20 text-[#149eca] border-[#087ea4]/40" },
        { name: "Tailwind", ver: "v4.0", icon: "tailwind", color: "bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9]/40" },
        { name: "PostgreSQL", ver: "SQL", icon: "postgres", color: "bg-[#336791]/25 text-[#7aa9d2] border-[#336791]/40" },
        { name: "REST / APIs", ver: "Edge", icon: "api", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
      ],
    },
    {
      index: "02",
      category: "Core TKJ & Network Engineering",
      title: t("track2Title"),
      desc: t("track2Desc"),
      tools: ["MikroTik RouterOS", "Debian Linux", "Cisco Packet Tracer", "Wireshark", "VLAN / Subnetting"],
      status: t("track2Status"),
      statusPill: "⚡ Lab Tested",
      statusColor: "text-blue-600",
      href: "/education",
      artTheme: "network",
      telemetry: "RouterOS v7 • Debian 12 GNU/Linux • Cisco IOS",
      toolsList: [
        { name: "MikroTik", ver: "v7.x", icon: "mikrotik", color: "bg-[#2563eb]/20 text-blue-300 border-blue-500/40" },
        { name: "Debian", ver: "12 Bookworm", icon: "debian", color: "bg-[#d70a53]/20 text-[#f472b6] border-[#d70a53]/40" },
        { name: "Cisco", ver: "Catalyst", icon: "cisco", color: "bg-[#049fd9]/20 text-[#38bdf8] border-[#049fd9]/40" },
        { name: "Wireshark", ver: "Packet Analysis", icon: "wireshark", color: "bg-[#185e9e]/25 text-[#60a5fa] border-[#185e9e]/40" },
        { name: "Linux Bash", ver: "Kernel 6.x", icon: "bash", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
        { name: "VLAN / OSPF", ver: "802.1Q", icon: "network", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" },
      ],
    },
    {
      index: "03",
      category: "AI Tooling & Custom Automation",
      title: t("track3Title"),
      desc: t("track3Desc"),
      tools: ["Ollama & Local LLMs", "Python Automation", "Prompt Engineering", "Figma UI Systems", "FastAPI"],
      status: t("track3Status"),
      statusPill: "✦ Active Research",
      statusColor: "text-blue-600",
      href: "#blog",
      artTheme: "ai",
      telemetry: "Ollama Local LLMs • Python 3.12 • FastAPI • Figma",
      toolsList: [
        { name: "Python", ver: "3.12", icon: "python", color: "bg-[#3776ab]/25 text-[#93c5fd] border-[#3776ab]/40" },
        { name: "Ollama", ver: "Local LLM", icon: "ollama", color: "bg-zinc-800 text-zinc-100 border-zinc-700" },
        { name: "FastAPI", ver: "Async API", icon: "fastapi", color: "bg-[#059669]/25 text-emerald-300 border-emerald-500/40" },
        { name: "Figma", ver: "UI Systems", icon: "figma", color: "bg-[#a259ff]/20 text-purple-300 border-[#a259ff]/40" },
        { name: "Automation", ver: "Cron & CLI", icon: "bot", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
        { name: "Prompting", ver: "Engineered", icon: "sparkle", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
      ],
    },
  ];

  // Helper to render crisp official SVG logos
  const renderToolIcon = (icon: string) => {
    switch (icon) {
      case "nextjs":
        return (
          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 180 180">
            <mask height="180" id="mask-next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
              <circle cx="90" cy="90" fill="black" r="90" />
            </mask>
            <g mask="url(#mask-next)">
              <circle cx="90" cy="90" data-circle="true" fill="black" r="90" />
              <path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.136 149.508 157.438Z" fill="white" />
              <rect fill="white" height="72" width="12" x="115" y="54" />
            </g>
          </svg>
        );
      case "ts":
        return (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#3178C6" />
            <path d="M4 10h6m-3 0v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 17.5c1 1.5 2.5 1.5 3.5.5s1-2-1-3-3-2-3-3.5 1-2.5 3-2.5c1.5 0 2.5.5 3 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "react":
        return (
          <svg className="w-4 h-4 shrink-0 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5">
            <ellipse cx="12" cy="12" rx="9" ry="3.5" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
            <circle cx="12" cy="12" r="1.5" fill="#38bdf8" />
          </svg>
        );
      case "tailwind":
        return (
          <svg className="w-4 h-4 shrink-0 fill-[#38bdf8]" viewBox="0 0 24 24">
            <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
          </svg>
        );
      case "postgres":
        return (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#7aa9d2" strokeWidth="1.7">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          </svg>
        );
      case "api":
        return (
          <svg className="w-4 h-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            <path d="M14 4l-4 16" />
          </svg>
        );
      case "mikrotik":
        return (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <circle cx="7" cy="12" r="1.5" fill="#60a5fa" />
            <circle cx="12" cy="12" r="1.5" fill="#60a5fa" />
            <circle cx="17" cy="12" r="1.5" fill="#60a5fa" />
            <path d="M6 3v3M18 3v3" />
          </svg>
        );
      case "debian":
        return (
          <svg className="w-4 h-4 shrink-0 fill-[#f472b6]" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5 0-1.8 1.07-3.35 2.62-4.05.35-.16.76-.02.93.33.16.35.02.76-.33.93-1.12.51-1.9 1.65-1.9 2.97 0 1.76 1.43 3.19 3.19 3.19.86 0 1.65-.34 2.23-.9.27-.26.69-.25.96.02.26.27.25.69-.02.96-.8.77-1.88 1.25-3.08 1.25z" />
          </svg>
        );
      case "cisco":
        return (
          <svg className="w-4 h-4 shrink-0 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="10" width="2" height="4" rx="1" />
            <rect x="6" y="6" width="2" height="8" rx="1" />
            <rect x="10" y="4" width="2" height="10" rx="1" />
            <rect x="14" y="4" width="2" height="10" rx="1" />
            <rect x="18" y="6" width="2" height="8" rx="1" />
            <rect x="22" y="10" width="2" height="4" rx="1" />
            <rect x="2" y="16" width="22" height="2" rx="1" />
          </svg>
        );
      case "wireshark":
        return (
          <svg className="w-4 h-4 shrink-0 text-[#60a5fa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 17c5-8 11-12 18-12-2 6-4 12-18 12z" fill="#60a5fa" fillOpacity="0.25" />
            <path d="M3 17c5-8 11-12 18-12-2 6-4 12-18 12z" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        );
      case "bash":
        return (
          <svg className="w-4 h-4 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );
      case "network":
        return (
          <svg className="w-4 h-4 shrink-0 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="6" height="6" rx="1" />
            <rect x="15" y="4" width="6" height="6" rx="1" />
            <rect x="9" y="14" width="6" height="6" rx="1" />
            <path d="M6 10v2a2 2 0 002 2h8a2 2 0 002-2v-2" />
            <path d="M12 14v-2" />
          </svg>
        );
      case "python":
        return (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M11.9 2c-3.1 0-4.9.3-4.9 1.9v2.2h4.9v.7H4.3C2.3 6.8 2 8.7 2 11.2s.8 4.3 2.8 4.3h1.6v-2.3c0-1.7 1.4-3.1 3.1-3.1h4.9c1.4 0 2.5-1.1 2.5-2.5V3.9c0-1.6-2.1-1.9-5-1.9zm-2.4 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="#38bdf8" />
            <path d="M12.1 22c3.1 0 4.9-.3 4.9-1.9v-2.2h-4.9v-.7h7.6c2 0 2.3-1.9 2.3-4.4s-.8-4.3-2.8-4.3h-1.6v2.3c0 1.7-1.4 3.1-3.1 3.1H9.6c-1.4 0-2.5 1.1-2.5 2.5v3.7c0 1.6 2.1 1.9 5 1.9zm2.4-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="#facc15" />
          </svg>
        );
      case "ollama":
        return (
          <svg className="w-4 h-4 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" />
            <path d="M9 15c1 1 5 1 6 0" />
          </svg>
        );
      case "fastapi":
        return (
          <svg className="w-4 h-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case "figma":
        return (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="2" width="7" height="7" rx="3.5" fill="#F24E1E" />
            <rect x="12" y="2" width="7" height="7" rx="3.5" fill="#FF7262" />
            <rect x="5" y="9" width="7" height="7" rx="3.5" fill="#A259FF" />
            <circle cx="15.5" cy="12.5" r="3.5" fill="#1ABCFE" />
            <path d="M5 16h3.5A3.5 3.5 0 0112 19.5v0A3.5 3.5 0 018.5 23H5v-7z" fill="#0ACF83" />
          </svg>
        );
      case "bot":
        return (
          <svg className="w-4 h-4 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="8" width="16" height="12" rx="3" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            <path d="M12 5V8M8 5h8" />
          </svg>
        );
      case "sparkle":
      default:
        return (
          <svg className="w-4 h-4 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
          </svg>
        );
    }
  };

  return (
    <section id="exploring" className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 sm:mb-14">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-700 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#222222] tracking-tight">
            {t("title")}
          </h2>
        </div>
        <p className="font-sans text-sm sm:text-base text-[#6b6863] max-w-md leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* 3 Interactive Modern Folder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((item) => {
          const cardContent = (
            <>
            {/* ─────────────────────────────────────────────────── */}
            {/* 1. UPPER VISUAL ART STAGE: PROFESSIONAL TOOL CLUSTER */}
            {/* ─────────────────────────────────────────────────── */}
            <div className="relative w-full h-52 sm:h-56 bg-[#0b101b] p-4.5 flex flex-col justify-between overflow-hidden select-none border-b border-zinc-800">
              {/* Subtle Tech Blueprint Dot Matrix Overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Ambient Glow Gradient */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

              {/* Top Eyebrow Tag inside Art Window */}
              <div className="flex items-center justify-between relative z-10">
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-wider text-zinc-200 font-bold">
                  {item.category}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-400/30 text-[10px] font-mono text-blue-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>Verified Stack</span>
                </div>
              </div>

              {/* Center Tech Stack Cluster Grid (Authentic Tool Badges) */}
              <div className="relative z-10 grid grid-cols-3 gap-2 my-auto py-1">
                {item.toolsList.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex flex-col items-start justify-center p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-blue-400/40 backdrop-blur-sm transition-all duration-200 group/tool"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      {renderToolIcon(tool.icon)}
                      <span className="text-[9px] font-mono text-zinc-400 font-medium">
                        {tool.ver}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-100 truncate w-full group-hover/tool:text-blue-300 transition-colors">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Technical Telemetry Strip */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-zinc-400 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                <span className="truncate max-w-[200px] text-zinc-300 font-medium">
                  {item.telemetry}
                </span>
                <span className="text-emerald-400 shrink-0 font-bold">Active</span>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────── */}
            {/* 2. THE SIGNATURE FOLDER STEPPED TAB (Folder Cutout) */}
            {/* ─────────────────────────────────────────────────── */}
            <div className="relative -mt-7 sm:-mt-8 z-10 w-full pointer-events-none select-none">
              <svg
                viewBox="0 0 400 58"
                className="w-full h-14 sm:h-16 text-white block fill-current filter drop-shadow-[0_-2px_4px_rgba(0,0,0,0.03)]"
                preserveAspectRatio="none"
              >
                <path d="M 0 58 L 0 16 C 0 7.16 7.16 0 16 0 L 115 0 C 126 0 131 8 135 18 C 139 26 145 32 156 32 L 384 32 C 392.84 32 400 39.16 400 48 L 400 58 Z" />
              </svg>

              {/* Layer with Index Number and Corner Action Arrow */}
              <div className="absolute inset-0 flex items-center justify-between px-5 sm:px-6 pointer-events-auto">
                {/* Index 01, 02, 03 on the Elevated Tab */}
                <div className="flex items-center gap-1.5 -mt-3.5 sm:-mt-4">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#0b0c0c] tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.index}
                  </span>
                </div>

                {/* Corner Action Arrow on the Lower Shelf */}
                <div className="mt-2.5 sm:mt-3">
                  <span className="w-8 h-8 rounded-full bg-[#f5f3ee] group-hover:bg-blue-600 text-[#222222] group-hover:text-white border border-[#ded8cb] group-hover:border-blue-600 flex items-center justify-center transition-all duration-300 font-mono text-xs font-bold shadow-2xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────── */}
            {/* 3. FOLDER DOSSIER BODY (Content, Tech Stack & Status) */}
            {/* ─────────────────────────────────────────────────── */}
            <div className="px-6 sm:px-7 pt-2 pb-6 flex-1 flex flex-col justify-between bg-white space-y-5">
              <div className="space-y-2.5">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#222222] group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Tech Stack Chips */}
              <div className="space-y-2 pt-1">
                <div className="font-mono text-[10px] text-[#6b6863] uppercase tracking-wider font-bold">
                  Core Toolkit:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-md bg-[#f5f3ee] hover:bg-blue-50 border border-[#ded8cb] hover:border-blue-200 font-mono text-xs text-[#222222] hover:text-blue-700 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dossier Bottom Footer Status Bar */}
              <div className="pt-3.5 mt-2 border-t border-[#ded8cb] flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#222222] truncate max-w-[190px]">
                  {item.status}
                </span>
                <span className={`font-bold shrink-0 ${item.statusColor}`}>
                  {item.statusPill}
                </span>
              </div>
            </div>
            </>
          );

          const cardClasses =
            "group relative h-full bg-white rounded-3xl border border-[#ded8cb] shadow-scrapbook hover:shadow-[0_20px_35px_-10px_rgba(37,99,235,0.16)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer";

          return (
            <motion.div
              key={item.index}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              {item.href.startsWith("#") ? (
                <a href={item.href} className={cardClasses}>
                  {cardContent}
                </a>
              ) : (
                <Link href={item.href} className={cardClasses}>
                  {cardContent}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

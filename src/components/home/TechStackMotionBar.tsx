"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TechItem {
  id: string;
  name: string;
  category: "networking" | "web" | "devops";
  icon: string;
  tag: string;
  role: string;
  description: string;
}

const TECH_STACK_DATA: TechItem[] = [
  {
    id: "nextjs",
    name: "Next.js 15",
    category: "web",
    icon: "/images/tech/nextjs.png",
    tag: "SSR & App Router",
    role: "Fullstack Architecture",
    description: "Framework utama untuk arsitektur modern berkecepatan tinggi, Server Actions, route handlers, dan integrasi API yang scalable.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "web",
    icon: "/images/tech/typescript.png",
    tag: "Strict Typing",
    role: "Core Language",
    description: "Fondasi codebase dengan strict typing 100% untuk mencegah runtime bug dan mempercepat refactoring kode kompleks.",
  },
  {
    id: "react",
    name: "React 19",
    category: "web",
    icon: "/images/tech/react.png",
    tag: "UI Engineering",
    role: "Component Engine",
    description: "Membangun antarmuka interaktif responsif, hooks custom, micro-animations, dan manajemen state berbasis event.",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "web",
    icon: "/images/tech/tailwind.png",
    tag: "Design System",
    role: "Styling & Tokens",
    description: "Desain editorial modern, tokenisasi warna, typography Google Fonts, dan utilitas responsif tanpa bloatware CSS.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "web",
    icon: "/images/tech/nodejs.png",
    tag: "Runtime",
    role: "Backend & Tooling",
    description: "Eksekusi asynchronous server-side, build tooling modern, socket realtime, dan microservices API.",
  },
  {
    id: "python",
    name: "Python",
    category: "devops",
    icon: "/images/tech/python.png",
    tag: "Scripting & NetAuto",
    role: "Automation",
    description: "Scripting otomasi konfigurasi perangkat jaringan (Netmiko/Scapy), data parsing, dan eksplorasi model AI lokal.",
  },
  {
    id: "router",
    name: "MikroTik & Cisco",
    category: "networking",
    icon: "/images/tech/router.png",
    tag: "Routing Engine",
    role: "Core Networking",
    description: "Konfigurasi protokol routing enterprise: OSPF dynamic routing, BGP multi-homing, NAT masquerade, firewall mangle, dan QoS bandwidth limiter.",
  },
  {
    id: "switch",
    name: "L2 / L3 Switching",
    category: "networking",
    icon: "/images/tech/switch.png",
    tag: "VLAN & Trunking",
    role: "Campus LAN",
    description: "Segmentasi jaringan berbasis IEEE 802.1Q VLAN, spanning tree (STP/RSTP) loop prevention, LACP link aggregation, dan DHCP snooping.",
  },
  {
    id: "server",
    name: "Homelab Rack",
    category: "networking",
    icon: "/images/tech/server.png",
    tag: "Proxmox & PVE",
    role: "Bare-Metal Lab",
    description: "Infrastruktur server fisik rumahan (bare-metal) untuk simulasi virtual router, telemetri jaringan, dan kluster testing 24/7.",
  },
  {
    id: "docker",
    name: "Docker & Swarm",
    category: "devops",
    icon: "/images/tech/docker.png",
    tag: "Containers",
    role: "Virtualization",
    description: "Containerization multi-layanan homelab, isolasi environment testing, pembuatan Dockerfile efisien, dan orkestrasi container ringan.",
  },
  {
    id: "debian",
    name: "Debian GNU/Linux",
    category: "devops",
    icon: "/images/tech/debian.png",
    tag: "Server OS",
    role: "SysAdmin & Kernel",
    description: "Sistem operasi andalan untuk gateway internet lab, DNS resolver BIND9, reverse proxy Nginx, dan server security hardening.",
  },
  {
    id: "linux",
    name: "Linux Shell",
    category: "devops",
    icon: "/images/tech/linux.png",
    tag: "Bash & POSIX",
    role: "Systems Command",
    description: "Administrasi sistem via terminal CLI, automation cron jobs, monitoring log htop/tcpdump, dan permission policy management.",
  },
  {
    id: "postgresql",
    name: "PostgreSQL & Supabase",
    category: "web",
    icon: "/images/tech/postgresql.png",
    tag: "Relational DB",
    role: "Database Engine",
    description: "Relational database dengan schema migrations, Row-Level Security (RLS), ACID compliance, dan realtime data subscription.",
  },
  {
    id: "git",
    name: "Git VCS",
    category: "devops",
    icon: "/images/tech/git.png",
    tag: "Version Control",
    role: "Source Control",
    description: "Trunk-based workflow, commit audit trail, conflict resolution, rebase, dan branching strategy terstruktur.",
  },
  {
    id: "github",
    name: "GitHub Actions",
    category: "devops",
    icon: "/images/tech/github.png",
    tag: "CI/CD Pipeline",
    role: "DevOps Pipeline",
    description: "Automated linting, testing, dan deployment continuous integration langsung ke server hosting dan VPS lab.",
  },
  {
    id: "figma",
    name: "Figma",
    category: "web",
    icon: "/images/tech/figma.png",
    tag: "UI/UX System",
    role: "Design Prototyping",
    description: "Prototyping wireframe antarmuka, auto-layout tokens, eksplorasi bento grid visual, dan kurasi estetika editorial portofolio.",
  },
];

export function TechStackMotionBar() {
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "web" | "networking" | "devops">("all");

  // Play crisp technological click chime
  const playTechClickChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {}
  };

  const handleCardClick = (tech: TechItem) => {
    playTechClickChime();
    setSelectedTech((prev) => (prev?.id === tech.id ? null : tech));
  };

  // Divide into 2 rows for opposing continuous gliding motions
  const midIndex = Math.ceil(TECH_STACK_DATA.length / 2);
  const row1 = TECH_STACK_DATA.slice(0, midIndex);
  const row2 = TECH_STACK_DATA.slice(midIndex);

  // Duplicate 4 times for seamless infinite loops
  const infiniteRow1 = [...row1, ...row1, ...row1, ...row1];
  const infiniteRow2 = [...row2, ...row2, ...row2, ...row2];

  return (
    <section className="w-full relative z-20 py-12 sm:py-18 overflow-hidden select-none">
      {/* Background Subtle Accent with Grid Borders */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xs border-y border-[#ded8cb]/80 pointer-events-none" />

      {/* Section Header with Refined Typography & Category Filter Tags */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-8 sm:mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-3.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
            TECH STACK &amp; TOOLS • LIVE KINETIC DISPLAY
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#222222] tracking-tight">
          Teknologi &amp; Perangkat Rekayasa
        </h3>

        <p className="font-sans text-xs sm:text-sm text-[#6b6863] max-w-lg mx-auto mt-2 leading-relaxed">
          Kumpulan teknologi dan ekosistem perangkat lunak yang aktif saya gunakan dalam membangun sistem web dan infrastruktur jaringan.
        </p>

        {/* Interactive Category Highlight Buttons */}
        <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-[#222222] text-white shadow-xs"
                : "bg-white text-[#6b6863] border border-[#ded8cb] hover:border-[#222222]"
            }`}
          >
            Semua (16)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("web")}
            className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
              activeCategory === "web"
                ? "bg-[#2563eb] text-white shadow-xs"
                : "bg-white text-[#6b6863] border border-[#ded8cb] hover:border-blue-400"
            }`}
          >
            🌐 Web &amp; Apps (6)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("networking")}
            className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
              activeCategory === "networking"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-[#6b6863] border border-[#ded8cb] hover:border-emerald-400"
            }`}
          >
            📡 Core Networking (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("devops")}
            className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
              activeCategory === "devops"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-[#6b6863] border border-[#ded8cb] hover:border-purple-400"
            }`}
          >
            🐧 Linux &amp; DevOps (7)
          </button>
        </div>
      </div>

      {/* Infinite Gliding Ticker Containers (Dual Opposing Parallax Glides) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] py-2 space-y-4 sm:space-y-5">
        {/* Row 1: Leftward Infinite Gliding Motion */}
        <div className="flex items-center gap-3.5 sm:gap-5 w-max animate-glide-left py-1">
          {infiniteRow1.map((tech, idx) => {
            const isMatch = activeCategory === "all" || activeCategory === tech.category;
            const isSelected = selectedTech?.id === tech.id;
            return (
              <div
                key={`row1-${tech.id}-${idx}`}
                onClick={() => handleCardClick(tech)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-sm border transition-all duration-300 cursor-pointer group shrink-0 ${
                  isSelected
                    ? "border-[#2563eb] ring-2 ring-[#2563eb]/20 shadow-md scale-102 bg-blue-50/20"
                    : isMatch
                    ? "border-[#ded8cb] shadow-xs hover:border-[#2563eb] hover:shadow-md hover:-translate-y-1.5"
                    : "opacity-45 border-[#ded8cb]/50 grayscale hover:grayscale-0 hover:opacity-100"
                }`}
                title={`Klik untuk lihat detail ${tech.name}`}
              >
                {/* Actively Floating Icon Container with Wave Delay */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fbf9f3] p-1.5 flex items-center justify-center shrink-0 border border-[#ded8cb]/70 group-hover:border-blue-300 group-hover:bg-blue-50/50 group-hover:shadow-xs transition-colors"
                >
                  <div
                    className="w-full h-full animate-icon-float"
                    style={{ animationDelay: `${(idx % 5) * 0.35}s` }}
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300 drop-shadow-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#222222] group-hover:text-[#2563eb] transition-colors whitespace-nowrap">
                      {tech.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-blue-50 text-[#2563eb] border border-blue-200/70 whitespace-nowrap">
                      {tech.tag}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6b6863] whitespace-nowrap">
                    {tech.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Rightward Opposing Parallax Gliding Motion */}
        <div className="flex items-center gap-3.5 sm:gap-5 w-max animate-glide-right py-1">
          {infiniteRow2.map((tech, idx) => {
            const isMatch = activeCategory === "all" || activeCategory === tech.category;
            const isSelected = selectedTech?.id === tech.id;
            return (
              <div
                key={`row2-${tech.id}-${idx}`}
                onClick={() => handleCardClick(tech)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-sm border transition-all duration-300 cursor-pointer group shrink-0 ${
                  isSelected
                    ? "border-[#2563eb] ring-2 ring-[#2563eb]/20 shadow-md scale-102 bg-blue-50/20"
                    : isMatch
                    ? "border-[#ded8cb] shadow-xs hover:border-[#2563eb] hover:shadow-md hover:-translate-y-1.5"
                    : "opacity-45 border-[#ded8cb]/50 grayscale hover:grayscale-0 hover:opacity-100"
                }`}
                title={`Klik untuk lihat detail ${tech.name}`}
              >
                {/* Actively Floating Icon Container with Wave Delay */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#fbf9f3] p-1.5 flex items-center justify-center shrink-0 border border-[#ded8cb]/70 group-hover:border-amber-300 group-hover:bg-amber-50/50 group-hover:shadow-xs transition-colors"
                >
                  <div
                    className="w-full h-full animate-icon-float"
                    style={{ animationDelay: `${((idx + 2) % 5) * 0.35}s` }}
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300 drop-shadow-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#222222] group-hover:text-[#2563eb] transition-colors whitespace-nowrap">
                      {tech.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/70 whitespace-nowrap">
                      {tech.tag}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6b6863] whitespace-nowrap">
                    {tech.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Modal Drawer when a Card is Clicked */}
      <AnimatePresence>
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-2xl mx-auto px-4 mt-6 relative z-30"
          >
            <div className="bg-white/98 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#2563eb]/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 p-2 shrink-0 flex items-center justify-center">
                  <Image
                    src={selectedTech.icon}
                    alt={selectedTech.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-lg font-bold text-[#222222]">
                      {selectedTech.name}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {selectedTech.tag}
                    </span>
                    <span className="font-mono text-[10px] text-[#6b6863]">
                      • {selectedTech.role}
                    </span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#444748] leading-relaxed">
                    {selectedTech.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-[#f5f2ea] hover:bg-[#ded8cb] text-[#222222] font-mono text-xs font-bold transition-colors cursor-pointer shrink-0 border border-[#ded8cb]"
              >
                Tutup ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

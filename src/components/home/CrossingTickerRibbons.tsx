"use client";

import React from "react";

const FRONT_RIBBON_ITEMS = [
  "WEB & NETWORK ENGINEER",
  "NEXT.JS 15 & TYPESCRIPT",
  "MIKROTIK ROUTEROS",
  "DEBIAN LINUX SYSADMIN",
  "CISCO & VLAN TOPOLOGY",
  "POSTGRESQL & SUPABASE",
  "AI & AUTOMATION",
  "SMK TELKOM MALANG",
];

const BACK_RIBBON_ITEMS = [
  "FULL-STACK ARCHITECTURE",
  "OSPF & BGP ROUTING",
  "DOCKER HOMELAB",
  "CYBER SECURITY",
  "REST & SERVERLESS API",
  "TAILWIND CSS",
  "PYTHON SCRIPTING",
  "OPEN FOR COLLABORATION",
];

export function CrossingTickerRibbons() {
  return (
    <div
      className="relative w-full py-4 sm:py-6 overflow-hidden select-none"
      aria-label="Technical Disciplines Marquee"
    >
      {/* Centered X-Crossing Stage */}
      <div className="relative w-full h-24 sm:h-32 lg:h-36 flex items-center justify-center">
        {/* Back Ribbon: Dark Navy / Obsidian (tilted slightly upward left-to-right, moving right) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[128%] sm:w-[118%] -rotate-[2.4deg] sm:-rotate-[1.8deg] lg:-rotate-[1.5deg] bg-gradient-to-r from-[#090e1c] via-[#0f172a] to-[#090e1c] text-slate-100 py-2.5 sm:py-3.5 border-y border-white/15 shadow-[0_10px_28px_rgba(9,14,28,0.22)] z-10 overflow-hidden">
          <div className="animate-marquee-right flex items-center font-mono text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] whitespace-nowrap">
            {[0, 1].map((copyIdx) => (
              <div
                key={copyIdx}
                aria-hidden={copyIdx === 1}
                className="flex items-center shrink-0 gap-6 sm:gap-10 pr-6 sm:pr-10"
              >
                {[...BACK_RIBBON_ITEMS, ...BACK_RIBBON_ITEMS].map((item, idx) => (
                  <span
                    key={`${copyIdx}-${idx}`}
                    className="inline-flex items-center gap-6 sm:gap-10 text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{item}</span>
                    <span className="text-blue-400/90 text-xs">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Front Ribbon: Vibrant Royal Blue (tilted slightly downward left-to-right, moving left) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[128%] sm:w-[118%] rotate-[2.2deg] sm:rotate-[1.6deg] lg:rotate-[1.4deg] bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#2563eb] text-white py-2.5 sm:py-3.5 border-y border-white/25 shadow-[0_12px_32px_rgba(37,99,235,0.28)] z-20 overflow-hidden">
          <div className="animate-marquee-left flex items-center font-mono text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] whitespace-nowrap">
            {[0, 1].map((copyIdx) => (
              <div
                key={copyIdx}
                aria-hidden={copyIdx === 1}
                className="flex items-center shrink-0 gap-6 sm:gap-10 pr-6 sm:pr-10"
              >
                {[...FRONT_RIBBON_ITEMS, ...FRONT_RIBBON_ITEMS].map((item, idx) => (
                  <span
                    key={`${copyIdx}-${idx}`}
                    className="inline-flex items-center gap-6 sm:gap-10 text-white hover:text-blue-50 transition-colors"
                  >
                    <span>{item}</span>
                    <span className="text-white/75 text-xs">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


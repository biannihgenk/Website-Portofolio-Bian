"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type FilmFilter = "warm" | "teal" | "bw";

export function GalleryHero() {
  const [shotsCount, setShotsCount] = useState(1);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [filmFilter, setFilmFilter] = useState<FilmFilter>("warm");

  // Synthesize an authentic retro mechanical camera shutter sound using Web Audio API
  const triggerShutter = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        // Mechanical click #1 (mirror flip up)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.04);

        // Curtain snap #2 (shutter curtain)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(450, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(80, now + 0.11);
        gain2.gain.setValueAtTime(0.5, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.11);
      }
    } catch {
      // AudioContext may be blocked before interaction, fail gracefully
    }

    // Visual camera flash effect
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 260);

    setShotsCount((prev) => (prev >= 36 ? 1 : prev + 1));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getFilterStyle = () => {
    switch (filmFilter) {
      case "teal":
        return "contrast(1.08) saturate(1.2) hue-rotate(15deg)";
      case "bw":
        return "grayscale(1) contrast(1.15)";
      case "warm":
      default:
        return "sepia(0.12) contrast(1.05) saturate(1.1)";
    }
  };

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 pb-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12 relative">
        {/* Left Column: Title, Volume, Narrative, and Sticky Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl relative z-10 flex flex-col gap-4"
        >
          {/* Eyebrow with scrapbook stamp styling */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#bfdbfe] text-[#1e40af] font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs border border-[#1e40af]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
              MOMENTS &amp; VISUAL ARCHIVE
            </span>
            <span className="font-mono text-xs text-[#686660] bg-white border border-[#ded8cb] px-2.5 py-0.5 rounded-full font-bold">
              / 2024–2026 • 35MM EDITION
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0b0c0c] tracking-tight font-bold leading-[1.12]">
            Little Things,{" "}
            <span className="italic font-normal text-[#2563eb] relative inline-block">
              Precious Memories.
              {/* Organic underline doodle */}
              <svg
                className="w-full h-3 text-[#2563eb]/60 absolute -bottom-2 left-0"
                fill="none"
                viewBox="0 0 240 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C55 3 145 2 238 8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="font-sans text-base sm:text-lg text-[#444748] leading-relaxed max-w-xl pt-1">
            Kumpulan potret momen di sela keseharian—dari sesi praktikum mikrotik, lorong sekolah SMK Telkom Malang, baris kode larut malam, hingga sudut tenang kota Malang yang selalu dirindukan.
          </p>

          {/* Film Tone Switcher (Interactive Motion Feature) */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="font-mono text-[11px] text-[#686660] uppercase font-bold mr-1">
              Film Simulation:
            </span>
            <button
              type="button"
              onClick={() => setFilmFilter("warm")}
              className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all ${
                filmFilter === "warm"
                  ? "bg-[#fef3c7] text-[#92400e] shadow-xs border border-[#fde68a]"
                  : "bg-white text-[#686660] border border-[#ded8cb] hover:bg-[#f5f2ea]"
              }`}
            >
              🎞️ Kodak Gold (Warm)
            </button>
            <button
              type="button"
              onClick={() => setFilmFilter("teal")}
              className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all ${
                filmFilter === "teal"
                  ? "bg-[#dbeafe] text-[#1e40af] shadow-xs border border-[#bfdbfe]"
                  : "bg-white text-[#686660] border border-[#ded8cb] hover:bg-[#f5f2ea]"
              }`}
            >
              🏙️ Cinematic Teal
            </button>
            <button
              type="button"
              onClick={() => setFilmFilter("bw")}
              className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all ${
                filmFilter === "bw"
                  ? "bg-zinc-800 text-white shadow-xs border border-zinc-700"
                  : "bg-white text-[#686660] border border-[#ded8cb] hover:bg-[#f5f2ea]"
              }`}
            >
              📼 Monochrome B&amp;W
            </button>
          </div>

          {/* Handwritten / Doodle Note Sticker & Interactive 35mm Film Roll Sticker */}
          <div className="flex items-center gap-4 flex-wrap mt-2">
            <div className="inline-flex items-center gap-2.5 self-start px-4 py-2.5 rounded-2xl bg-white text-[#444748] shadow-xs border border-[#ded8cb]">
              <span className="text-base text-[#2563eb]">📷</span>
              <span className="font-mono text-xs sm:text-sm italic font-medium text-[#222222]">
                “Di balik setiap jepretan, ada cerita yang pantas diabadikan.”
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Rangefinder Camera Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full sm:w-88 lg:w-80 shrink-0 self-center lg:self-end mt-4 lg:mt-0 flex flex-col items-center"
        >
          <div className="relative w-full">
            {/* Card Frame */}
            <div className="bg-white p-4 rounded-3xl shadow-md border border-[#ded8cb] relative group">
              {/* White flash overlay when shutter triggered */}
              <div
                className={`absolute inset-0 bg-white rounded-3xl z-30 pointer-events-none transition-opacity duration-200 ${
                  isFlashing ? "opacity-95" : "opacity-0"
                }`}
              />

              {/* Inner photo container */}
              <div className="relative w-full aspect-square bg-[#18181b] rounded-2xl overflow-hidden flex items-center justify-center border border-[#ded8cb]/80 shadow-inner group/photo">
                <div className="absolute inset-0">
                  <Image
                    src="/images/vintage_camera_hero.jpg"
                    alt="Classic vintage rangefinder camera on wooden desk"
                    fill
                    priority
                    style={{ filter: getFilterStyle() }}
                    className="object-cover group-hover/photo:scale-105 transition-all duration-700"
                  />
                </div>

                {/* Ambient lighting gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Shutter trigger button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={triggerShutter}
                  className="absolute bottom-3 right-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/30 backdrop-blur-md group/btn z-20"
                  title="Tekan untuk bunyi shutter & flash!"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover/btn:rotate-12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                    SNAP ⚡
                  </span>
                </motion.button>

                {/* Interactive roll counter badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/20 z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">EXP #{shotsCount}/36</span>
                </div>
              </div>

              {/* Card Footer Labels */}
              <div className="mt-3 flex items-center justify-between px-1">
                <p className="font-mono text-[11px] font-bold text-[#222222] uppercase tracking-wider">
                  LEICA M3 // KODAK 400
                </p>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-mono text-[10px] font-bold border border-[#fde68a]">
                  {filmFilter.toUpperCase()} • f/2.0
                </span>
              </div>

              <p className="font-sans text-xs text-[#686660] text-center mt-2 italic font-medium">
                “Klik SNAP untuk bunyi shutter mekanik &amp; efek flash kamera!”
              </p>

              {/* Toast message after taking snap */}
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0b0c0c] text-white text-[11px] font-mono px-3.5 py-1.5 rounded-full shadow-xl z-40 border border-[#bfdbfe]/40 flex items-center gap-1.5"
                  >
                    <span>✨</span>
                    <span>Jepretan ke-{shotsCount - 1} tersimpan di roll film!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

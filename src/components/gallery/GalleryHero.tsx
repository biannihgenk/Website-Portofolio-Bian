"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SubpageBreadcrumb } from "@/components/layout/SubpageBreadcrumb";

type FilmFilter = "warm" | "teal" | "bw";

export function GalleryHero() {
  const [shotsCount, setShotsCount] = useState(1);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [filmFilter, setFilmFilter] = useState<FilmFilter>("warm");

  const triggerShutter = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 220);

    setShotsCount((prev) => (prev >= 36 ? 1 : prev + 1));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2600);
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
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 pb-6">
      <SubpageBreadcrumb
        sectionIndex="05 / GALERI"
        sectionLabel="Galeri & Dokumentasi"
        sectionLabelEn="Visual Archive"
        rightMeta="2024–2026"
      />

      <div className="bg-white/95 rounded-3xl border border-[#ded8cb] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12 relative">
          {/* Left Column: Title, Narrative, and Film Tone Controls */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl relative z-10 flex flex-col gap-5"
          >
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f3ee] text-[#111827] font-mono text-[11px] font-bold uppercase tracking-wider border border-[#ded8cb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                MOMENTS &amp; VISUAL ARCHIVE
              </span>
              <span className="font-mono text-xs text-[#686660] bg-[#fbf9f3] border border-[#ded8cb] px-2.5 py-1 rounded-full font-semibold">
                2024–2026 • SMK Telkom Malang
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-[#0b0c0c] tracking-tight font-bold leading-[1.12]">
              Dokumentasi Lapangan &amp;{" "}
              <span className="italic font-normal text-[#2563eb] block sm:inline">
                Arsip Visual Harian.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="font-sans text-base sm:text-lg text-[#4b5563] leading-relaxed max-w-xl">
              Kumpulan potret momen di sela keseharian—dari sesi praktikum MikroTik, lingkungan belajar SMK Telkom Malang, pengembangan perangkat lunak, hingga dokumentasi aktivitas tim.
            </p>

            {/* Film Tone Switcher */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="font-mono text-[11px] text-[#686660] uppercase font-bold mr-1">
                Color Profile:
              </span>
              <button
                type="button"
                onClick={() => setFilmFilter("warm")}
                className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                  filmFilter === "warm"
                    ? "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]"
                    : "bg-[#fbf9f3] text-[#686660] border border-[#ded8cb] hover:text-[#111827]"
                }`}
              >
                Kodak Warm
              </button>
              <button
                type="button"
                onClick={() => setFilmFilter("teal")}
                className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                  filmFilter === "teal"
                    ? "bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]"
                    : "bg-[#fbf9f3] text-[#686660] border border-[#ded8cb] hover:text-[#111827]"
                }`}
              >
                Cinematic Cool
              </button>
              <button
                type="button"
                onClick={() => setFilmFilter("bw")}
                className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                  filmFilter === "bw"
                    ? "bg-[#111827] text-white border border-[#111827]"
                    : "bg-[#fbf9f3] text-[#686660] border border-[#ded8cb] hover:text-[#111827]"
                }`}
              >
                Monochrome B&amp;W
              </button>
            </div>

            {/* Clean Quote Note */}
            <div className="inline-flex items-center gap-2.5 self-start px-4 py-2.5 rounded-2xl bg-[#fbf9f3] text-[#444748] border border-[#ded8cb]">
              <svg className="w-4 h-4 text-[#2563eb] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className="font-serif text-xs sm:text-sm italic font-medium text-[#111827]">
                &ldquo;Di balik setiap dokumentasi, terdapat proses belajar dan kolaborasi yang bermakna.&rdquo;
              </span>
            </div>
          </motion.div>

          {/* Right Column: Camera Preview Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative w-full sm:w-88 lg:w-84 shrink-0 self-center"
          >
            <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb] relative group">
              {/* Flash overlay */}
              <div
                className={`absolute inset-0 bg-white rounded-2xl z-30 pointer-events-none transition-opacity duration-200 ${
                  isFlashing ? "opacity-90" : "opacity-0"
                }`}
              />

              {/* Inner photo container */}
              <div className="relative w-full aspect-square bg-[#18181b] rounded-xl overflow-hidden border border-[#ded8cb]/80 group/photo">
                <Image
                  src="/images/vintage_camera_hero.jpg"
                  alt="Rangefinder camera on wooden desk"
                  fill
                  priority
                  style={{ filter: getFilterStyle() }}
                  className="object-cover group-hover/photo:scale-103 transition-all duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={triggerShutter}
                  className="absolute bottom-3 right-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-white/25 z-20"
                  title="Ambil frame simulasi"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                    CAPTURE
                  </span>
                </motion.button>

                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/15 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-bold">FRAME #{shotsCount}/36</span>
                </div>
              </div>

              {/* Card Footer Labels */}
              <div className="mt-3 flex items-center justify-between px-1">
                <p className="font-mono text-[11px] font-bold text-[#111827] uppercase tracking-wider">
                  LEICA M3 // ARCHIVE
                </p>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#686660] font-mono text-[10px] font-bold border border-[#ded8cb]">
                  {filmFilter.toUpperCase()} • f/2.0
                </span>
              </div>

              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0b0c0c] text-white text-[11px] font-mono px-3.5 py-1.5 rounded-full shadow-lg z-40 border border-white/15"
                  >
                    Frame ke-{shotsCount === 1 ? 36 : shotsCount - 1} terekam di pratinjau
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

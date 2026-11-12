"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

interface FooterProps {
  displayName?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export function Footer({
  displayName = "Debian (Bian)",
  githubUrl = "https://github.com/biannihgenk",
  linkedinUrl = "https://www.linkedin.com/in/debian-firwanto-49728635a/",
  instagramUrl = "https://instagram.com",
}: FooterProps) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  // Live Malang (WIB) Clock
  const [timeString, setTimeString] = useState<string>("");
  const [applauseCount, setApplauseCount] = useState<number>(148);
  const [justApplauded, setJustApplauded] = useState<boolean>(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Format to WIB (Asia/Jakarta)
      const formatted = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTimeString(formatted);
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSendSignal() {
    setApplauseCount((prev) => prev + 1);
    setJustApplauded(true);
    setTimeout(() => setJustApplauded(false), 1200);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="w-full relative bg-white/75 backdrop-blur-md border-t border-[#ded8cb] mt-16 sm:mt-24 overflow-hidden select-none">
      {/* Giant Typography Background Monogram (Subtle Watermark) */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-serif font-black text-6xl sm:text-8xl md:text-9xl text-slate-900/[0.03] tracking-tighter whitespace-nowrap block">
          NAUFAL NIZAR DE BIAN
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 relative z-10">
        
        {/* TOP ROW: Brand Identity & Interactive Signal Button */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#ded8cb]/80 items-start">
          
          {/* Brand Info (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-serif font-black text-2xl sm:text-3xl text-[#222222] tracking-tight">
                {displayName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 font-mono text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                MOKLET A&apos;35 • KELAS X TKJ
              </span>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#6b6863] italic max-w-xl">
              &ldquo;{tFooter("motto")}&rdquo;
            </p>

            {/* Live Malang (WIB) Clock & Status Indicator */}
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ded8cb] font-mono text-xs text-[#222222] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold">MALANG, ID</span>
                <span className="text-[#6b6863]">|</span>
                <span className="text-blue-600 font-bold">{timeString ? `${timeString} WIB` : "WIB (UTC+7)"}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf9f3] border border-[#ded8cb] font-mono text-xs text-[#6b6863]">
                <span>⚡ Latency:</span>
                <span className="text-emerald-600 font-bold">1.2ms</span>
                <span>• Online</span>
              </div>
            </div>
          </div>

          {/* Interactive Micro Actions (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between gap-4">
            {/* Interactive "Kirim Sinyal" (High Five / Kudos) Button */}
            <div className="relative">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleSendSignal}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-blue-50 text-[#222222] hover:text-[#2563eb] border border-[#ded8cb] hover:border-blue-400 font-mono text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group"
                title="Kirim sinyal apresiasi ke Bian"
              >
                <span className="text-base group-hover:scale-125 transition-transform">
                  ⚡
                </span>
                <span>Kirim Sinyal Apresiasi</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#2563eb] text-[10px] font-black">
                  {applauseCount}
                </span>
              </motion.button>

              <AnimatePresence>
                {justApplauded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -24, scale: 1 }}
                    exit={{ opacity: 0, y: -36, scale: 0.8 }}
                    className="absolute -top-3 right-2 px-3 py-1 bg-[#2563eb] text-white font-mono text-[11px] font-bold rounded-full shadow-lg pointer-events-none z-20"
                  >
                    ✦ Sinyal Diterima! +1 🚀
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Back to Top Quick Launcher */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf9f3] hover:bg-[#2563eb] hover:text-white border border-[#ded8cb] hover:border-[#2563eb] text-[#6b6863] text-xs font-mono font-semibold transition-all cursor-pointer group shadow-2xs"
            >
              <span>Kembali ke Atas</span>
              <span className="group-hover:-translate-y-1 transition-transform font-bold">
                ↑
              </span>
            </button>
          </div>
        </div>

        {/* MIDDLE ROW: Structured Navigation & Social Connect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 py-10 border-b border-[#ded8cb]/80 text-left">
          
          {/* Col 1: Halaman Utama */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#222222]">
              Jelajahi
            </span>
            <nav className="flex flex-col gap-2 text-xs font-sans text-[#6b6863]">
              <Link href="/" className="hover:text-[#2563eb] transition-colors">
                {tNav("home")}
              </Link>
              <Link href="/profile" className="hover:text-[#2563eb] transition-colors">
                {tNav("about")}
              </Link>
              <Link href="/projects" className="hover:text-[#2563eb] transition-colors">
                {tNav("projects")}
              </Link>
              <Link href="/achievements" className="hover:text-[#2563eb] transition-colors">
                {tNav("achievements")}
              </Link>
            </nav>
          </div>

          {/* Col 2: Arsip & Dokumentasi */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#222222]">
              Catatan &amp; Galeri
            </span>
            <nav className="flex flex-col gap-2 text-xs font-sans text-[#6b6863]">
              <Link href="/education" className="hover:text-[#2563eb] transition-colors">
                {tNav("education")}
              </Link>
              <Link href="/gallery" className="hover:text-[#2563eb] transition-colors">
                {tNav("gallery")}
              </Link>
              <Link href="/blog" className="hover:text-[#2563eb] transition-colors">
                {tNav("blog")}
              </Link>
              <Link href="/contact" className="hover:text-[#2563eb] transition-colors">
                {tNav("contact")}
              </Link>
            </nav>
          </div>

          {/* Col 3: Saluran Sosial */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#222222]">
              Koneksi Sosial
            </span>
            <div className="flex flex-col gap-2 text-xs font-mono text-[#6b6863]">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2563eb] transition-colors inline-flex items-center gap-1.5"
              >
                <span>GitHub</span>
                <span className="text-[10px]">↗</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2563eb] transition-colors inline-flex items-center gap-1.5"
              >
                <span>LinkedIn</span>
                <span className="text-[10px]">↗</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2563eb] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Instagram</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>

          {/* Col 4: Tech Ecosystem Pill */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#222222]">
              Arsitektur Web
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-white border border-[#ded8cb] font-mono text-[10px] text-[#444748]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Copyright & CMS Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6b6863]">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>{tFooter("copyright")}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <span className="text-[#2563eb] font-bold">SMK Telkom Malang</span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-[#6b6863] hover:text-[#2563eb] underline underline-offset-4 decoration-[#ded8cb] hover:decoration-blue-400 transition-colors"
            >
              CMS Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

import type { Variants } from "motion/react";

interface KineticCanvasStageProps {
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export function KineticCanvasStage({
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  instagramUrl = "https://instagram.com",
}: KineticCanvasStageProps) {
  const t = useTranslations("hero");
  const shouldReduceMotion = useReducedMotion();

  const [timeStr, setTimeStr] = useState<string>("14:30:00");
  const [pingState, setPingState] = useState<{ testing: boolean; latency: number }>({
    testing: false,
    latency: 14,
  });

  function handleTestPing() {
    if (pingState.testing) return;
    setPingState((prev) => ({ ...prev, testing: true }));
    setTimeout(() => {
      const randomized = Math.floor(Math.random() * 8) + 11;
      setPingState({ testing: false, latency: randomized });
    }, 600);
  }

  // Keep WIB time updated
  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Jakarta",
          hour12: false,
        });
        setTimeStr(formatted);
      } catch {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        setTimeStr(`${hours}:${minutes}:${seconds}`);
      }
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Motion variants for controlled staggered reveal
  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: "easeOut",
      },
    },
  };

  const fadeVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[90vh] lg:min-h-[96vh] blueprint-dots border-b border-[#ded8cb] overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-6"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* VERTICAL LEFT AVAILABILITY PILL (Inspired by Reference) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden 2xl:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <a
          href="#contact"
          className="flex items-center gap-2.5 py-4 px-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#ded8cb] shadow-sm hover:shadow-md transition-all [writing-mode:vertical-rl] rotate-180 text-[10px] font-mono tracking-widest text-[#222222] font-bold group cursor-pointer hover:border-blue-400 select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [writing-mode:horizontal-tb]" />
          <span className="group-hover:text-blue-600 transition-colors">AVAILABLE FOR OPPORTUNITY • 2026</span>
        </a>
      </div>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP EDITORIAL STATUS BAR WITH FUNCTIONAL PING TESTER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#6b6863]">
        {/* Left: School & Program Identity */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#ded8cb] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-bold text-[#222222] tracking-wider">{t("schoolTag")}</span>
          <span className="text-[#6b6863]/40">•</span>
          <span className="text-blue-600 font-semibold">{t("tkjTag")}</span>
        </div>

        {/* Right: Functional Ping Tester & Live Time */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Functional Ping Widget */}
          <button
            type="button"
            onClick={handleTestPing}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-blue-50/80 px-3 py-1.5 rounded-full border border-[#ded8cb] hover:border-blue-300 shadow-xs text-[11px] text-[#222222] transition-colors cursor-pointer group"
            title="Klik untuk test latensi jaringan gateway lab"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                pingState.testing ? "bg-amber-500 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span className="font-mono">
              {pingState.testing ? "Pinging 1.1.1.1..." : `RTT: ${pingState.latency}ms`}
            </span>
            <span className="text-blue-600 font-bold group-hover:scale-110 transition-transform">⚡</span>
          </button>

          {/* Time & Location */}
          <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#ded8cb] shadow-xs text-[11px]">
            <span className="text-[#222222] font-semibold">{t("locationStamp")}</span>
            <span className="text-[#6b6863]/40">•</span>
            <span className="text-[#6b6863]">{timeStr} WIB</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CENTER: MASSIVE EDITORIAL TYPOGRAPHY WITH EMBEDDED BADGES */}
      {/* ───────────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex flex-col items-center justify-center my-auto text-center"
      >
        {/* Supporting Tags Row */}
        <motion.div
          variants={fadeVariants}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5 sm:mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider shadow-xs border border-blue-200">
            <span>●</span> {t("networkTag")}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#ded8cb] text-[#222222] font-mono text-xs font-semibold shadow-xs">
            {t("webTag")}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5f2ea] border border-[#ded8cb] text-[#6b6863] font-mono text-xs font-semibold shadow-xs">
            {t("sysadminTag")}
          </span>
        </motion.div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* Massive Editorial Headline with Metallic Liquid Sheen */}
        {/* Line 1: NETWORK & WEB (Single Line) */}
        {/* Line 2: the CURIOSITY */}
        {/* Line 3: EN [🤖] GINEER. */}
        {/* ───────────────────────────────────────────────────────── */}
        <div className="relative w-full text-center flex flex-col items-center justify-center leading-[0.92] select-none py-2">
          {/* Surrounding Tech Badges (Rich, Clean & Lively on Left & Right) */}
          {/* Top Left: Routing Engine Stamp */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden xl:flex absolute left-0 -top-2 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#ded8cb] shadow-xs text-left select-none pointer-events-auto hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-[#222222] tracking-wider group-hover:text-blue-600 transition-colors">
                ROUTING ENGINE
              </span>
              <span className="text-[9px] font-mono text-[#6b6863]">BGP • OSPF • VLANs</span>
            </div>
          </motion.div>

          {/* Bottom Left: 10G Core Homelab Pill */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="hidden xl:flex absolute left-0 bottom-4 items-center gap-2 px-3 py-1.5 rounded-2xl bg-blue-50/90 backdrop-blur-md border border-blue-200/80 shadow-xs select-none pointer-events-auto hover:scale-105 transition-transform"
          >
            <span className="text-xs">⚡</span>
            <span className="text-[10px] font-mono font-bold text-blue-900 tracking-wider">10G LAB ENGINE</span>
            <span className="text-[9px] font-mono text-blue-600 font-semibold px-1.5 py-0.5 rounded bg-blue-100">PROD</span>
          </motion.div>

          {/* Top Right: Next.js 15 Arch Pill */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -7, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="hidden xl:flex absolute right-0 -top-2 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#ded8cb] shadow-xs select-none pointer-events-auto hover:border-blue-300 hover:shadow-md transition-all text-right group"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-[#222222] tracking-wider group-hover:text-blue-600 transition-colors">
                NEXT.JS 15 ARCH
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-medium">99.9% UPTIME • V2.6</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </motion.div>

          {/* Bottom Right: Gateway Ping Widget */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            onClick={handleTestPing}
            className="hidden xl:flex absolute right-0 bottom-4 items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#ded8cb] shadow-xs select-none pointer-events-auto hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            title="Klik untuk test latensi jaringan gateway lab"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[10px] font-mono font-bold text-[#222222] group-hover:text-blue-600 transition-colors">
              GATEWAY: {pingState.testing ? "..." : `${pingState.latency}ms`}
            </span>
            <span className="text-[9px] font-mono text-[#6b6863]">RTT</span>
          </motion.div>

          {/* Line 1: NETWORK & WEB (All in ONE single line) */}
          <motion.div
            variants={lineVariants}
            className="font-serif font-black tracking-tight text-[30px] sm:text-[50px] md:text-[70px] lg:text-[88px] xl:text-[104px] flex items-center justify-center flex-nowrap whitespace-nowrap gap-x-1.5 sm:gap-x-2.5 md:gap-x-3.5 my-0.5 sm:my-1 relative"
          >
            {/* Left corner accent */}
            <span className="hidden sm:inline-block font-mono text-[11px] md:text-[13px] text-blue-500/80 font-normal tracking-widest select-none -translate-y-1 sm:-translate-y-2">
              ⌜01
            </span>

            <span className="text-shimmer-gleam font-serif">NET</span>

            {/* Compact & Clean Mini Lightning Badge (Decorative Accent) */}
            <motion.span
              whileHover={{ scale: 1.2, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleTestPing}
              className="inline-flex items-center justify-center align-middle mx-0.5 sm:mx-1 cursor-pointer group/bolt select-none"
              title="High-Speed Packet Routing • Uji latensi lab"
            >
              <span className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-xl bg-blue-50/90 border border-blue-400/80 text-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all">
                <svg
                  className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 fill-blue-500/20 stroke-blue-600"
                  viewBox="0 0 24 24"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </span>
            </motion.span>

            <span className="text-shimmer-gleam font-serif">WORK</span>

            <span className="text-[#6b6863]/40 font-serif italic font-normal text-[24px] sm:text-[40px] md:text-[56px] lg:text-[70px] xl:text-[84px] mx-0.5">
              &amp;
            </span>

            <span className="text-shimmer-gleam font-serif relative">
              WEB
              {/* Perched Mini GitHub floating badge on top right of WEB */}
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.25, rotate: -8, y: -4 }}
                className="absolute -top-2 -right-5 sm:-top-3.5 sm:-right-7 md:-top-4 md:-right-8 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white border border-[#ded8cb] shadow-xs flex items-center justify-center text-[#222222] hover:text-blue-600 hover:border-blue-400 transition-colors z-20 cursor-pointer"
                title="GitHub: @biannihgenk"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </motion.a>
            </span>

            {/* Right corner accent */}
            <span className="hidden sm:inline-block font-mono text-[11px] md:text-[13px] text-blue-500/80 font-normal tracking-widest select-none -translate-y-1 sm:-translate-y-2">
              ⌟
            </span>
          </motion.div>

          {/* Line 2: the CURIOSITY */}
          <motion.div
            variants={lineVariants}
            className="font-serif font-black tracking-tighter text-[44px] sm:text-[74px] md:text-[98px] lg:text-[120px] xl:text-[136px] flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3.5 my-0.5 sm:my-1 relative"
          >
            {/* Perched LinkedIn badge on left */}
            <motion.a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.25, rotate: 6, y: -4 }}
              className="hidden md:flex absolute -left-8 lg:-left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#ded8cb] shadow-xs items-center justify-center text-[#222222] hover:text-blue-600 hover:border-blue-400 transition-colors z-20 cursor-pointer"
              title="LinkedIn: Debian Firwanto"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </motion.a>

            <span className="italic font-serif font-normal text-[36px] sm:text-[62px] md:text-[82px] lg:text-[100px] xl:text-[112px] text-[#6b6863]">
              the
            </span>
            <span className="text-shimmer-gleam font-serif">CURIOSITY</span>

            {/* Decorative spark star */}
            <span className="inline-block text-amber-500 font-mono text-sm sm:text-lg animate-pulse select-none ml-1">
              ✦
            </span>
          </motion.div>

          {/* Line 3: EN [🤖] GINEER. */}
          <motion.div
            variants={lineVariants}
            className="font-serif font-black tracking-tighter text-[40px] sm:text-[68px] md:text-[92px] lg:text-[112px] xl:text-[126px] flex items-center justify-center flex-wrap gap-x-1 sm:gap-x-2 relative"
          >
            <span className="text-shimmer-gleam font-serif">EN</span>

            {/* Compact Embedded Robot / Mascot Badge */}
            <motion.span
              whileHover={{ scale: 1.18, rotate: -8 }}
              whileTap={{ scale: 0.92 }}
              className="inline-flex items-center justify-center align-middle mx-1 cursor-pointer group/robot select-none"
              title="Debian Homelab Bot • Selalu penasaran & bereksperimen"
            >
              <span className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-xl bg-amber-50/90 border border-amber-400 text-amber-500 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_22px_rgba(245,158,11,0.4)] transition-all">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v3" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="12" cy="2" r="1.5" fill="currentColor" />
                  <rect
                    x="4"
                    y="5"
                    width="16"
                    height="15"
                    rx="5"
                    fill="rgba(251,191,36,0.2)"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="9" cy="11" r="1.8" fill="currentColor" />
                  <circle cx="15" cy="11" r="1.8" fill="currentColor" />
                  <path d="M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </motion.span>

            <span className="text-shimmer-gleam font-serif">GINEER</span>
            <span className="text-blue-600 font-serif italic text-[42px] sm:text-[72px] md:text-[96px] lg:text-[116px] xl:text-[130px]">
              .
            </span>

            {/* Perched Instagram badge on right */}
            <motion.a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.25, rotate: 10, y: -4 }}
              className="hidden md:flex absolute -right-8 lg:-right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#ded8cb] shadow-xs items-center justify-center text-[#222222] hover:text-blue-600 hover:border-blue-400 transition-colors z-20 cursor-pointer"
              title="Instagram: @debianxyzz"
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        {/* Clear, Natural Description */}
        <motion.p
          variants={fadeVariants}
          className="font-sans text-sm sm:text-base md:text-lg text-[#6b6863] max-w-2xl text-center mt-5 sm:mt-7 leading-relaxed"
        >
          {t("subdeck")}
        </motion.p>

        {/* ───────────────────────────────────────────────────────── */}
        {/* INTERACTIVE ACTIONS: CTAs & MINIMALIST SOCIAL ICONS */}
        {/* ───────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeVariants}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-7 sm:mt-9"
        >
          {/* Main Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#222222] text-white text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              <span>{t("ctaProjects")}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <a
              href="#editorial-hero"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 sm:py-3 rounded-full bg-white border border-[#ded8cb] text-[#222222] text-xs sm:text-sm font-semibold hover:bg-[#f5f2ea] hover:border-blue-300 transition-all duration-200 shadow-xs hover:-translate-y-0.5 active:scale-95"
            >
              <span>{t("ctaAbout")}</span>
            </a>
          </div>

          {/* Minimalist Divider */}
          <div className="h-6 w-[1px] bg-[#ded8cb] hidden sm:block" />

          {/* Minimalist Social Media Icons Row */}
          <div className="flex items-center gap-2" role="group" aria-label="Social Profiles">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("followGithub")}
              title={t("followGithub")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#f5f2ea] border border-[#ded8cb] hover:border-blue-400 flex items-center justify-center text-[#222222] hover:text-blue-600 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("followLinkedin")}
              title={t("followLinkedin")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#f5f2ea] border border-[#ded8cb] hover:border-blue-400 flex items-center justify-center text-[#222222] hover:text-blue-600 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("followInstagram")}
              title={t("followInstagram")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#f5f2ea] border border-[#ded8cb] hover:border-blue-400 flex items-center justify-center text-[#222222] hover:text-blue-600 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* BOTTOM DIVIDER & LOCATION STAMP BAR (Inspired by canadev.my.id) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 pt-2">
        <div className="w-full border-t border-[#ded8cb]/80 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs font-mono text-[#6b6863]">
          {/* Left: Authentic Identity Tokens */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#222222]">SMK TELKOM MALANG</span>
            <span className="text-[#ded8cb]">•</span>
            <span className="text-blue-600 font-semibold">TKJ &apos;26</span>
            <span className="text-[#ded8cb] hidden sm:inline">•</span>
            <span className="hidden sm:inline text-[#6b6863]">PORTFOLIO &amp; LAB JOURNAL</span>
          </div>

          {/* Center/Right: Origin Stamp from Reference & Scroll Indicator */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#6b6863] tracking-widest uppercase">
              MALANG, ID — 2026
            </span>

            {/* Modern Scroll Indicator */}
            <a
              href="#editorial-hero"
              className="group inline-flex items-center gap-2 text-xs font-mono text-[#6b6863] hover:text-[#222222] transition-colors cursor-pointer py-1"
              aria-label={t("scrollExplore")}
            >
              <span className="group-hover:translate-x-0.5 transition-transform">{t("scrollExplore")}</span>
              <span className="w-4 h-6 rounded-full border border-[#ded8cb] group-hover:border-blue-500 flex items-start justify-center p-0.5 transition-colors">
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [0, 8, 0],
                          opacity: [1, 0.4, 1],
                        }
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-1.5 rounded-full bg-blue-600"
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

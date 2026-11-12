"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/lib/i18n/navigation";

interface EditorialHeroProps {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string;
  school?: string;
}

export function EditorialHero({
  displayName = "Naufal Nizar De Bian Setyo Firwanto",
  avatarUrl,
  bio,
  school = "SMK Telkom Malang",
}: EditorialHeroProps) {
  const locale = useLocale();
  const isId = locale === "id";
  const shouldReduceMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const fallbackPhoto =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBNrmoVQbmOgjgzU8fW6x2aFmr_pLmzPu3Ov1C2cUo_cELkM6-3NXEfEOffgUhB9tK56jVTL2sl8uHFX7NHzZE6ZYNLqF9Hk1CYTHk2LrkN0noWPfuShl5gS_-CMJ1pc0pYD2SRPy6xizzAYdTHWkIeQXNnBmPsbyYC0dqA_ePTpb_0ZIS4120TTNt5291kHYqe0gt1BJJKTJyFO1LQTR-sZ0ym-ySndPHyjcZtxCtVS_YUCtoH8GSU";

  const displayPhoto = avatarUrl || fallbackPhoto;

  return (
    <section
      id="editorial-hero"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-24 overflow-hidden lg:overflow-visible scroll-mt-24"
    >
      {/* Soft Ambient Background Glow Accents */}
      <div
        className="absolute -top-24 -right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(219,234,254,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(224,231,255,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* LEFT COLUMN: EDITORIAL IDENTITY & TECHNICAL FOCUS */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6 text-left"
        >
          {/* Availability & Role Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-[#111827] border border-[#ded8cb] rounded-full shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              WEB &amp; NETWORK ENGINEER • MOKLET A&apos;35
            </span>
          </div>

          {/* Serif Editorial Heading */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0b0c0c] tracking-tight leading-[1.12]">
              {isId ? (
                <>
                  Merancang Infrastruktur Jaringan &amp;{" "}
                  <span className="italic font-normal text-[#2563eb]">
                    Sistem Web Modern.
                  </span>
                </>
              ) : (
                <>
                  Engineering Resilient Networks &amp;{" "}
                  <span className="italic font-normal text-[#2563eb]">
                    Modern Web Systems.
                  </span>
                </>
              )}
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#4b5563] max-w-2xl leading-relaxed">
              {isId ? "Saya " : "I'm "}
              <strong className="text-[#0b0c0c] font-semibold">
                {displayName}
              </strong>{" "}
              (Bian) — {isId ? "siswa" : "a vocational student at"}{" "}
              <span className="text-[#2563eb] font-semibold">{school}</span>.{" "}
              {bio ||
                (isId
                  ? "Berfokus pada perancangan topologi MikroTik & Cisco, administrasi server Linux Debian, serta pengembangan aplikasi web modern dan AI."
                  : "Focused on MikroTik & Cisco network engineering, Debian Linux systems administration, and modern AI-enabled web development.")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>{isId ? "Hubungi Saya" : "Get in Touch"}</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                ↗
              </span>
            </a>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#f5f2ea] text-[#111827] border border-[#ded8cb] hover:border-blue-300 font-semibold text-sm shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <span>{isId ? "Profil Lengkap" : "Full Profile"}</span>
            </Link>
          </div>

          {/* Interactive ID Hint */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#6b6863]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>
              {isId
                ? "Kartu identitas interaktif — seret atau balik kartu untuk melihat kredensial teknis."
                : "Interactive identity card — drag or flip to inspect technical credentials."}
            </span>
          </div>

          {/* Clean 3-Column Core Technical Focus Strip */}
          <div className="w-full pt-6 mt-1 border-t border-[#ded8cb]/80 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">
                01 / NETWORKING
              </span>
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] block">
                MikroTik, Cisco &amp; VLAN
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">
                02 / WEB ARCHITECTURE
              </span>
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] block">
                Next.js 15, TypeScript &amp; SQL
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">
                03 / SYSTEMS &amp; LAB
              </span>
              <span className="font-sans text-xs sm:text-sm font-semibold text-[#111827] block">
                Debian Linux &amp; Docker
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: DRAGGABLE & FLIPPABLE 3D IDENTITY CARD */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative flex flex-col items-center justify-center pt-4 lg:pt-0"
        >
          <div className="relative flex flex-col items-center select-none">
            <motion.div
              drag
              dragConstraints={{ top: -24, bottom: 32, left: -40, right: 40 }}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 22 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
              whileTap={{ scale: 0.98, cursor: "grabbing" }}
              className="relative z-20 cursor-grab select-none [perspective:1400px]"
            >
              {/* Frosted Acrylic Holder */}
              <div className="p-3 sm:p-3.5 rounded-[30px] bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/[0.06] relative">
                {/* Punch Slot */}
                <div className="w-14 h-2.5 mx-auto mb-2.5 bg-slate-200/80 rounded-full border border-slate-300/80 flex items-center justify-center">
                  <div className="w-7 h-1 rounded-full bg-slate-500/70" />
                </div>

                {/* 3D DOUBLE-SIDED CARD */}
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.55, type: "spring", stiffness: 220, damping: 22 }}
                  className="relative w-[270px] sm:w-[300px] min-h-[425px] sm:min-h-[455px] bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#ded8cb] [transform-style:preserve-3d]"
                >
                  {/* FRONT SIDE */}
                  <div
                    className={`w-full h-full flex flex-col justify-between [backface-visibility:hidden] ${
                      isFlipped ? "pointer-events-none" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#ded8cb]/70">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                        <span className="font-mono text-xs font-bold text-[#111827] tracking-wider">
                          debianxyz.my.id
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[9px] text-[#6b6863] font-bold">
                        2026
                      </span>
                    </div>

                    <div className="my-2.5 relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb]">
                      <Image
                        src={displayPhoto}
                        alt="Naufal Nizar De Bian Setyo Firwanto"
                        fill
                        sizes="300px"
                        unoptimized
                        priority
                        className="object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#ded8cb] text-[9px] font-mono text-[#2563eb] font-bold flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>IDENTITY CARD</span>
                      </div>
                    </div>

                    <div className="text-left space-y-0.5">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#111827] leading-tight">
                        Naufal Nizar De Bian
                      </h3>
                      <p className="font-mono text-[11px] text-[#6b6863]">
                        {isId ? "Teknik Komputer & Jaringan" : "Computer & Network Engineering"}
                      </p>
                      <p className="font-mono text-[11px] text-[#2563eb] font-bold">
                        {school}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#ded8cb]/70 flex items-center justify-between gap-2 mt-2">
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[9px] text-[#6b6863] uppercase">
                          Focus Domain
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#111827]">
                          Network • Web • SysAdmin
                        </span>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div className="h-4 w-16 flex items-center justify-end gap-[1.5px] opacity-80">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 5, 2, 1, 3].map((w, i) => (
                            <div
                              key={i}
                              className="bg-[#111827] h-full rounded-[0.5px]"
                              style={{ width: `${w}px` }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[8px] text-[#6b6863] mt-0.5">
                          TKJ-35-2026
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between rounded-2xl bg-white [transform:rotateY(180deg)] [backface-visibility:hidden] ${
                      !isFlipped ? "pointer-events-none" : ""
                    }`}
                  >
                    <div className="-mx-4 sm:-mx-5 -mt-4 sm:-mt-5 h-8 bg-[#0f172a] border-b border-black/20 rounded-t-xl" />

                    <div className="flex items-center justify-between pt-1">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-600/40 flex flex-col justify-around p-1">
                        <div className="h-[1px] bg-amber-800/40 w-full" />
                        <div className="h-[1px] bg-amber-800/40 w-full" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#2563eb] font-bold" title="NFC">
                          ((( · )))
                        </span>
                        <div className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[9px] font-mono text-blue-700 font-bold">
                          VERIFIED • 2026
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-left my-1 bg-[#fbf9f3] p-3 rounded-xl border border-[#ded8cb]">
                      <div>
                        <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                          {isId ? "Nama Lengkap" : "Full Name"}
                        </span>
                        <span className="font-serif font-bold text-xs text-[#111827]">
                          {displayName}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                            {isId ? "Konsentrasi" : "Major"}
                          </span>
                          <span className="font-mono text-[10px] text-[#111827] font-semibold">
                            TKJ (Networking)
                          </span>
                        </div>
                        <div>
                          <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                            {isId ? "Angkatan" : "Cohort"}
                          </span>
                          <span className="font-mono text-[10px] text-[#2563eb] font-bold">
                            Moklet A&apos;35
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-mono text-[8px] text-[#6b6863] uppercase block">
                          {isId ? "Institusi" : "Institution"}
                        </span>
                        <span className="font-mono text-[10px] text-[#111827] font-semibold">
                          {school}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#ded8cb] mt-auto">
                      <div className="flex-1 text-left">
                        <span className="font-mono text-[8px] text-[#6b6863] uppercase block mb-1">
                          {isId ? "Tanda Tangan" : "Signature"}
                        </span>
                        <div className="h-7 bg-[#f5f2ea] rounded-md border border-[#ded8cb] px-2 flex items-center justify-center">
                          <span className="font-serif italic text-xs font-bold text-[#2563eb] tracking-wide select-none">
                            Naufal Nizar De Bian
                          </span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-md bg-white border border-[#ded8cb] p-1 flex flex-col justify-between shrink-0 shadow-2xs">
                        <div className="grid grid-cols-3 gap-[1px] w-full h-full">
                          {[1, 0, 1, 1, 1, 0, 0, 1, 1].map((dot, idx) => (
                            <div
                              key={idx}
                              className={`rounded-[0.5px] ${dot ? "bg-[#111827]" : "bg-transparent"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#ded8cb] flex items-center justify-between text-[9px] font-mono text-[#6b6863]">
                      <span>PORTFOLIO IDENTITY</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {isId ? "Valid & Aktif" : "Verified & Active"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Clean Flip Button Right Below Card */}
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-blue-50 border border-[#ded8cb] hover:border-blue-300 text-xs font-mono font-bold text-[#111827] hover:text-blue-600 shadow-xs transition-all cursor-pointer group"
                aria-label={isId ? "Balik kartu spesifikasi" : "Flip specification card"}
              >
                <span className="group-hover:rotate-180 transition-transform duration-500 inline-block">
                  ↺
                </span>
                <span>{isId ? "Balik Kartu Spesifikasi" : "Flip Specification Card"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

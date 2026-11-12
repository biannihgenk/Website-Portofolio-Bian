"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/lib/i18n/navigation";

interface IdentityHubShowcaseProps {
  locale: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  email?: string;
  school?: string;
}

interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  isInternal?: boolean;
  iconBg: string;
  offsetClass: string;
  icon: React.ReactNode;
}

function extractHandle(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  try {
    const parsed = new URL(url);
    const seg = parsed.pathname.split("/").filter(Boolean)[0];
    if (!seg || seg === "in") {
      const second = parsed.pathname.split("/").filter(Boolean)[1];
      return second ? `@${second.replace(/\/$/, "")}` : fallback;
    }
    return `@${seg.replace(/^@/, "")}`;
  } catch {
    return fallback;
  }
}

export function IdentityHubShowcase({
  locale,
  githubUrl = "https://github.com/biannihgenk",
  linkedinUrl = "https://www.linkedin.com/in/debian-firwanto-49728635a/",
  instagramUrl = "https://instagram.com",
  email = "firwanto.debian@gmail.com",
  school = "SMK Telkom Malang",
}: IdentityHubShowcaseProps) {
  const isId = locale === "id";
  const shouldReduceMotion = useReducedMotion();

  const resolvedGithubUrl =
    githubUrl && !/^https?:\/\/(www\.)?github\.com\/?$/i.test(githubUrl)
      ? githubUrl
      : "https://github.com/biannihgenk";
  const resolvedLinkedinUrl =
    linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/?$/i.test(linkedinUrl)
      ? linkedinUrl
      : "https://www.linkedin.com/in/debian-firwanto-49728635a/";
  const resolvedInstagramUrl =
    instagramUrl && !/^https?:\/\/(www\.)?instagram\.com\/?$/i.test(instagramUrl)
      ? instagramUrl
      : "https://instagram.com/debianxyzz";

  const githubHandle = extractHandle(resolvedGithubUrl, "@biannihgenk");
  const igHandle = extractHandle(resolvedInstagramUrl, "@debianxyzz");

  const leftItems: HubItem[] = [
    {
      id: "instagram",
      title: "Instagram",
      subtitle: igHandle,
      href: resolvedInstagramUrl,
      iconBg:
        "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]",
      offsetClass: "lg:translate-x-5",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      id: "github",
      title: "GitHub",
      subtitle: githubHandle,
      href: resolvedGithubUrl,
      iconBg: "bg-[#111827]",
      offsetClass: "lg:-translate-x-4",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      subtitle: "Debian Firwanto",
      href: resolvedLinkedinUrl,
      iconBg: "bg-[#0a66c2]",
      offsetClass: "lg:translate-x-5",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  const rightItems: HubItem[] = [
    {
      id: "projects",
      title: isId ? "Arsip Proyek" : "Project Archive",
      subtitle: "Web, AI & Networking",
      href: "/projects",
      isInternal: true,
      iconBg: "bg-[#2563eb]",
      offsetClass: "lg:-translate-x-5",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      id: "profile",
      title: isId ? "Profil & Biodata" : "Profile & Dossier",
      subtitle: school,
      href: "/profile",
      isInternal: true,
      iconBg: "bg-[#0f172a]",
      offsetClass: "lg:translate-x-4",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "email",
      title: isId ? "Email Langsung" : "Direct Email",
      subtitle: email,
      href: `mailto:${email}`,
      iconBg: "bg-emerald-500",
      offsetClass: "lg:-translate-x-5",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ];

  const renderPillCard = (item: HubItem, index: number) => {
    const pillClasses = `group flex items-center justify-between gap-3 bg-white/95 hover:bg-white rounded-full border border-[#ded8cb]/90 hover:border-[#2563eb]/50 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_10px_28px_-10px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_36px_-12px_rgba(37,99,235,0.18)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer w-full lg:w-[258px] ${item.offsetClass}`;

    const innerContent = (
      <>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full ${item.iconBg} text-white flex items-center justify-center shrink-0 shadow-2xs`}
          >
            {item.icon}
          </div>
          <div className="min-w-0 text-left">
            <div className="font-sans text-sm font-bold text-[#111827] leading-tight group-hover:text-[#2563eb] transition-colors truncate">
              {item.title}
            </div>
            <div className="font-sans text-[11px] sm:text-xs text-[#6b6863] truncate mt-0.5">
              {item.subtitle}
            </div>
          </div>
        </div>
        <svg
          className="w-3.5 h-3.5 text-[#9ca3af] group-hover:text-[#2563eb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </>
    );

    return (
      <motion.div
        key={item.id}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.36, delay: Math.min(index * 0.06, 0.25) }}
        className="w-full lg:w-auto flex justify-center"
      >
        {item.isInternal ? (
          <Link href={item.href} className={pillClasses}>
            {innerContent}
          </Link>
        ) : (
          <a
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className={pillClasses}
          >
            {innerContent}
          </a>
        )}
      </motion.div>
    );
  };

  return (
    <section
      aria-label={isId ? "Pusat Identitas & Kanal Terhubung" : "Connected Identity Hub"}
      className="relative w-full pt-14 pb-10 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-14 overflow-x-clip bg-transparent"
    >
      {/* Subtle Light Spotlight Wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 54%, rgba(255,255,255,0.88) 0%, rgba(251,249,243,0.45) 54%, rgba(251,249,243,0) 78%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Whisper-quiet Eyebrow Label */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6863]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            <span>
              {isId ? "TERHUBUNG BERSAMA BIAN" : "CONNECTED WITH BIAN"}
            </span>
          </span>
        </div>

        {/* Orbital Hub Stage */}
        <div className="relative min-h-[420px] sm:min-h-[470px] flex flex-col lg:grid lg:grid-cols-12 items-center justify-center gap-8 lg:gap-4 py-2">
          {/* Concentric Hairline Orbital Rings (Centered Behind Figure) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] lg:w-[500px] lg:h-[500px] rounded-full border border-[#ded8cb]/65" />
            <div className="hidden sm:block absolute w-[580px] h-[580px] lg:w-[700px] lg:h-[700px] rounded-full border border-[#ded8cb]/40" />
          </div>

          {/* Faint Watermark Typography Behind Portrait Cutout */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden"
          >
            <span className="font-sans font-black uppercase tracking-tight leading-[0.86] text-[3.3rem] sm:text-[6rem] lg:text-[7.2rem] text-[#111827]/[0.045]">
              DEBIAN
            </span>
            <span className="font-sans font-black uppercase tracking-tight leading-[0.86] text-[2.7rem] sm:text-[5rem] lg:text-[6.2rem] text-[#2563eb]/[0.05] mt-1">
              MOKLET A&apos;35
            </span>
          </div>

          {/* Subtle Corner Dot Matrix & Diamond Accents (Clean Reference Nod) */}
          <div
            aria-hidden="true"
            className="hidden md:flex flex-col items-start gap-2.5 absolute bottom-3 left-2 lg:left-6 pointer-events-none opacity-65"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-[#c5bfb0]" />
              ))}
            </div>
            <span className="w-2.5 h-2.5 rotate-45 bg-[#2563eb] rounded-[2px]" />
          </div>

          <div
            aria-hidden="true"
            className="hidden md:flex flex-col items-end gap-2.5 absolute bottom-3 right-2 lg:right-6 pointer-events-none opacity-65"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-[#c5bfb0]" />
              ))}
            </div>
            <span className="w-2.5 h-2.5 rotate-45 bg-[#2563eb] rounded-[2px]" />
          </div>

          {/* LEFT WING (Desktop lg+: 3 Pills flanking left side symmetrically) */}
          <div className="hidden lg:flex lg:order-1 lg:col-span-4 flex-col items-end gap-10 relative z-20">
            {leftItems.map((item, idx) => renderPillCard(item, idx))}
          </div>

          {/* CENTERPIECE: Real Background-Removed Cutout Portrait */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 lg:col-span-4 relative z-10 flex flex-col items-center justify-end"
          >
            <div
              className="relative flex items-end justify-center"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 82%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 82%, transparent 100%)",
              }}
            >
              <Image
                src="/images/bian_cutout.png"
                alt="Naufal Nizar De Bian — Siswa SMK Telkom Malang"
                width={931}
                height={1900}
                unoptimized
                className="w-[205px] sm:w-[245px] lg:w-[275px] h-auto object-contain select-none drop-shadow-[0_18px_36px_rgba(15,23,42,0.12)]"
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 290px"
              />
            </div>
          </motion.div>

          {/* MOBILE / TABLET PILL GRID (Shown below cutout portrait on < lg screens) */}
          <div className="lg:hidden order-2 w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 relative z-20">
            {[...leftItems, ...rightItems].map((item, idx) =>
              renderPillCard(item, idx)
            )}
          </div>

          {/* RIGHT WING (Desktop lg+: 3 Pills flanking right side symmetrically) */}
          <div className="hidden lg:flex lg:order-3 lg:col-span-4 flex-col items-start gap-10 relative z-20">
            {rightItems.map((item, idx) => renderPillCard(item, idx + 3))}
          </div>
        </div>
      </div>
    </section>
  );
}

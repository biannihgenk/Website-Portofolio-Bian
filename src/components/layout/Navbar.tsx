"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  locale: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  email?: string;
}

interface AiMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function Navbar({
  locale,
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  instagramUrl = "https://instagram.com",
  email = "debian.bian@student.telkomschools.sch.id",
}: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  const [timeStr, setTimeStr] = useState<string>("14:30:00");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState<boolean>(true);

  // Modals
  const [guideModalOpen, setGuideModalOpen] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);

  // AI Chat State
  const [aiInput, setAiInput] = useState<string>("");
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text:
        locale === "en"
          ? "Hi! I'm Bian's AI Assistant. Ask me anything about Debian's projects, networking skills, homelab, or education!"
          : "Hai! Saya Asisten AI Bian. Tanyakan apa saja tentang proyek, keahlian jaringan komputer (TKJ), homelab, atau pencapaian Bian!",
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLLIElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLLIElement>(null);

  // Live WIB clock update
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
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll listener for dynamic navbar morph
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open welcome guide popup automatically when opening the website
  useEffect(() => {
    const t = setTimeout(() => {
      setGuideModalOpen(true);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  // Handle click outside & ESC key for dropdowns & modals
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const clickedInsideAboutBtn = dropdownRef.current?.contains(target);
      const clickedInsideAboutMenu = aboutDropdownRef.current?.contains(target);

      if (!clickedInsideAboutBtn && !clickedInsideAboutMenu) {
        setAboutOpen(false);
      }
      if (contactRef.current && !contactRef.current.contains(target)) {
        setContactOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAboutOpen(false);
        setContactOpen(false);
        setMobileMenuOpen(false);
        setGuideModalOpen(false);
        setAiModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Listen for global open-ai-chat event from Net-Bot companion or other buttons
  useEffect(() => {
    function handleOpenAiChat() {
      setAiModalOpen(true);
      setGuideModalOpen(false);
      setMobileMenuOpen(false);
    }
    window.addEventListener("open-ai-chat", handleOpenAiChat);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenAiChat);
    };
  }, []);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiMessages, isAiTyping]);

  // Switch locale safely preserving current route
  function handleLocaleChange(newLocale: "id" | "en") {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  function handleDismissGuide() {
    try {
      localStorage.setItem("bian_welcome_guide_seen", "true");
    } catch {
      // ignore
    }
    setGuideModalOpen(false);
  }

  // AI Knowledge responder based on portfolio data
  function respondToAiQuery(query: string) {
    const q = query.toLowerCase();
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "";
      if (q.includes("keahlian") || q.includes("skill") || q.includes("bisa apa") || q.includes("jaringan") || q.includes("network")) {
        reply =
          locale === "en"
            ? "Bian specializes in Computer Network Engineering (TKJ) at SMK Telkom Malang. His core skills include MikroTik RouterOS, Cisco CCNA routing/switching (OSPF, BGP, VLANs), Linux server administration, Docker containerization, and modern full-stack web development (Next.js, TypeScript, TailwindCSS)."
            : "Keahlian utama Bian berakar pada Teknik Komputer dan Jaringan (TKJ) SMK Telkom Malang. Fokus teknisnya mencakup MikroTik RouterOS, konfigurasi Cisco (OSPF, BGP, VLAN, NAT), administrasi server Linux, homelab virtualisasi (Docker & Proxmox), serta web engineering modern (Next.js, TypeScript, TailwindCSS).";
      } else if (q.includes("proyek") || q.includes("project") || q.includes("vocaz") || q.includes("meditrack") || q.includes("kontrolsehat")) {
        reply =
          locale === "en"
            ? "Bian's standout projects include: 1) VocAZ — an interactive learning platform for vocational students; 2) KontrolSehat / Meditrack — a patient record & telemetry dashboard; and 3) Enterprise Star Network Topology simulation for campus infrastructure."
            : "Proyek unggulan Bian antara lain: 1) VocAZ — platform pembelajaran interaktif vokasi; 2) KontrolSehat / Meditrack — sistem pencatatan rekam medis & telemetri klinik; serta 3) Simulasi Topologi Jaringan Enterprise berbasis Cisco & MikroTik untuk lingkungan kampus.";
      } else if (q.includes("prestasi") || q.includes("achievement") || q.includes("lomba") || q.includes("oktal") || q.includes("digion")) {
        reply =
          locale === "en"
            ? "Key achievements include: Champion at OKTAL Network Competition, DIGION Innovation Awards finalist, Google AI certified specialist, and active technical lead for campus homelab infrastructure."
            : "Pencapaian utama Bian meliputi: Juara Kompetisi Jaringan OKTAL, Finalis DIGION Innovation Awards, Sertifikasi Google AI & Cloud, serta koordinator infrastruktur homelab dan lab jaringan di SMK Telkom Malang.";
      } else if (q.includes("kontak") || q.includes("contact") || q.includes("kolaborasi") || q.includes("email") || q.includes("hubungi") || q.includes("magang")) {
        reply =
          locale === "en"
            ? `You can reach Bian directly via email at ${email}, or connect on LinkedIn and GitHub. He is actively open for internship opportunities, networking projects, and collaborative software engineering.`
            : `Anda bisa langsung menghubungi Bian melalui email: ${email}, atau melalui LinkedIn dan GitHub. Bian terbuka untuk kesempatan magang (PKL), proyek infrastruktur jaringan, serta kolaborasi rekayasa perangkat lunak.`;
      } else {
        reply =
          locale === "en"
            ? "Bian (Debian) is a passionate TKJ vocational student at SMK Telkom Malang with deep interest in networking, homelab architecture, and full-stack engineering. Feel free to explore the Projects, Achievements, and Profile sections above!"
            : "Debian (Bian) adalah siswa vokasi TKJ di SMK Telkom Malang yang memiliki dedikasi tinggi pada rekayasa jaringan komputer, sistem homelab, dan pengembangan web modern. Silakan jelajahi menu Proyek, Pencapaian, dan Profil di atas!";
      }

      setAiMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "ai",
          text: reply,
        },
      ]);
      setIsAiTyping(false);
    }, 600);
  }

  function handleSendAiMessage(customText?: string) {
    const textToSend = (customText ?? aiInput).trim();
    if (!textToSend) return;

    setAiMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: "user",
        text: textToSend,
      },
    ]);
    setAiInput("");
    respondToAiQuery(textToSend);
  }

  const isHome = pathname === "/" || pathname === "";
  const isProfile = pathname.includes("/profile") || pathname.includes("/about");
  const isProjects = pathname.includes("/projects");
  const isAchievements = pathname.includes("/achievements");
  const isEducation = pathname.includes("/education");
  const isGallery = pathname.includes("/gallery");
  const isBlog = pathname.includes("/blog");

  const homeHref = isHome ? "#home" : "/";
  const projectsHref = "/projects";
  const achievementsHref = "/achievements";
  const educationHref = "/education";
  const galleryHref = "/gallery";

  const aboutSubmenuItems = [
    {
      title: t("profile"),
      desc: t("profileDesc"),
      href: "/profile",
      pill: "Story & Ethos",
      color: "bg-blue-100/80 text-blue-800",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      cols: "md:col-span-7",
    },
    {
      title: t("projects"),
      desc: t("projectsDesc"),
      href: projectsHref,
      pill: "Builds",
      color: "bg-indigo-100/80 text-indigo-800",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      cols: "md:col-span-5",
    },
    {
      title: t("achievements"),
      desc: t("achievementsDesc"),
      href: achievementsHref,
      pill: "Milestones",
      color: "bg-sky-100/80 text-sky-800",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
      cols: "md:col-span-4",
    },
    {
      title: t("education"),
      desc: t("educationDesc"),
      href: educationHref,
      pill: "SMK & Labs",
      color: "bg-blue-50 text-blue-700",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      cols: "md:col-span-4",
    },
    {
      title: t("gallery"),
      desc: t("galleryDesc"),
      href: galleryHref,
      pill: "Scrapbook",
      color: "bg-indigo-50 text-indigo-700",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      cols: "md:col-span-4",
    },
  ];

  return (
    <>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* MORPHING HEADER CONTAINER */}
      {/* Dynamic transition between Full-width top and Scrolled Floating Pill */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header
        className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-out ${
          isScrolled
            ? "top-2.5 sm:top-4 px-3 sm:px-6"
            : "top-0 px-4 sm:px-8 py-3 sm:py-4"
        }`}
      >
        <div
          className={`pointer-events-auto w-full transition-all duration-500 ease-out relative ${
            isScrolled ? "max-w-5xl" : "max-w-7xl"
          }`}
        >
          <nav
            className={`flex items-center justify-between transition-all duration-500 ease-out ${
              isScrolled
                ? "bg-white/92 backdrop-blur-xl border border-[#ded8cb] rounded-full px-3.5 sm:px-5 py-2 shadow-scrapbook-lg"
                : "bg-white/80 backdrop-blur-md border border-[#ded8cb]/80 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 shadow-xs"
            }`}
          >
            {/* ─────────────────────────────────────────────────────── */}
            {/* LEFT: Logo / Avatar + Live WIB Clock (No text name) */}
            {/* ─────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href={homeHref}
                className="group relative flex items-center focus:outline-none"
                aria-label="Home"
              >
                <div className="relative">
                  <Image
                    src="/images/neon_esports_avatar.png"
                    alt="Debian Avatar"
                    width={38}
                    height={38}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 group-hover:ring-2 group-hover:ring-blue-500/40 transition-all duration-200"
                    priority
                  />
                  {/* Live active indicator badge */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                </div>
              </Link>

              <div className="h-4 w-[1px] bg-[#ded8cb] hidden sm:block" />

              {/* Live Digital Clock (WIB) */}
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-[#6b6863] bg-[#f5f3ee] px-2.5 py-1 rounded-full border border-[#e6e2d8]">
                <svg
                  className="w-3.5 h-3.5 text-[#222222]/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-semibold text-[#222222] tracking-wider">{timeStr}</span>
                <span className="text-[10px] text-[#6b6863] uppercase">WIB</span>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────── */}
            {/* CENTER: Main Navigation Links with Pill Hover & Active */}
            {/* ─────────────────────────────────────────────────────── */}
            <ul className="hidden md:flex items-center gap-1">
              {/* Beranda (Home) */}
              <li>
                <Link
                  href="/"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isHome
                      ? "bg-blue-50 text-blue-600 font-bold shadow-xs border border-blue-200/60"
                      : "text-[#6b6863] hover:text-[#222222] hover:bg-[#f5f3ee]"
                  }`}
                >
                  {t("home")}
                </Link>
              </li>

              {/* Tentang (About with Bento Dropdown) */}
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setAboutOpen(!aboutOpen);
                    setContactOpen(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    aboutOpen
                      ? "bg-blue-100 text-blue-900 font-bold border border-blue-300 shadow-xs"
                      : isProfile || isProjects || isAchievements || isEducation || isGallery
                      ? "bg-blue-50 text-blue-600 font-bold border border-blue-200/60 shadow-xs"
                      : "text-[#6b6863] hover:text-[#222222] hover:bg-[#f5f3ee]"
                  }`}
                  aria-expanded={aboutOpen}
                >
                  <span>{t("about")}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      aboutOpen ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </li>

              {/* Catatan / Blog */}
              <li>
                <Link
                  href="/blog"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isBlog
                      ? "bg-blue-50 text-blue-600 font-bold shadow-xs border border-blue-200/60"
                      : "text-[#6b6863] hover:text-[#222222] hover:bg-[#f5f3ee]"
                  }`}
                >
                  {t("blog")}
                </Link>
              </li>

              {/* Kontak with Quick Popover Trigger */}
              <li className="relative" ref={contactRef}>
                <button
                  type="button"
                  onClick={() => {
                    setContactOpen(!contactOpen);
                    setAboutOpen(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    contactOpen
                      ? "bg-[#f3b9a7]/50 text-[#222222] font-bold border border-[#222222]/20"
                      : "text-[#6b6863] hover:text-[#222222] hover:bg-[#f5f3ee]"
                  }`}
                >
                  {t("contact")}
                </button>

                {/* Contact Popover Dropdown */}
                {contactOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl p-4 border border-[#ded8cb] shadow-scrapbook-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#6b6863] pb-2 border-b border-[#e6e2d8] flex items-center justify-between">
                      <span>Verified Channels</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>

                    <div className="mt-3 space-y-2">
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-[#f5f3ee] hover:bg-[#dbeafe]/30 border border-[#e6e2d8] hover:border-[#222222]/20 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#222222] group-hover:scale-105 transition-transform">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-[#222222]">GitHub</div>
                            <div className="text-[10px] font-mono text-[#6b6863]">Code &amp; Open Source</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[#6b6863] group-hover:translate-x-0.5 transition-transform">↗</span>
                      </a>

                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-[#f5f3ee] hover:bg-[#dbeafe]/30 border border-[#e6e2d8] hover:border-[#222222]/20 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#222222] group-hover:scale-105 transition-transform">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-[#222222]">LinkedIn</div>
                            <div className="text-[10px] font-mono text-[#6b6863]">Professional Network</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[#6b6863] group-hover:translate-x-0.5 transition-transform">↗</span>
                      </a>

                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-[#f5f3ee] hover:bg-[#dbeafe]/30 border border-[#e6e2d8] hover:border-[#222222]/20 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#222222] group-hover:scale-105 transition-transform">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-[#222222]">Instagram</div>
                            <div className="text-[10px] font-mono text-[#6b6863]">Campus &amp; Lab Life</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[#6b6863] group-hover:translate-x-0.5 transition-transform">↗</span>
                      </a>

                      <a
                        href={`mailto:${email}`}
                        className="flex items-center justify-center gap-2 w-full mt-2 py-2 rounded-xl bg-[#222222] text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        <span>✉</span>
                        <span>Send Direct Email</span>
                      </a>
                    </div>
                  </div>
                )}
              </li>
            </ul>

            {/* ─────────────────────────────────────────────────────── */}
            {/* RIGHT: "✨ Tanya AI", "ID | EN" Switcher, Help (?) Icon */}
            {/* ─────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* ✨ Tanya AI Button (Prominent Blue Pill) */}
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer group"
              >
                <svg
                  className="w-3.5 h-3.5 text-blue-200 group-hover:rotate-12 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
                <span>{t("askAi")}</span>
              </button>

              {/* Language Switcher Pill (ID / EN) */}
              <div className="flex items-center p-0.5 rounded-full bg-[#f5f3ee] border border-[#e6e2d8] text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => handleLocaleChange("id")}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    locale === "id"
                      ? "bg-white text-[#222222] font-bold shadow-xs"
                      : "text-[#6b6863] hover:text-[#222222]"
                  }`}
                  title="Bahasa Indonesia"
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => handleLocaleChange("en")}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    locale === "en"
                      ? "bg-white text-[#222222] font-bold shadow-xs"
                      : "text-[#6b6863] hover:text-[#222222]"
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              {/* Help Guide Button (?) - visible on sm+ screens */}
              <button
                type="button"
                onClick={() => setGuideModalOpen(true)}
                className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f5f3ee] hover:bg-white border border-[#ded8cb] hover:border-[#222222]/30 items-center justify-center text-[#222222] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                aria-label={t("helpGuide")}
                title={t("helpGuide")}
              >
                <svg
                  className="w-3.5 h-3.5 text-[#555555]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>

              {/* Mobile Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 rounded-full bg-[#f5f3ee] border border-[#e6e2d8] flex items-center justify-center text-[#222222] hover:bg-[#ded8cb] transition-colors ml-0.5"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </nav>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* BENTO MEGA-MENU DROPDOWN CARD (ABOUT EXPANDED STATE) */}
          {/* ───────────────────────────────────────────────────────────── */}
          {aboutOpen && (
            <div
              ref={aboutDropdownRef}
              className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-4xl mt-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
            >
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#ded8cb] shadow-xl relative">
                {/* Bento Grid Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#e6e2d8] mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 border border-blue-600/40" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6b6863]">
                      {t("aboutSubmenuTitle")}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#6b6863] hidden sm:inline-block">
                    {t("aboutSubmenuSubtitle")}
                  </span>
                </div>

                {/* 5 SUBMENU ITEMS: Bento Layout mirroring Stitch design */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {aboutSubmenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAboutOpen(false)}
                      className={`group ${item.cols} bg-[#f5f3ee] hover:bg-white p-4 sm:p-4.5 rounded-2xl border border-[#e6e2d8] hover:border-[#222222]/30 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl ${item.color} border border-[#222222]/15 flex items-center justify-center text-[#222222] group-hover:scale-110 transition-transform`}
                        >
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#ded8cb] text-[#6b6863] font-medium">
                          {item.pill}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif font-bold text-base text-[#222222] group-hover:text-black">
                            {item.title}
                          </h3>
                          <span className="text-xs text-[#6b6863] group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                        <p className="text-xs text-[#6b6863] mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Dropdown Bottom Bar */}
                <div className="mt-4 pt-3 border-t border-[#e6e2d8] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#6b6863]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Select any section to navigate directly within About</span>
                  </span>
                  <span className="hidden sm:inline-block">
                    {t("closeDropdownHint")} (
                    <kbd className="px-1.5 py-0.5 bg-[#f5f3ee] border border-[#ded8cb] rounded text-[10px] text-[#222222] font-semibold">
                      ESC
                    </kbd>
                    )
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* "SELAMAT DATANG!" FEATURE GUIDE MODAL (Screenshot 2 Match) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {guideModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGuideModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ded8cb] z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Top Close Button */}
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f3ee] hover:bg-[#ded8cb] text-[#6b6863] hover:text-[#222222] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Logo / Avatar Stamp */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-xs">
                  <Image
                    src="/images/neon_esports_avatar.png"
                    alt="Logo Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                </div>
              </div>

              {/* Header Titles */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222] tracking-tight">
                {t("welcomeTitle")}
              </h2>
              <p className="text-sm text-[#6b6863] mt-1.5 leading-relaxed">
                {t("welcomeSubtitle")}
              </p>

              {/* 5 Features List matching Screenshot 2 */}
              <div className="mt-5 space-y-3.5">
                {/* 1. Navigasi */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#222222]">{t("guideNavTitle")}</h3>
                    <p className="text-xs text-[#6b6863] leading-relaxed mt-0.5">{t("guideNavDesc")}</p>
                  </div>
                </div>

                {/* 2. Interaktif 3D & Gerakan */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#222222]">{t("guideInteractiveTitle")}</h3>
                    <p className="text-xs text-[#6b6863] leading-relaxed mt-0.5">{t("guideInteractiveDesc")}</p>
                  </div>
                </div>

                {/* 3. AI Assistant */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#222222]">{t("guideAiTitle")}</h3>
                    <p className="text-xs text-[#6b6863] leading-relaxed mt-0.5">{t("guideAiDesc")}</p>
                  </div>
                </div>

                {/* 4. Bahasa (ID / EN) */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m5 8 6 6" />
                      <path d="m4 14 6-6 2-3" />
                      <path d="M2 5h12" />
                      <path d="M7 2h1" />
                      <path d="m22 22-5-10-5 10" />
                      <path d="M14 18h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#222222]">{t("guideLangTitle")}</h3>
                    <p className="text-xs text-[#6b6863] leading-relaxed mt-0.5">{t("guideLangDesc")}</p>
                  </div>
                </div>

                {/* 5. Live WIB Clock */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#222222]">{t("guideClockTitle")}</h3>
                    <p className="text-xs text-[#6b6863] leading-relaxed mt-0.5">{t("guideClockDesc")}</p>
                  </div>
                </div>
              </div>

              {/* Big Blue CTA Button */}
              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={handleDismissGuide}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t("welcomeDismiss")}</span>
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* "✨ TANYA AI" INTERACTIVE CHAT MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {aiModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#ded8cb] z-10 flex flex-col h-[580px] max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#ded8cb] bg-linear-to-r from-blue-50/50 via-white to-indigo-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#222222]">
                        {locale === "en" ? "Ask Bian's AI" : "Tanya AI tentang Bian"}
                      </h3>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                        Assistant
                      </span>
                    </div>
                    <p className="text-xs text-[#6b6863]">
                      {locale === "en"
                        ? "Interactive portfolio knowledge base"
                        : "Asisten cerdas seputar keahlian, proyek & profil"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f5f3ee] hover:bg-[#ded8cb] text-[#6b6863] hover:text-[#222222] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Chat Message Scroll Area */}
              <div
                ref={chatScrollRef}
                className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#faf8f4]/60"
              >
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-xs"
                          : "bg-white text-[#222222] border border-[#ded8cb] rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#ded8cb] rounded-2xl rounded-bl-xs px-4 py-2.5 flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2.5 bg-white border-t border-[#ded8cb] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-mono text-[#6b6863] shrink-0 font-medium">
                  {locale === "en" ? "Suggestions:" : "Saran:"}
                </span>
                {[
                  locale === "en" ? "Technical skills?" : "Keahlian utama Bian?",
                  locale === "en" ? "Showcase projects?" : "Proyek unggulan Bian?",
                  locale === "en" ? "Vocational achievements?" : "Prestasi & lomba?",
                  locale === "en" ? "How to contact?" : "Cara kolaborasi / kontak?",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendAiMessage(chip)}
                    className="text-xs font-medium bg-[#f5f3ee] hover:bg-blue-50 hover:text-blue-600 text-[#444444] px-3 py-1 rounded-full border border-[#e6e2d8] hover:border-blue-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiMessage();
                }}
                className="p-3 sm:p-4 bg-white border-t border-[#ded8cb] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={
                    locale === "en"
                      ? "Ask about Bian's skills, homelab, projects..."
                      : "Tanyakan seputar keahlian, homelab, proyek Bian..."
                  }
                  className="flex-1 bg-[#f5f3ee] border border-[#e6e2d8] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim()}
                  className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{locale === "en" ? "Send" : "Kirim"}</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE NAVIGATION DRAWER (ACCORDION & TOUCH-FRIENDLY) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex flex-col justify-start p-4 pt-16 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#ded8cb] p-5 shadow-scrapbook-lg max-h-[85vh] overflow-y-auto space-y-4">
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e2d8]">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/neon_esports_avatar.png"
                  alt="Debian Avatar"
                  width={34}
                  height={34}
                  className="w-8 h-8 rounded-full object-cover border border-[#ded8cb]"
                />
                <span className="text-[11px] font-mono bg-[#f5f3ee] px-2.5 py-0.5 rounded-full border border-[#ded8cb] text-[#6b6863]">
                  {timeStr} WIB
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-[#222222] text-white flex items-center justify-center cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Mobile Quick Action Buttons (Tanya AI & Panduan) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAiModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
                <span>{t("askAi")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGuideModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#f5f3ee] hover:bg-[#e6e2d8] text-[#222222] text-xs font-bold border border-[#ded8cb] transition-colors cursor-pointer"
              >
                <span>(?) {t("helpGuide")}</span>
              </button>
            </div>

            {/* Mobile Links List */}
            <nav className="space-y-1.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isHome ? "bg-blue-50 text-blue-600 font-bold" : "text-[#222222] hover:bg-[#f5f3ee]"
                }`}
              >
                {t("home")}
              </Link>

              {/* Mobile Accordion: About & 5 Subsections */}
              <div className="bg-[#f5f3ee] rounded-2xl p-3 border border-[#ded8cb]/80 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#222222] cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 border border-blue-600/40" />
                    <span>{t("about")}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#6b6863]">
                    {mobileAboutExpanded ? "Hide Submenu ▲" : "5 Subsections ▼"}
                  </span>
                </button>

                {mobileAboutExpanded && (
                  <div className="pl-3 border-l-2 border-blue-400 space-y-2 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#222222] hover:underline"
                    >
                      1. {t("profile")} <span className="text-[10px] text-[#6b6863]">— Bio &amp; Ethos</span>
                    </Link>
                    <Link
                      href="/projects"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#222222] hover:underline"
                    >
                      2. {t("projects")} <span className="text-[10px] text-[#6b6863]">— Builds &amp; Showcase</span>
                    </Link>
                    <Link
                      href="/achievements"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#222222] hover:underline"
                    >
                      3. {t("achievements")} <span className="text-[10px] text-[#6b6863]">— Milestones &amp; Certs</span>
                    </Link>
                    <Link
                      href="/education"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#222222] hover:underline"
                    >
                      4. {t("education")} <span className="text-[10px] text-[#6b6863]">— SMK Telkom &amp; Homelab</span>
                    </Link>
                    <Link
                      href="/gallery"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#222222] hover:underline"
                    >
                      5. {t("gallery")} <span className="text-[10px] text-[#6b6863]">— Photo Scrapbook</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isBlog ? "bg-blue-50 text-blue-600 font-bold" : "text-[#222222] hover:bg-[#f5f3ee]"
                }`}
              >
                {t("blog")}
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold bg-[#f3b9a7]/30 border border-[#f3b9a7]/50 text-[#222222] hover:bg-[#f3b9a7]/50 transition-colors"
              >
                {t("contact")}
              </Link>
            </nav>

            {/* Mobile Language Switcher & Socials */}
            <div className="pt-3 border-t border-[#e6e2d8] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-[#6b6863]">Lang:</span>
                <button
                  type="button"
                  onClick={() => {
                    handleLocaleChange("id");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    locale === "id" ? "bg-[#222222] text-white" : "bg-[#f5f3ee] text-[#6b6863]"
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLocaleChange("en");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    locale === "en" ? "bg-[#222222] text-white" : "bg-[#f5f3ee] text-[#6b6863]"
                  }`}
                >
                  EN
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#f5f3ee] text-[#222222]"
                >
                  GH ↗
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#f5f3ee] text-[#222222]"
                >
                  LI ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

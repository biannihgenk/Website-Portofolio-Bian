"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveSticker } from "@/components/ui/InteractiveSticker";

interface ContactSectionProps {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

interface StickerData {
  id: string;
  imageSrc: string;
  alt: string;
  badge: string;
  badgeColor: "blue" | "emerald" | "amber" | "purple" | "rose" | "dark";
  quote: string;
  story: string;
  factTag: string;
  size: "xs" | "sm" | "md" | "lg";
  floatType: "1" | "2" | "3";
  pitchIndex: number;
  baseClass: string;
  tooltipPosition: "top" | "bottom";
}

const STICKERS_COLLECTION: StickerData[] = [
  {
    id: "mascot",
    imageSrc: "/images/sticker_dev_mascot.png",
    alt: "Si Bian Developer Mascot",
    badge: "Moklet A'35",
    badgeColor: "blue",
    quote: "Halo, Saya Bian! 👋",
    story:
      "Siswa kelas X TKJ di SMK Telkom Malang. Kesehariannya belajar seputar jaringan komputer dan senang eksplorasi pembuatan website.",
    factTag: "Kelas X TKJ • SMK Telkom Malang",
    size: "lg",
    floatType: "1",
    pitchIndex: 0,
    baseClass: "left-3 sm:left-8 lg:left-14 top-6 sm:top-10",
    tooltipPosition: "bottom",
  },
  {
    id: "server-rack",
    imageSrc: "/images/sticker_server_rack.png",
    alt: "Homelab Rack",
    badge: "Homelab",
    badgeColor: "emerald",
    quote: "Infrastruktur Homelab Server 🖥️",
    story:
      "Infrastruktur server mandiri berbasis Debian Linux dan Docker untuk pengujian arsitektur microservices dan deployment sistem.",
    factTag: "Debian Linux • Pengujian Lingkungan Mandiri",
    size: "md",
    floatType: "2",
    pitchIndex: 1,
    baseClass: "left-5 sm:left-14 lg:left-24 bottom-6 sm:bottom-12",
    tooltipPosition: "top",
  },
  {
    id: "ai-chip",
    imageSrc: "/images/sticker_ai_chip.png",
    alt: "AI Brain Chip",
    badge: "Eksplorasi AI",
    badgeColor: "purple",
    quote: "Riset AI & Logika Sistem 🧠",
    story:
      "Mendalami mekanisme model inferensi lokal, logika komputasi cerdas, dan integrasi otomasi alur kerja modern.",
    factTag: "Machine Learning • Automasi Cerdas",
    size: "sm",
    floatType: "3",
    pitchIndex: 2,
    baseClass: "left-[18%] sm:left-[22%] top-6 sm:top-10",
    tooltipPosition: "bottom",
  },
  {
    id: "cyber-cat",
    imageSrc: "/images/sticker_cyber_cat.png",
    alt: "Maskot Kerja",
    badge: "Pendamping Kerja",
    badgeColor: "rose",
    quote: "Fokus & Ketenangan Meja Kerja 🐾",
    story:
      "Menciptakan suasana kerja yang tenang dan kondusif saat menelaah dokumentasi teknis dan arsitektur kode.",
    factTag: "Fokus Meja Kerja • Ketekunan Riset",
    size: "md",
    floatType: "1",
    pitchIndex: 3,
    baseClass: "left-[16%] sm:left-[20%] bottom-16 sm:bottom-22",
    tooltipPosition: "top",
  },
  {
    id: "gamepad",
    imageSrc: "/images/sticker_game_pad.png",
    alt: "Retro Controller",
    badge: "Relaksasi Strategis",
    badgeColor: "rose",
    quote: "Penyegaran Fokus & Logika 🎮",
    story:
      "Media relaksasi strategis di luar jam akademik laboratorium untuk memelihara ketajaman logika berpikir.",
    factTag: "Rekreasi Logika • Keseimbangan Fokus",
    size: "md",
    floatType: "2",
    pitchIndex: 4,
    baseClass: "left-[34%] sm:left-[36%] top-8 sm:top-14",
    tooltipPosition: "bottom",
  },
  {
    id: "mech-keyboard",
    imageSrc: "/images/sticker_mech_keyboard.png",
    alt: "Mechanical Keyboard",
    badge: "Instrumen Presisi",
    badgeColor: "amber",
    quote: "Instrumen Taktil Presisi ⌨️",
    story:
      "Keyboard mekanik dengan respon taktil presisi untuk menunjang kecepatan dan ketepatan penulisan kode serta dokumentasi teknis.",
    factTag: "Workstation Setup • Produktivitas Tinggi",
    size: "md",
    floatType: "3",
    pitchIndex: 5,
    baseClass: "left-[32%] sm:left-[34%] bottom-4 sm:bottom-10",
    tooltipPosition: "top",
  },
  {
    id: "packet-router",
    imageSrc: "/images/sticker_packet_router.png",
    alt: "Router Jaringan",
    badge: "Infrastruktur TKJ",
    badgeColor: "rose",
    quote: "Arsitektur Routing Jaringan 📡",
    story:
      "Mendalami mekanisme transmisi paket data antar-subnet, dynamic routing OSPF, dan konfigurasi firewall MikroTik/Cisco.",
    factTag: "Perancangan Jaringan Enterprise",
    size: "sm",
    floatType: "1",
    pitchIndex: 6,
    baseClass: "left-1/2 -translate-x-1/2 top-4 sm:top-8",
    tooltipPosition: "bottom",
  },
  {
    id: "rj45-cable",
    imageSrc: "/images/sticker_rj45_cable.png",
    alt: "Terminasi Kabel LAN",
    badge: "Pengkabelan Fisik",
    badgeColor: "blue",
    quote: "Terminasi Kabel Terstruktur 🔌",
    story:
      "Penguasaan standar pengkabelan terstruktur T568A/B pada kabel UTP Cat6 dengan pengujian integritas sinyal berkecepatan Gigabit.",
    factTag: "Pengkabelan Terstruktur • Standar TIA/EIA",
    size: "md",
    floatType: "2",
    pitchIndex: 7,
    baseClass: "left-1/2 -translate-x-1/2 bottom-8 sm:bottom-14",
    tooltipPosition: "top",
  },
  {
    id: "boba",
    imageSrc: "/images/sticker_boba_coffee.png",
    alt: "Kopi Katalis",
    badge: "Katalis Kerja",
    badgeColor: "amber",
    quote: "Katalis Konsentrasi ☕",
    story:
      "Secangkir kopi hangat untuk menjaga ritme konsentrasi optimal saat merancang skema arsitektur dan refactoring kode.",
    factTag: "Fokus Mendalam • Sesi Rekayasa",
    size: "sm",
    floatType: "1",
    pitchIndex: 8,
    baseClass: "right-[32%] sm:right-[34%] top-8 sm:top-14",
    tooltipPosition: "bottom",
  },
  {
    id: "linux-tux",
    imageSrc: "/images/sticker_linux_tux.png",
    alt: "Linux Penguin Tux",
    badge: "Sistem Operasi",
    badgeColor: "dark",
    quote: "Administrasi Linux Debian 🐧",
    story:
      "Dedikasi mendalam pada sistem operasi open-source, administrasi kernel Linux, manajemen paket, dan otomasi command line.",
    factTag: "Debian GNU/Linux • Server Daemons",
    size: "md",
    floatType: "3",
    pitchIndex: 9,
    baseClass: "right-[30%] sm:right-[32%] bottom-4 sm:bottom-10",
    tooltipPosition: "top",
  },
  {
    id: "fiber-globe",
    imageSrc: "/images/sticker_fiber_globe.png",
    alt: "Kabel Fiber Optik",
    badge: "Telekomunikasi",
    badgeColor: "blue",
    quote: "Transmisi Fiber Optik 🌐",
    story:
      "Mempelajari transmisi optik berkecepatan tinggi, redaman kabel, dan penyambungan fusion splicing pada infrastruktur jaringan modern.",
    factTag: "Backbone Telekomunikasi Modern",
    size: "sm",
    floatType: "2",
    pitchIndex: 10,
    baseClass: "right-[18%] sm:right-[22%] top-6 sm:top-10",
    tooltipPosition: "bottom",
  },
  {
    id: "film-roll",
    imageSrc: "/images/sticker_film_roll.png",
    alt: "Arsip Dokumentasi",
    badge: "Dokumentasi",
    badgeColor: "dark",
    quote: "Dokumentasi Visual Terstruktur 📸",
    story:
      "Dokumentasi visual terstruktur untuk merekam aktivitas laboratorium, interaksi tim pengembang, dan tonggak kemajuan akademik.",
    factTag: "Dokumentasi Visual & Rekam Jejak",
    size: "md",
    floatType: "1",
    pitchIndex: 11,
    baseClass: "right-3 sm:right-8 lg:right-14 bottom-6 sm:bottom-12",
    tooltipPosition: "top",
  },
];

export function ContactSection({
  email = "debian.bian@student.telkomschools.sch.id",
  githubUrl = "https://github.com/biannihgenk",
  linkedinUrl = "https://linkedin.com/in/debian-firwanto-49728635a/",
  instagramUrl = "https://instagram.com/debianxyzz",
}: ContactSectionProps) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  // Arcade & Mini Game States
  const [gameMode, setGameMode] = useState<"sandbox" | "packet-rush">("sandbox");
  const [discoveredStickers, setDiscoveredStickers] = useState<string[]>([]);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState(false);

  // Dynamic Shuffled Offsets: makes "Kocok" truly shuffle positions visually
  const [stickerTransforms, setStickerTransforms] = useState<
    Record<string, { x: number; y: number; rotate: number }>
  >({});

  // Packet Rush Mini Game States
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("moklet_packet_rush_highscore");
        if (saved) return parseInt(saved, 10);
      } catch {}
    }
    return 0;
  });
  const [timeLeft, setTimeLeft] = useState(25);
  const [combo, setCombo] = useState(1);
  const [packetPos, setPacketPos] = useState({ x: 50, y: 50 });
  const [floatingScores, setFloatingScores] = useState<
    Array<{ id: number; text: string; x: number; y: number }>
  >([]);

  // Web Audio Synth tone generator
  const playArcadeTone = (freq: number, type: OscillatorType = "sine", duration = 0.1) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch {}
  };

  // Sticker Discovery Tracking
  const handleStickerDiscovery = (id: string) => {
    setDiscoveredStickers((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Truly Shuffle Sticker Positions with Spring Physics
  const handleShuffle = () => {
    const newTransforms: Record<string, { x: number; y: number; rotate: number }> = {};
    STICKERS_COLLECTION.forEach((s) => {
      newTransforms[s.id] = {
        x: Math.round((Math.random() - 0.5) * 55),
        y: Math.round((Math.random() - 0.5) * 45),
        rotate: Math.round((Math.random() - 0.5) * 26),
      };
    });
    setStickerTransforms(newTransforms);

    // Play lively shuffle arpeggio chord
    playArcadeTone(440, "triangle", 0.08);
    setTimeout(() => playArcadeTone(554.37, "triangle", 0.08), 50);
    setTimeout(() => playArcadeTone(659.25, "triangle", 0.12), 100);
  };

  // Reset Sticker Positions back to balanced grid
  const handleResetPositions = () => {
    setStickerTransforms({});
    playArcadeTone(392, "sine", 0.12);
  };

  // Play Lab Arpeggio Melody
  const playLabMelody = () => {
    if (isMelodyPlaying) return;
    setIsMelodyPlaying(true);
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const notes = [
          261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99,
          880.0,
        ];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = ctx.currentTime + idx * 0.09;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.14);
        });
      }
    } catch {}
    setTimeout(() => setIsMelodyPlaying(false), 1400);
  };

  // Packet Rush Mini Game Logic
  const startPacketRush = () => {
    setGameMode("packet-rush");
    setGameState("playing");
    setScore(0);
    setCombo(1);
    setTimeLeft(25);
    setPacketPos({
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 60) + 20,
    });
    playArcadeTone(440, "sine", 0.2);
  };

  // Game countdown timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("gameover");
          playArcadeTone(784, "triangle", 0.3);
          setScore((currentScore) => {
            setHighScore((currentHigh) => {
              if (currentScore > currentHigh) {
                try {
                  localStorage.setItem("moklet_packet_rush_highscore", currentScore.toString());
                } catch {}
                return currentScore;
              }
              return currentHigh;
            });
            return currentScore;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Packet roaming hops every 1100ms
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setPacketPos({
        x: Math.floor(Math.random() * 74) + 12,
        y: Math.floor(Math.random() * 65) + 16,
      });
      setCombo(1);
    }, 1100);

    return () => clearInterval(interval);
  }, [gameState]);

  // Handle clicking the rogue packet
  const handleCatchPacket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== "playing") return;

    const gainedScore = 100 * combo;
    setScore((prev) => prev + gainedScore);

    const pitch = Math.min(1200, 480 + combo * 70);
    playArcadeTone(pitch, "triangle", 0.12);

    const id = Date.now();
    setFloatingScores((prev) => [
      ...prev,
      {
        id,
        text: `+${gainedScore} (x${combo})!`,
        x: packetPos.x,
        y: packetPos.y,
      },
    ]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== id));
    }, 800);

    setCombo((prev) => Math.min(prev + 1, 8));
    setPacketPos({
      x: Math.floor(Math.random() * 74) + 12,
      y: Math.floor(Math.random() * 65) + 16,
    });
  };

  function handleCopyEmail() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const ribbon1Items = [
    "SOFTWARE ENGINEER",
    "AI & ML PIPELINES",
    "NETWORK INFRASTRUCTURE",
    "NEXT.JS 15 & REACT",
    "SUPABASE & POSTGRESQL",
    "MIKROTIK ROUTEROS",
    "DEBIAN LINUX SERVER",
    "FULLSTACK DEVELOPER",
    "REST & GRAPHQL API",
    "DOCKER HOMELAB",
    "SYSTEM ARCHITECTURE",
  ];

  const ribbon2Items = [
    "VOCATIONAL TKJ SMK TELKOM",
    "FIBER OPTICS & CABLING",
    "VLAN & OSPF ROUTING",
    "CYBERSECURITY BASICS",
    "PYTHON AUTOMATION",
    "TYPESCRIPT & TAILWIND",
    "MQTT & IOT SENSORS",
    "HIGH AVAILABILITY",
    "LINUX BASH SCRIPTING",
    "HOMELAB OPERATOR",
  ];

  return (
    <section id="contact" className="w-full relative overflow-hidden pt-10 pb-20 sm:pb-28">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. MOKLET REFRESHING ARCADE & 3D INTERACTIVE PLAYGROUND STAGE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full relative py-8 sm:py-12 overflow-hidden">
        {/* Playful Arcade HUD Bar */}
        <div className="max-w-4xl mx-auto px-4 mb-6 sm:mb-8 relative z-40">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#ded8cb] p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => {
                  setGameMode("sandbox");
                  setGameState("idle");
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gameMode === "sandbox"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-[#fbf9f3] text-[#222222] hover:bg-purple-50 border border-[#ded8cb]"
                }`}
              >
                <span>🕹️</span>
                <span>Mode Jelajah (12 Stiker)</span>
              </button>

              <button
                type="button"
                onClick={startPacketRush}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gameMode === "packet-rush"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-[#fbf9f3] text-[#222222] hover:bg-blue-50 border border-[#ded8cb]"
                }`}
              >
                <span>⚡</span>
                <span>Mini Game: Tangkap Paket!</span>
              </button>
            </div>

            {/* Mode Specific Controls */}
            {gameMode === "sandbox" ? (
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#222222] font-semibold bg-[#fbf9f3] px-3 py-1.5 rounded-xl border border-[#ded8cb]">
                  <span className="text-[#2563eb]">Stiker Ditemukan:</span>
                  <span className="text-emerald-600 font-extrabold">
                    {discoveredStickers.length} / 12
                  </span>
                </div>

                {/* Shuffling Button */}
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#222222] hover:text-[#2563eb] border border-[#ded8cb] hover:border-blue-300 font-mono text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Kocok stiker & acak posisi secara dinamis"
                >
                  <span>🎲</span>
                  <span>Kocok</span>
                </button>

                {/* Reset Positions */}
                {Object.keys(stickerTransforms).length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetPositions}
                    className="px-2.5 py-1.5 rounded-xl bg-[#f5f2ea] hover:bg-[#ded8cb] text-[#4b4843] font-mono text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Kembalikan posisi stiker ke rapi"
                  >
                    <span>🧹</span>
                    <span>Rapihkan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={playLabMelody}
                  disabled={isMelodyPlaying}
                  className="px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Bunyikan melodi lab"
                >
                  <span>🎵</span>
                  <span>{isMelodyPlaying ? "Memainkan..." : "Melodi Lab"}</span>
                </button>
              </div>
            ) : (
              /* Packet Rush Controls */
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-mono text-xs bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-xl">
                  <span>Waktu:</span>
                  <span
                    className={`font-extrabold ${
                      timeLeft <= 5 ? "text-red-600 animate-ping" : "text-blue-700"
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <span>Skor:</span>
                  <span className="font-extrabold text-emerald-700">{score}</span>
                </div>
                {combo > 1 && (
                  <span className="px-2 py-1 rounded-lg bg-amber-500 text-white font-mono text-[11px] font-extrabold animate-bounce">
                    x{combo} COMBO!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Unlocked Easter Egg Banner in Sandbox */}
          {gameMode === "sandbox" && discoveredStickers.length === 12 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-emerald-50 border border-amber-300 rounded-2xl p-3 text-center shadow-xs flex items-center justify-center gap-2 font-mono text-xs text-[#92400e] font-bold"
            >
              <span>🎉</span>
              <span>
                Hebat! Kamu sudah membuka semua 12 stiker dan mengenal keseharian Bian lebih dekat!
              </span>
            </motion.div>
          )}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* LARGE INTERACTIVE PLAYGROUND CANVAS                           */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="w-full relative min-h-[580px] sm:min-h-[640px] lg:min-h-[690px] py-16 sm:py-24 overflow-hidden select-none">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl pointer-events-none" />

          {/* ───────────────────────────────────────────────────────── */}
          {/* PACKET RUSH ACTIVE SPRITE & OVERLAY                       */}
          {/* ───────────────────────────────────────────────────────── */}
          {gameMode === "packet-rush" && gameState === "playing" && (
            <>
              {/* Rogue Data Packet Target to Catch */}
              <motion.div
                animate={{
                  left: `${packetPos.x}%`,
                  top: `${packetPos.y}%`,
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  left: { type: "spring", stiffness: 300, damping: 20 },
                  top: { type: "spring", stiffness: 300, damping: 20 },
                  scale: { duration: 0.6, repeat: Infinity },
                  rotate: { duration: 0.8, repeat: Infinity },
                }}
                onClick={handleCatchPacket}
                className="absolute z-40 -translate-x-1/2 -translate-y-1/2 cursor-crosshair group"
              >
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 text-white shadow-2xl border-2 border-white flex items-center justify-center gap-1.5 active:scale-90 transition-transform">
                  <span className="text-2xl animate-spin">⚡</span>
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-yellow-100">
                      KLIK SAYA!
                    </span>
                    <span className="font-mono text-[9px] text-white/90">Paket Data</span>
                  </div>
                  <span className="absolute -inset-2 rounded-2xl border-2 border-amber-400/80 animate-ping pointer-events-none" />
                </div>
              </motion.div>

              {/* Floating Combo / Score popups */}
              <AnimatePresence>
                {floatingScores.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -45, scale: 1.25 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    className="absolute z-50 pointer-events-none font-mono text-sm sm:text-base font-extrabold text-amber-500 drop-shadow-md"
                  >
                    {item.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}

          {/* Game Over Celebration Modal */}
          {gameMode === "packet-rush" && gameState === "gameover" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-blue-500 shadow-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 text-3xl mx-auto flex items-center justify-center border border-blue-200">
                  🎯
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-extrabold text-[#222222]">
                    Waktu Selesai!
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1">
                    Hasil tangkapan paket data kamu:
                  </p>
                </div>

                <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb] space-y-2 font-mono">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#686660]">Skor Akhir:</span>
                    <span className="text-xl font-extrabold text-emerald-600">{score}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#686660]">Skor Tertinggi:</span>
                    <span className="font-bold text-[#222222]">{highScore}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={startPacketRush}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Main Lagi 🔄
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGameMode("sandbox");
                      setGameState("idle");
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#f5f2ea] hover:bg-[#eae6dc] text-[#222222] font-mono text-xs font-bold border border-[#ded8cb] transition-all cursor-pointer"
                  >
                    Mode Jelajah 🕹️
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* THE 12 INTERACTIVE & DRAGGABLE 3D STICKERS                     */}
          {/* ───────────────────────────────────────────────────────────── */}
          {STICKERS_COLLECTION.map((sticker) => {
            const transform = stickerTransforms[sticker.id] || { x: 0, y: 0, rotate: 0 };

            return (
              <motion.div
                key={sticker.id}
                animate={{
                  x: transform.x,
                  y: transform.y,
                  rotate: transform.rotate,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 17,
                }}
                className={`absolute z-30 ${sticker.baseClass}`}
              >
                <InteractiveSticker
                  id={sticker.id}
                  imageSrc={sticker.imageSrc}
                  alt={sticker.alt}
                  badge={sticker.badge}
                  badgeColor={sticker.badgeColor}
                  quote={sticker.quote}
                  story={sticker.story}
                  factTag={sticker.factTag}
                  size={sticker.size}
                  floatType={sticker.floatType}
                  pitchIndex={sticker.pitchIndex}
                  tooltipPosition={sticker.tooltipPosition}
                  draggable={true}
                  onInteract={handleStickerDiscovery}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Dual Crossing Ticker Tapes */}
        <div className="py-6 sm:py-8 space-y-4 -mx-10 overflow-hidden">
          {/* Top Tape */}
          <div className="w-[120%] -ml-[10%] transform -rotate-[2.5deg] shadow-lg bg-[#2563eb] text-white py-3 sm:py-3.5 border-y-2 border-white/20 select-none">
            <div className="animate-marquee-left flex items-center gap-8 sm:gap-12 font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest whitespace-nowrap">
              {[...ribbon1Items, ...ribbon1Items, ...ribbon1Items, ...ribbon1Items].map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-4 sm:gap-6 hover:text-blue-100 transition-colors cursor-default"
                  >
                    <span>{item}</span>
                    <span className="text-white/60 text-xs">✦</span>
                  </span>
                )
              )}
            </div>
          </div>

          {/* Bottom Tape */}
          <div className="w-[120%] -ml-[10%] transform rotate-[2.2deg] shadow-xl bg-[#0b0c0c] text-blue-300 py-3 sm:py-3.5 border-y-2 border-blue-500/30 select-none">
            <div className="animate-marquee-right flex items-center gap-8 sm:gap-12 font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest whitespace-nowrap">
              {[...ribbon2Items, ...ribbon2Items, ...ribbon2Items, ...ribbon2Items].map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-4 sm:gap-6 hover:text-white transition-colors cursor-default"
                  >
                    <span>{item}</span>
                    <span className="text-blue-400/60 text-xs">●</span>
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MODERN "GET IN TOUCH" SHOWCASE SECTION                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-6 sm:mt-8">
        <div className="relative bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-14 lg:p-20 border border-[#ded8cb] shadow-scrapbook overflow-hidden text-center">
          {/* Corner Tape & Decorative Stamp */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-blue-100/90 rounded-b-md shadow-tape border-b border-x border-blue-200 pointer-events-none" />

          <div className="absolute top-6 right-6 bg-[#f5f3ee] px-3.5 py-1.5 rounded-xl border border-[#ded8cb] font-mono text-[10px] sm:text-[11px] font-bold text-[#686660] uppercase tracking-widest hidden md:block">
            {t("postageStamp")}
          </div>

          {/* Live Availability Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f3ee] border border-[#ded8cb] font-mono text-xs uppercase tracking-wider text-blue-700 font-bold shadow-2xs mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>{t("collaborateBadge")}</span>
          </div>

          {/* Main Headline */}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b0c0c] tracking-tight leading-[1.12] max-w-4xl mx-auto">
            {t("headingMain")}
          </h2>

          {/* Subtitle Description */}
          <p className="font-sans text-base sm:text-lg lg:text-xl text-[#686660] leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6">
            {t("headingSub")}
          </p>

          {/* Interactive Action Hub */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0b0c0c] text-white font-sans font-bold text-sm sm:text-base hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t("emailDirectAction")}</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-[#f5f3ee] hover:bg-[#eae8e2] text-[#222222] font-mono text-xs sm:text-sm border border-[#ded8cb] shadow-2xs hover:shadow-sm transition-all duration-200"
              title="Salin email ke clipboard"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{email}</span>
              <span
                className={`px-2 py-0.5 rounded-full font-sans text-[11px] font-bold transition-all ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-[#686660] border border-[#ded8cb]"
                }`}
              >
                {copied ? t("copiedToast") : t("copyEmailAction")}
              </span>
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 3. BENTO GRID OF VERIFIED CHANNELS                           */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="mt-14 sm:mt-16 pt-10 sm:pt-12 border-t border-[#ded8cb]/80 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <span className="font-mono text-xs uppercase font-bold text-blue-700 tracking-widest">
                {t("verifiedChannels")}
              </span>
              <span className="font-sans text-xs text-[#686660] italic">
                {t("verifiedNote")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* GitHub Card */}
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#f5f3ee] hover:bg-white p-5 sm:p-6 rounded-2xl border border-[#ded8cb] hover:border-[#222222] shadow-2xs hover:shadow-scrapbook transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#0b0c0c] group-hover:text-white flex items-center justify-center text-[#222222] border border-[#ded8cb] transition-colors shadow-2xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-mono text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-blue-600 transition-colors">
                    {t("channelGithubTitle")}
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1 leading-relaxed">
                    {t("channelGithubSub")}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ded8cb]/60 font-mono text-[11px] text-[#222222] font-semibold flex items-center justify-between">
                  <span>@biannihgenk</span>
                  <span className="text-blue-600">Open Source</span>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#f5f3ee] hover:bg-white p-5 sm:p-6 rounded-2xl border border-[#ded8cb] hover:border-[#222222] shadow-2xs hover:shadow-scrapbook transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#0a66c2] group-hover:text-white flex items-center justify-center text-[#0a66c2] border border-[#ded8cb] transition-colors shadow-2xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <span className="font-mono text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-blue-600 transition-colors">
                    {t("channelLinkedinTitle")}
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1 leading-relaxed">
                    {t("channelLinkedinSub")}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ded8cb]/60 font-mono text-[11px] text-[#222222] font-semibold flex items-center justify-between">
                  <span>Debian Firwanto</span>
                  <span className="text-blue-600">Network &amp; Web</span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#f5f3ee] hover:bg-white p-5 sm:p-6 rounded-2xl border border-[#ded8cb] hover:border-[#222222] shadow-2xs hover:shadow-scrapbook transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#e1306c] group-hover:text-white flex items-center justify-center text-[#e1306c] border border-[#ded8cb] transition-colors shadow-2xs">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <span className="font-mono text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#222222] group-hover:text-blue-600 transition-colors">
                    {t("channelInstagramTitle")}
                  </h3>
                  <p className="font-sans text-xs text-[#686660] mt-1 leading-relaxed">
                    {t("channelInstagramSub")}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#ded8cb]/60 font-mono text-[11px] text-[#222222] font-semibold flex items-center justify-between">
                  <span>@debianxyzz</span>
                  <span className="text-blue-600">Campus &amp; Life</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Floating Back to Top Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-full bg-white hover:bg-[#0b0c0c] text-[#222222] hover:text-white border border-[#ded8cb] shadow-sm hover:shadow-lg transition-all duration-300 font-mono text-xs font-bold active:scale-95"
            title={t("backToTop")}
            aria-label={t("backToTop")}
          >
            <span>{t("backToTop")}</span>
            <span className="w-6 h-6 rounded-full bg-[#f5f3ee] group-hover:bg-white/20 flex items-center justify-center transition-colors">
              ↑
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

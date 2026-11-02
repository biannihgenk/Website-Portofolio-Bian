"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { InteractiveSticker } from "@/components/ui/InteractiveSticker";

interface ProfileFactsAndTraitsProps {
  randomFacts?: string[] | null;
  characterNotes?: string[] | null;
}

export function ProfileFactsAndTraits({
  randomFacts,
  characterNotes,
}: ProfileFactsAndTraitsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "facts" | "character">("all");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fallbacks if database fields are empty or null
  const factsList: string[] =
    randomFacts && Array.isArray(randomFacts) && randomFacts.length > 0
      ? randomFacts
      : [
          "Juara 1 Olimpiade Kecerdasan Artifisial (OKTAL) 2026 Kota Malang",
          "Siswa aktif di SMK Telkom Malang kelas X TKJ (Moklet A'35)",
          "Tertarik mendalami Full-stack Development, Routing Protokol & AI-driven Systems",
          "Suka eksplorasi implementasi MikroTik RouterOS & arsitektur jaringan kampus",
        ];

  const characterList: string[] =
    characterNotes && Array.isArray(characterNotes) && characterNotes.length > 0
      ? characterNotes
      : [
          "Ganteng donkk & selalu energik",
          "Cepat beradaptasi dengan stack teknologi baru dan problem-solving orientasi",
          "Disiplin, teliti dalam konfigurasi jaringan & arsitektur kode",
          "Senang berkolaborasi dan berbagi ilmu dengan sesama rekan Moklet",
        ];

  const handleCopyFact = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="w-full my-12 sm:my-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#bfdbfe]/60 text-[#1e40af] border border-[#93c5fd]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
              DATABASE CMS • SYNCED
            </span>
            <span className="font-mono text-xs text-[#6b6863]">
              LIVE RECORDS
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold tracking-tight">
            Kompetensi &amp; Karakter Rekayasa
          </h2>
          <p className="font-sans text-sm text-[#6b6863] mt-1">
            Sorotan rekam jejak, kebiasaan kerja, dan profil kompetensi Debian.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <InteractiveSticker
            id="profile-boba"
            imageSrc="/images/sticker_boba_coffee.png"
            alt="Stiker Kopi & Boba"
            quote="Focus Mode ☕"
            subquote="Secangkir kopi & konsentrasi penuh"
            badge="MOOD"
            badgeColor="amber"
            size="xs"
            tooltipPosition="bottom"
            className="hidden sm:inline-block"
          />

          {/* Tab Filters */}
          <div className="inline-flex p-1 bg-[#f5f2ea] rounded-xl border border-[#ded8cb] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-white text-[#2563eb] shadow-xs"
                : "text-[#6b6863] hover:text-[#222222]"
            }`}
          >
            Semua ({factsList.length + characterList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facts")}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === "facts"
                ? "bg-white text-[#2563eb] shadow-xs"
                : "text-[#6b6863] hover:text-[#222222]"
            }`}
          >
            Fakta Menarik ({factsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("character")}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
              activeTab === "character"
                ? "bg-white text-[#2563eb] shadow-xs"
                : "text-[#6b6863] hover:text-[#222222]"
            }`}
          >
            Karakter ({characterList.length})
          </button>
        </div>
      </div>
    </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Fakta Menarik (CMS: random_facts) */}
        {(activeTab === "all" || activeTab === "facts") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              activeTab === "facts" ? "lg:col-span-12" : "lg:col-span-7"
            } flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ded8cb]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center font-bold">
                  💡
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#222222]">
                    Fakta Menarik
                  </h3>
                  <span className="font-mono text-[10px] text-[#6b6863] uppercase">
                    FIELD: random_facts ({factsList.length} entri)
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#2563eb] bg-[#dbeafe]/70 px-2.5 py-0.5 rounded-full font-bold">
                Prestasi & Hobi
              </span>
            </div>

            <div className="space-y-3.5">
              {factsList.map((fact, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01, x: 4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ded8cb] shadow-scrapbook hover:border-[#2563eb]/40 hover:shadow-scrapbook-lg transition-all relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#f5f2ea] text-[#2563eb] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#ded8cb]">
                        0{idx + 1}
                      </span>
                      <p className="font-sans text-sm sm:text-[15px] text-[#222222] font-medium leading-relaxed">
                        {fact}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyFact(fact, idx)}
                      title="Salin fakta"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#f5f2ea] text-[#6b6863] hover:text-[#2563eb] shrink-0"
                    >
                      {copiedIndex === idx ? (
                        <span className="text-xs font-mono font-bold text-emerald-600">✓ Tersalin</span>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Column 2: Catatan Karakter (CMS: character_notes) */}
        {(activeTab === "all" || activeTab === "character") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`${
              activeTab === "character" ? "lg:col-span-12" : "lg:col-span-5"
            } flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ded8cb]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#222222]">
                    Catatan Karakter
                  </h3>
                  <span className="font-mono text-[10px] text-[#6b6863] uppercase">
                    FIELD: character_notes ({characterList.length} entri)
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#b45309] bg-[#fef3c7] px-2.5 py-0.5 rounded-full font-bold">
                Personality
              </span>
            </div>

            <div className="space-y-3.5">
              {characterList.map((note, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-scrapbook hover:shadow-scrapbook-lg hover:border-amber-400/50 transition-all relative overflow-hidden group"
                >
                  {/* Subtle decorative quote sign */}
                  <div className="absolute right-3 bottom-1 text-5xl font-serif text-[#ded8cb]/40 select-none pointer-events-none group-hover:text-amber-200/50 transition-colors">
                    ”
                  </div>

                  <div className="flex items-start gap-3 relative z-10">
                    <span className="text-xl">🌟</span>
                    <div>
                      <p className="font-sans text-sm sm:text-[15px] font-semibold text-[#222222] leading-relaxed">
                        “{note}”
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-md">
                          Self-Reflect #{idx + 1}
                        </span>
                        <span className="font-mono text-[10px] text-[#6b6863]">
                          Verified Persona
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Character Signature Badge */}
              <div className="bg-[#f5f2ea] p-4 rounded-2xl border border-[#ded8cb] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-[#222222]">
                    Etos: Curious & Dedicated Builder
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#6b6863]">
                  MOKLET // A&apos;35
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

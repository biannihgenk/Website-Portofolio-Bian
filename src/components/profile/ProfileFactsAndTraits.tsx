"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

interface ProfileFactsAndTraitsProps {
  randomFacts?: string[] | null;
  characterNotes?: string[] | null;
}

export function ProfileFactsAndTraits({
  randomFacts,
  characterNotes,
}: ProfileFactsAndTraitsProps) {
  const locale = useLocale();
  const isId = locale === "id";
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<"all" | "facts" | "character">("all");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (copiedIndex === null) return;
    const timer = setTimeout(() => setCopiedIndex(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedIndex]);

  // Fallbacks if database fields are empty or null
  const factsList: string[] =
    randomFacts && Array.isArray(randomFacts) && randomFacts.length > 0
      ? randomFacts
      : isId
        ? [
            "Juara 1 Olimpiade Kecerdasan Artifisial (OKTAL) 2026 Kota Malang",
            "Siswa aktif di SMK Telkom Malang kelas X TKJ (Moklet A'35)",
            "Tertarik mendalami Full-stack Development, Routing Protokol & AI-driven Systems",
            "Fokus eksplorasi implementasi MikroTik RouterOS & arsitektur jaringan kampus",
          ]
        : [
            "1st Place — AI Olympiad (OKTAL) 2026 Malang City",
            "Active Grade X TKJ vocational student at SMK Telkom Malang (Moklet A'35)",
            "Deep focus on Full-Stack Web Engineering, Routing Protocols & AI Workflows",
            "Hands-on exploration of MikroTik RouterOS & structured campus networking",
          ];

  const characterList: string[] =
    characterNotes && Array.isArray(characterNotes) && characterNotes.length > 0
      ? characterNotes
      : isId
        ? [
            "Analitis, terstruktur, dan berorientasi pada keandalan sistem",
            "Cepat beradaptasi dengan stack teknologi baru dan pemecahan masalah nyata",
            "Disiplin dan teliti dalam konfigurasi jaringan maupun arsitektur kode",
            "Terbuka dalam kolaborasi tim serta dokumentasi pengetahuan teknis",
          ]
        : [
            "Analytical, structured, and focused on system reliability",
            "Adapts rapidly to new technical stacks and practical problem-solving",
            "Disciplined and detail-oriented across network config and codebases",
            "Open to peer collaboration and clear technical documentation",
          ];

  const handleCopyFact = (text: string, index: number) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedIndex(index);
  };

  return (
    <section id="profile-facts" className="w-full my-12 sm:my-16 scroll-mt-28">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#dbeafe]/70 text-[#1e40af] border border-[#bfdbfe]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
              DATABASE CMS • SYNCED
            </span>
            <span className="font-mono text-xs text-[#6b6863]">
              LIVE RECORDS
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#111827] font-bold tracking-tight">
            {isId ? "Kompetensi & Karakter Rekayasa" : "Competencies & Engineering Persona"}
          </h2>
          <p className="font-sans text-sm text-[#6b6863] mt-1">
            {isId
              ? "Sorotan rekam jejak, kebiasaan kerja, dan profil kompetensi Debian."
              : "Highlights of verified milestones, work discipline, and personal traits."}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="inline-flex flex-wrap gap-1 p-1 bg-[#f5f2ea] rounded-xl border border-[#ded8cb] shadow-2xs self-start sm:self-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#2563eb] shadow-2xs"
                : "text-[#6b6863] hover:text-[#111827]"
            }`}
          >
            {isId ? "Semua" : "All"} ({factsList.length + characterList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facts")}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "facts"
                ? "bg-white text-[#2563eb] shadow-2xs"
                : "text-[#6b6863] hover:text-[#111827]"
            }`}
          >
            {isId ? "Sorotan Teknis" : "Highlights"} ({factsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("character")}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "character"
                ? "bg-white text-[#2563eb] shadow-2xs"
                : "text-[#6b6863] hover:text-[#111827]"
            }`}
          >
            {isId ? "Karakter" : "Character"} ({characterList.length})
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Sorotan & Fakta (CMS: random_facts) */}
        {(activeTab === "all" || activeTab === "facts") && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.35 }}
            className={`${
              activeTab === "facts" ? "lg:col-span-12" : "lg:col-span-7"
            } flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ded8cb]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#f5f3ee] border border-[#ded8cb] text-[#2563eb] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#111827]">
                    {isId ? "Sorotan & Fakta Akademik" : "Academic & Technical Highlights"}
                  </h3>
                  <span className="font-mono text-[10px] text-[#6b6863] uppercase">
                    FIELD: random_facts ({factsList.length} {isId ? "entri" : "entries"})
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#2563eb] bg-[#dbeafe]/70 px-2.5 py-0.5 rounded-full font-bold border border-[#bfdbfe]">
                {isId ? "Rekam Jejak" : "Track Record"}
              </span>
            </div>

            <div className="space-y-3.5">
              {factsList.map((fact, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 p-4 sm:p-5 rounded-2xl border border-[#ded8cb] shadow-xs hover:border-[#2563eb]/40 transition-all relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#fbf9f3] text-[#2563eb] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#ded8cb]">
                        0{idx + 1}
                      </span>
                      <p className="font-sans text-sm sm:text-[15px] text-[#111827] font-medium leading-relaxed">
                        {fact}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyFact(fact, idx)}
                      title={isId ? "Salin entri" : "Copy entry"}
                      className="sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#f5f2ea] text-[#6b6863] hover:text-[#2563eb] shrink-0 cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          ✓ {isId ? "Tersalin" : "Copied"}
                        </span>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Column 2: Catatan Karakter (CMS: character_notes) */}
        {(activeTab === "all" || activeTab === "character") && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className={`${
              activeTab === "character" ? "lg:col-span-12" : "lg:col-span-5"
            } flex flex-col gap-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#ded8cb]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#f5f3ee] border border-[#ded8cb] text-[#111827] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#111827]">
                    {isId ? "Catatan Karakter" : "Character Notes"}
                  </h3>
                  <span className="font-mono text-[10px] text-[#6b6863] uppercase">
                    FIELD: character_notes ({characterList.length} {isId ? "entri" : "entries"})
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#111827] bg-[#f5f3ee] border border-[#ded8cb] px-2.5 py-0.5 rounded-full font-bold">
                Work Ethos
              </span>
            </div>

            <div className="space-y-3.5">
              {characterList.map((note, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 p-5 rounded-2xl border border-[#ded8cb] shadow-xs hover:border-[#2563eb]/40 transition-all relative overflow-hidden group"
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-6 h-6 rounded-md bg-[#fbf9f3] border border-[#ded8cb] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5 font-mono text-[11px] font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-sans text-sm sm:text-[15px] font-semibold text-[#111827] leading-relaxed">
                        &ldquo;{note.replace(/^[“”"']+|[“”"']+$/g, "")}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#1e40af] bg-[#dbeafe]/70 px-2 py-0.5 rounded-md border border-[#bfdbfe]">
                          {isId ? `Prinsip #${idx + 1}` : `Principle #${idx + 1}`}
                        </span>
                        <span className="font-mono text-[10px] text-[#6b6863]">
                          Verified Persona
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Character Signature Badge */}
              <div className="bg-[#fbf9f3] p-4 rounded-2xl border border-[#ded8cb] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-mono text-xs font-bold text-[#111827]">
                    {isId ? "Etos: Curious & Dedicated Builder" : "Ethos: Curious & Dedicated Builder"}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#6b6863] shrink-0">
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

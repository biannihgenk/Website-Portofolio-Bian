"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Achievement } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import {
  CertificateLightboxModal,
  type AchievementModalData,
} from "./CertificateLightboxModal";

interface AchievementsDirectoryProps {
  achievements: Achievement[];
  locale: string;
}

interface AchievementItemDisplay {
  id: string;
  slug: string;
  title: string;
  organization: string;
  category: "kompetisi" | "sertifikasi" | "organisasi";
  categoryLabel: string;
  date: string;
  year: number;
  description: string;
  credentialUrl?: string | null;
  imagePath?: string | null;
  credentialId?: string | null;
  podiumRank?: string | null;
  headerTag?: string;
  goldenTicket?: boolean;
  tags: string[];
}

export function AchievementsDirectory({
  achievements,
  locale,
}: AchievementsDirectoryProps) {
  const t = useTranslations("achievementsPage");
  const isId = locale === "id";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [lightboxData, setLightboxData] = useState<AchievementModalData | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Parse Supabase real achievements into display format
  const supabaseItems: AchievementItemDisplay[] = useMemo(() => {
    return achievements.map((ach, idx) => {
      const title = isId ? (ach.title_id || ach.title_en) : (ach.title_en || ach.title_id);
      const desc = isId ? (ach.description_id || ach.description_en) : (ach.description_en || ach.description_id);
      const catLower = (ach.category || "").toLowerCase();
      let normalizedCategory: "kompetisi" | "sertifikasi" | "organisasi" = "kompetisi";
      if (catLower.includes("sertif") || catLower.includes("cert")) normalizedCategory = "sertifikasi";
      else if (catLower.includes("organisasi") || catLower.includes("leader")) normalizedCategory = "organisasi";

      const publicImageUrl = ach.image_path ? getStoragePublicUrl(ach.image_path) : null;
      const year = ach.achievement_date ? new Date(ach.achievement_date).getFullYear() : 2026;

      let credentialId: string | null = null;
      let podiumRank: string | null = null;
      let headerTag: string | undefined = ach.organization || undefined;
      const slugLower = ach.slug.toLowerCase();

      if (slugLower.includes("oktal")) {
        headerTag = "OKTAL • TAPRESNESIA 2026";
        podiumRank = isId ? "JUARA 1 KOTA MALANG" : "1ST PLACE CITY LEVEL";
        credentialId = "129/OKTAL.TAPRESNESIA/IX/2026";
      } else if (slugLower.includes("dicoding")) {
        headerTag = "DICODING INDONESIA";
        podiumRank = isId ? "SERTIFIKASI KOMPETENSI" : "COMPETENCE VERIFIED";
        credentialId = "JLX1K79EJP72";
      } else if (slugLower.includes("digion")) {
        headerTag = "BINUS UNIVERSITY @ MALANG";
        podiumRank = isId ? "PESERTA TERVERIFIKASI" : "COMPETITOR CERTIFIED";
        credentialId = "DIGION-DATA-2026";
      } else {
        podiumRank = ach.category?.toUpperCase() || (isId ? "PRESTASI RESMI" : "VERIFIED");
      }

      // Generate relevant tag chips
      const tags: string[] = [];
      if (normalizedCategory === "kompetisi") tags.push("#Kompetisi");
      if (normalizedCategory === "sertifikasi") tags.push("#Sertifikasi");
      if (slugLower.includes("ai")) tags.push("#ArtificialIntelligence");
      if (slugLower.includes("data")) tags.push("#DataAnalytics");
      if (ach.organization) tags.push(`#${ach.organization.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "")}`);

      return {
        id: ach.id,
        slug: ach.slug,
        title,
        organization: ach.organization || (isId ? "Pusat Prestasi / Vokasi" : "Vocational Organization"),
        category: normalizedCategory,
        categoryLabel: ach.category || (isId ? "Kompetisi" : "Competition"),
        date: ach.achievement_date || "2026",
        year,
        description: desc || "",
        credentialUrl: ach.credential_url,
        imagePath: publicImageUrl,
        credentialId,
        podiumRank,
        headerTag,
        goldenTicket: slugLower.includes("oktal"),
        tags,
      };
    });
  }, [achievements, isId]);

  // Filtering & Search
  const filteredMilestones = useMemo(() => {
    const result = supabaseItems.filter((item) => {
      const matchesCategory =
        activeFilter === "all" || item.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortOrder === "newest") return b.year - a.year;
      return a.year - b.year;
    });

    return result;
  }, [supabaseItems, activeFilter, searchQuery, sortOrder]);

  const filterTabs = [
    { key: "all", label: `${t("filterAll")} (${supabaseItems.length})` },
    { key: "kompetisi", label: t("filterCompetitions") },
    { key: "sertifikasi", label: t("filterCertifications") },
    { key: "organisasi", label: t("filterLeadership") },
  ];

  function openLightbox(item: AchievementItemDisplay) {
    setLightboxData({
      id: item.id,
      title: item.title,
      organization: item.organization,
      category: item.categoryLabel,
      date: item.date,
      description: item.description,
      credentialUrl: item.credentialUrl,
      imagePath: item.imagePath,
      credentialId: item.credentialId,
      podiumRank: item.podiumRank,
      tags: item.tags,
    });
    setLightboxOpen(true);
  }

  return (
    <section className="w-full my-8 sm:my-12" id="achievements-directory">
      {/* Search & Filter Header Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-[#ded8cb] shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <svg
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#686660]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 bg-[#f5f2ea] border border-[#ded8cb] rounded-xl font-mono text-xs text-[#222222] placeholder:text-[#686660] focus:outline-none focus:border-[#222222] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#686660] hover:text-[#222222]"
            >
              clear
            </button>
          )}
        </div>

        {/* Sort & Quick Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#686660] bg-[#f5f3ee] px-3 py-1.5 rounded-xl border border-[#ded8cb]">
            <span>{t("sortLabel")}</span>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="font-bold text-[#222222] hover:text-[#2563eb] underline ml-1"
            >
              {sortOrder === "newest" ? t("sortNewest") : t("sortOldest")}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-semibold whitespace-nowrap transition-all shadow-xs flex items-center gap-2 ${
                isActive
                  ? "bg-[#222222] text-white"
                  : "bg-white text-[#444748] hover:bg-[#eae8e2] border border-[#ded8cb]"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Empty States */}
      {supabaseItems.length === 0 ? (
        <div className="w-full py-16 px-6 bg-white rounded-3xl border border-[#ded8cb] text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#f5f3ee] flex items-center justify-center text-[#2563eb]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#222222]">
            {isId ? "Belum Ada Pencapaian yang Dipublikasikan" : "No Published Achievements Yet"}
          </h3>
          <p className="font-sans text-sm text-[#686660] max-w-md">
            {isId
              ? "Pencapaian dan sertifikasi sedang disinkronkan dari database Supabase CMS."
              : "Achievements and credentials are currently being synced from the Supabase CMS."}
          </p>
        </div>
      ) : filteredMilestones.length === 0 ? (
        <div className="w-full py-12 px-6 bg-white rounded-3xl border border-[#ded8cb] text-center flex flex-col items-center justify-center gap-3">
          <p className="font-sans text-sm text-[#686660]">
            {isId
              ? `Tidak ada data pencapaian yang cocok dengan pencarian "${searchQuery}".`
              : `No achievements match the search query "${searchQuery}".`}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("all");
              setSearchQuery("");
            }}
            className="px-4 py-1.5 rounded-full bg-[#222222] text-white font-mono text-xs hover:bg-[#2563eb] transition-colors"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        /* Achievement Cards Grid (3 Columns) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMilestones.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => openLightbox(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(item);
                }
              }}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-[#ded8cb] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
            >
              <div>
                {/* Header Tag / Podiums */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] text-[#686660] uppercase tracking-wider font-bold">
                    {item.headerTag || item.categoryLabel}
                  </span>
                  <span className="font-mono text-xs text-[#2563eb] font-semibold">
                    {item.date}
                  </span>
                </div>

                {/* Badge Podiums / Rank */}
                {item.podiumRank && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#bfdbfe]/80 text-[#1e3a8a] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#2563eb]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                    <span>{item.podiumRank}</span>
                  </div>
                )}

                {/* Tactile Certificate Preview Banner */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#f5f2ea] border border-[#ded8cb] p-3 flex flex-col justify-between mb-4 group-hover:scale-[1.01] transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f3b9a7]/15 via-transparent to-[#bfdbfe]/15 pointer-events-none" />
                  {item.imagePath ? (
                    <>
                      <Image
                        src={item.imagePath}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center blueprint-dots opacity-40 pointer-events-none" />
                  )}

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs font-mono text-[9px] uppercase font-bold text-[#2563eb] shadow-xs border border-[#ded8cb]">
                      {item.categoryLabel}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-amber-600 shadow-2xs border border-amber-200">
                      ★
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-white/95 drop-shadow-xs pt-1 border-t border-white/20">
                    <span className="truncate max-w-[150px]">{item.organization}</span>
                    <span className="text-white font-bold">Inspect ↗</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg sm:text-xl text-[#222222] font-bold tracking-tight group-hover:text-[#2563eb] transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>

                {/* Organization Label */}
                <p className="font-mono text-xs text-[#686660] font-medium mb-3">
                  {item.organization}
                </p>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-[#444748] leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Tag Chips */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#ded8cb]/60 mb-3">
                  {item.tags.map((tg) => (
                    <span
                      key={tg}
                      className="font-mono text-[10px] text-[#686660] bg-[#f5f3ee] px-2 py-0.5 rounded-md border border-[#ded8cb]"
                    >
                      {tg}
                    </span>
                  ))}
                </div>

                {/* Inspect Action Footer */}
                <div className="flex items-center justify-between font-mono text-xs text-[#2563eb] font-semibold pt-1">
                  <span className="flex items-center gap-1 group-hover:underline">
                    <span>{t("viewProof")}</span>
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                  {item.credentialId && (
                    <span className="text-[10px] text-[#686660] font-normal font-mono truncate max-w-[120px]">
                      #{item.credentialId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Lightbox Modal */}
      <CertificateLightboxModal
        isOpen={lightboxOpen}
        data={lightboxData}
        onClose={() => setLightboxOpen(false)}
        locale={locale}
      />
    </section>
  );
}

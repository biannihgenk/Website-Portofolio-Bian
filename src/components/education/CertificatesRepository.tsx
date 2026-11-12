"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Achievement, Education } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import {
  EducationDetailModal,
  type EducationModalItem,
} from "./EducationDetailModal";

interface CertificateCardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  categoryBadge: string;
  categoryBg: string;
  categoryText: string;
  pillTag: string;
  description: string;
  reflection?: string;
  credentialId: string;
  credentialUrl?: string | null;
  imagePath?: string | null;
  tags: string[];
}

interface CertificatesRepositoryProps {
  achievements?: Achievement[];
  educationList?: Education[];
  locale?: string;
}

export function CertificatesRepository({
  achievements = [],
  educationList = [],
  locale = "id",
}: CertificatesRepositoryProps) {
  const t = useTranslations("educationPage");
  const isId = locale === "id";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalItem, setModalItem] = useState<EducationModalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Map real database records into CertificateCardItem
  const certificates: CertificateCardItem[] = useMemo(() => {
    const items: CertificateCardItem[] = [];

    // 1. Achievements that are certifications or courses
    achievements.forEach((a) => {
      const title = isId ? a.title_id : a.title_en;
      const desc = (isId ? a.description_id : a.description_en) || "";
      const publicImg = a.image_path ? getStoragePublicUrl(a.image_path) : null;
      const cat = a.category || "Sertifikasi";

      // Extract credential ID if present in description or URL
      let credId = "VERIFIED-CMS";
      const idMatch = desc.match(/\b(?:ID:?|No\.?\s*Sertifikat:?)\s*([A-Za-z0-9_\-\/]+)/i);
      if (idMatch && idMatch[1]) {
        credId = idMatch[1];
      } else if (a.credential_url) {
        const parts = a.credential_url.split("/");
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length >= 4) {
          credId = lastPart;
        }
      }

      // Determine palette by category
      let categoryBg = "bg-[#dbeafe]/90";
      let categoryText = "text-[#1e40af]";
      if (cat.toLowerCase().includes("kompetisi") || cat.toLowerCase().includes("compet")) {
        categoryBg = "bg-[#f3b9a7]/90";
        categoryText = "text-[#3f1407]";
      } else if (cat.toLowerCase().includes("cyber") || cat.toLowerCase().includes("secur")) {
        categoryBg = "bg-[#bfdbfe]/90";
        categoryText = "text-[#1e40af]";
      }

      items.push({
        id: a.id,
        title,
        issuer: a.organization || "Penyelenggara Resmi",
        date: a.achievement_date
          ? new Date(a.achievement_date).toLocaleDateString(
              isId ? "id-ID" : "en-US",
              { month: "short", year: "numeric" }
            )
          : "2026",
        category: cat,
        categoryBadge: cat,
        categoryBg,
        categoryText,
        pillTag: a.credential_url ? "Verified URL" : "Verified Doc",
        description: desc,
        reflection:
          "Setiap sertifikat diuji pemahamannya langsung di terminal dan lab praktik, bukan sekadar tanda kelulusan administratif.",
        credentialId: credId,
        credentialUrl: a.credential_url,
        imagePath: publicImg,
        tags: [cat, a.organization || "CMS", "Terverifikasi"],
      });
    });

    // 2. Education records with entry_type === 'certificate' or 'training'
    educationList
      .filter((e) => e.entry_type === "certificate" || e.entry_type === "training")
      .forEach((e) => {
        const title = e.program || e.institution;
        const desc = (isId ? e.description_id : e.description_en) || "";
        const publicImg = e.image_path ? getStoragePublicUrl(e.image_path) : null;
        const cat = e.entry_type === "certificate" ? "Sertifikasi" : "Pelatihan";

        items.push({
          id: e.id,
          title,
          issuer: e.institution,
          date: e.start_date
            ? new Date(e.start_date).toLocaleDateString(
                isId ? "id-ID" : "en-US",
                { month: "short", year: "numeric" }
              )
            : "2026",
          category: cat,
          categoryBadge: cat,
          categoryBg: "bg-[#dbeafe]/90",
          categoryText: "text-[#222222]",
          pillTag: "Training Lab",
          description: desc,
          reflection: "Praktik langsung di lab kejuruan dengan uji kompetensi mandiri.",
          credentialId: "EDU-" + e.id.slice(0, 8).toUpperCase(),
          credentialUrl: e.credential_url,
          imagePath: publicImg,
          tags: [cat, e.institution, "Lab Drill"],
        });
      });

    return items;
  }, [achievements, educationList, isId]);

  // Derive categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [certificates]);

  const filteredCerts = useMemo(() => {
    return certificates.filter((cert) => {
      const matchCat = activeFilter === "all" || cert.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        cert.title.toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q) ||
        cert.description.toLowerCase().includes(q) ||
        cert.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [certificates, activeFilter, searchQuery]);

  function handleOpenCard(cert: CertificateCardItem) {
    setModalItem({
      id: cert.id,
      title: cert.title,
      subtitle: cert.issuer,
      category: cert.categoryBadge,
      date: cert.date,
      description: cert.description,
      reflection: cert.reflection,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
      imagePath: cert.imagePath,
      tags: cert.tags,
      statusBadge: cert.pillTag,
      statusColor: cert.categoryBg,
    });
    setModalOpen(true);
  }

  return (
    <section className="flex flex-col gap-8 w-full scroll-mt-28" id="certificates-training">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase text-[#2563eb] font-bold tracking-widest">
            {t("certTag")}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] font-bold mt-1">
            {t("certTitle")}
          </h2>
        </div>
        <p className="font-sans text-sm sm:text-base text-[#686660] max-w-md leading-relaxed">
          {t("certLead")}
        </p>
      </div>

      {/* Interactive Controls: Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all shadow-xs cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#222222] text-white"
                : "bg-white text-[#444748] hover:bg-[#f0eee8] border border-[#ded8cb]"
            }`}
          >
            {t("filterAll")} ({certificates.length})
          </button>
          {categories.map((cat) => {
            const count = certificates.filter((c) => c.category === cat).length;
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isActive
                    ? "bg-[#222222] text-white"
                    : "bg-white text-[#444748] hover:bg-[#f0eee8] border border-[#ded8cb]"
                }`}
              >
                {cat} ({count < 10 ? `0${count}` : count})
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative sm:w-64">
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
            placeholder={isId ? "Cari sertifikat CMS..." : "Search certificates..."}
            className="w-full bg-white pl-10 pr-4 py-2 rounded-full font-sans text-xs text-[#222222] placeholder:text-[#686660] shadow-xs border border-[#ded8cb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
        </div>
      </div>

      {/* Certificates Cards Grid */}
      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              role="button"
              tabIndex={0}
              onClick={() => handleOpenCard(cert)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenCard(cert);
                }
              }}
              className="cert-card bg-white rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-scrapbook hover:-translate-y-1 overflow-hidden border border-[#ded8cb] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
            >
              <div className="flex flex-col gap-3.5">
                {/* Certificate Preview Box */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#f5f2ea] border border-[#ded8cb] p-4 flex flex-col justify-between group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f3b9a7]/15 via-transparent to-[#bfdbfe]/15 pointer-events-none" />

                  {cert.imagePath && (
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <Image
                        src={cert.imagePath}
                        alt={cert.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full ${cert.categoryBg} backdrop-blur-xs ${cert.categoryText} font-mono text-[10px] uppercase font-bold shadow-xs`}
                    >
                      {cert.categoryBadge}
                    </span>
                    <div className="px-2 py-0.5 rounded bg-[#222222]/85 backdrop-blur-xs text-white font-mono text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bfdbfe]" />
                      <span>{cert.pillTag}</span>
                    </div>
                  </div>

                  <div className="my-auto text-center px-2 relative z-10">
                    <div className="font-serif text-lg sm:text-xl text-[#222222] font-bold leading-snug group-hover:text-[#2563eb] transition-colors line-clamp-2">
                      {cert.title}
                    </div>
                    <div className="font-mono text-[11px] text-[#686660] mt-1 font-medium">
                      {cert.issuer}
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[#686660] pt-2 border-t border-[#ded8cb]/80">
                    <span>{cert.date}</span>
                    <span className="text-[#2563eb] font-bold">Inspect Details →</span>
                  </div>
                </div>

                {/* Meta & Brief Info */}
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#2563eb] font-bold line-clamp-1">
                      {cert.issuer}
                    </span>
                    <span className="font-mono text-[11px] text-[#686660] shrink-0">
                      {cert.date}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#222222] leading-snug font-bold group-hover:text-[#2563eb] transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#444748] leading-relaxed line-clamp-2">
                    {cert.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f0eee8] flex items-center justify-between px-1">
                <span className="font-mono text-[11px] text-[#686660] font-medium truncate max-w-[150px]">
                  ID: {cert.credentialId}
                </span>
                <span className="font-mono text-xs text-[#2563eb] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isId ? "Buka Catatan" : "View Record"}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-[#ded8cb] text-center space-y-2">
          <p className="font-serif text-lg text-[#222222] font-semibold">
            {isId ? "Tidak ada sertifikat yang cocok." : "No certificates match this filter."}
          </p>
          <p className="font-sans text-xs text-[#686660]">
            {isId
              ? "Coba ubah kata kunci pencarian atau pilih kategori lain."
              : "Try altering your search keywords or switching filter categories."}
          </p>
        </div>
      )}

      {/* Humorous Encouragement Note */}
      <div className="bg-[#f5f2ea]/80 p-5 rounded-2xl flex items-center gap-4 text-[#686660] border border-[#ded8cb]">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2563eb] shadow-xs flex-shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
          </svg>
        </div>
        <p className="font-sans text-xs sm:text-sm leading-relaxed">
          <strong className="text-[#222222] font-bold">Rak sertifikat terus bertumbuh.</strong> {t("certEmptyNote")}
        </p>
      </div>

      {/* Detail Modal */}
      <EducationDetailModal
        isOpen={modalOpen}
        item={modalItem}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

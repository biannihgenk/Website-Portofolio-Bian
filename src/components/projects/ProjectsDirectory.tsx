"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { ProjectDetailModal, type ProjectDetailData } from "./ProjectDetailModal";

interface ProjectsDirectoryProps {
  projects: Project[];
  locale: string;
}

interface BlueprintItem {
  key: string;
  category: string;
  blueprintNo: string;
  icon: string;
  title: string;
  subtitle: string;
  coverUrl?: string | null;
  badgeText: string;
  badgeBg: string;
  badgeDot: string;
  metaPeriod: string;
  statPill: string;
  summary: string;
  problem: string;
  role: string;
  lessons: string;
  tech: string[];
  footerAction: string;
  footerStamp: string;
  projectUrl?: string | null;
  repoUrl?: string | null;
}

// Fallback high-fidelity covers matching design specifications
const FALLBACK_PROJECT_COVERS: Record<string, string> = {
  vocaz:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuADXSLRE0gTZCzz_ZYNMUFw-gf6aXBpRBbcJMXKa9wui15w4dwV5qYVdlN0tc1iPKHeSbGXE7D1Z_eTLr0xZGqESXIKu43fB95jqqAgrnyUWqKuzzw_abOOUaavdI5njPVdiFZsqSbD9i3L4b9KVB_nCmBfBBFnGjR8bAXCcJE7FJcGR8wV3zl65vfuxN4WK2wDAzp6m7HVRQJcdvmmXfE3aEukbIiQ-pc8bHMyhYC-wK5O3lHswEYD",
  meditrack:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoVoWeWkDOw_h6eO2eMbH3ShGS0AN-wIDUmZ3zWivMHuGr6Q1fOtqO_en_i6fbr5FMGFIhfKQeLEg2otyUVDN19A8Ai2vJAoOSdfbmK2iehguNbtIdRHK17ZEqsA8IdE3dO1Yq7qLKY0xxmfMnRDHPd0-kCDfxXbA_3oo7yDgzeLFuNYz8BD5cv4U7zDMNruUWO2OuS7kHXqQBZWJoxggDAlGb_CnN2N3BKhHcAGvXzxzoPjRkm8w",
  topology:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBUjW_YctERHVZ2Y-trL13N57jKo3hP9Vt06D9x356_gdADlkq1bjccR-qj4eUuhgmuLM5qJMpvJdssvS84fVJpVW9CgOQzL-mG7_uqLUkirwWxg-3PFPHkKpCDqzXQtYuEyC9K1secJsNjODhS7hGzvdsQ97pmIlF3eOZFZ8mh0Bpnp4tz9BvxZ2rHN_ZmCjeaaIdaGNn4iW8Fk2CLBhhAqUXzekvuw_QH4KpjgSu-AXdI9CkGlQUX",
};

// Helper to determine status styling and label
function getStatusBadge(status?: string | null, isFeatured?: boolean, isId?: boolean) {
  if (isFeatured) {
    return {
      text: isId ? "Flagship • In Dev" : "Flagship • In Dev",
      bg: "bg-[#dbeafe]",
      dot: "bg-[#2563eb]",
    };
  }
  switch (status) {
    case "completed":
      return {
        text: isId ? "Selesai & Berjalan" : "Completed",
        bg: "bg-[#bfdbfe]",
        dot: "bg-[#1e40af]",
      };
    case "in_development":
      return {
        text: isId ? "Sedang Dikembangkan" : "In Development",
        bg: "bg-[#dbeafe]",
        dot: "bg-[#2563eb]",
      };
    case "prototype":
      return {
        text: isId ? "Prototipe Aktif" : "Active Prototype",
        bg: "bg-[#dbeafe]",
        dot: "bg-[#222222]",
      };
    case "concept":
      return {
        text: isId ? "Ide & Konsep" : "Concept & Ideation",
        bg: "bg-[#f3b9a7]",
        dot: "bg-[#3f1407]",
      };
    default:
      return {
        text: isId ? "Rilis Terverifikasi" : "Verified Release",
        bg: "bg-[#f0eee8]",
        dot: "bg-[#2563eb]",
      };
  }
}

// Helper to determine icon
function getIconForProject(p: Project) {
  const combined = `${p.category || ""} ${p.slug || ""}`.toLowerCase();
  if (combined.includes("network") || combined.includes("topolog") || combined.includes("star")) return "lan";
  if (combined.includes("health") || combined.includes("meditrack") || combined.includes("kontrol")) return "vital_signs";
  if (combined.includes("career") || combined.includes("vocaz") || combined.includes("school")) return "school";
  if (combined.includes("iot") || combined.includes("hardware") || combined.includes("sensor")) return "sensors";
  if (combined.includes("ai") || combined.includes("ml")) return "psychology";
  return "terminal";
}

export function ProjectsDirectory({
  projects,
  locale,
}: ProjectsDirectoryProps) {
  const t = useTranslations("projectsPage");
  const isId = locale === "id";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedDetail, setSelectedDetail] = useState<ProjectDetailData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Convert real Supabase projects into Blueprint Items
  const blueprintItems: BlueprintItem[] = useMemo(() => {
    return projects.map((p, idx) => {
      const title = isId ? (p.title_id || p.title_en) : (p.title_en || p.title_id);
      const summary = isId ? (p.summary_id || p.summary_en) : (p.summary_en || p.summary_id);
      const description = isId ? (p.description_id || p.summary_id) : (p.description_en || p.summary_en);
      const statusBadge = getStatusBadge(p.project_status, p.is_featured, isId);
      const techList: string[] = Array.isArray(p.technologies) ? (p.technologies as string[]) : [];

      let period = "2026";
      if (p.is_featured) {
        period = "2024–2026 • Flagship";
      } else if (p.published_at) {
        period = new Date(p.published_at).getFullYear().toString();
      }

      const statPill = p.is_featured
        ? (isId ? "⭐ Proyek Unggulan" : "⭐ Featured Flagship")
        : (p.category || (isId ? "Proyek Terverifikasi" : "Verified Project"));

      let coverUrl: string | null = null;
      if (p.cover_image_path) {
        coverUrl = getStoragePublicUrl(p.cover_image_path);
      } else {
        const slugLower = (p.slug || "").toLowerCase();
        if (slugLower.includes("vocaz")) {
          coverUrl = FALLBACK_PROJECT_COVERS.vocaz;
        } else if (slugLower.includes("kontrol") || slugLower.includes("meditrack") || slugLower.includes("sehat")) {
          coverUrl = FALLBACK_PROJECT_COVERS.meditrack;
        } else if (slugLower.includes("topolog") || slugLower.includes("star") || slugLower.includes("network")) {
          coverUrl = FALLBACK_PROJECT_COVERS.topology;
        }
      }

      return {
        key: p.slug || p.id,
        category: (p.category || "web").toLowerCase().trim(),
        blueprintNo: `PROJECT BLUEPRINT #${String(idx + 1).padStart(2, "0")}`,
        icon: getIconForProject(p),
        title,
        subtitle: techList.length > 0 ? techList.slice(0, 3).join(" • ") : (p.category || "Fullstack Lab"),
        coverUrl,
        badgeText: statusBadge.text,
        badgeBg: statusBadge.bg,
        badgeDot: statusBadge.dot,
        metaPeriod: period,
        statPill,
        summary: summary || "",
        problem: summary || "",
        role: isId ? "Arsitektur Sistem, Koding & Pengujian" : "System Architecture, Coding & Testing",
        lessons: description || summary || "",
        tech: techList,
        footerAction: t("inspectDetails"),
        footerStamp: p.project_status ? p.project_status.toUpperCase() : t("clickToView"),
        projectUrl: p.project_url,
        repoUrl: p.repository_url,
      };
    });
  }, [projects, isId, t]);

  // Derive unique categories from actual database projects
  const categories = useMemo(() => {
    const catMap = new Map<string, number>();
    blueprintItems.forEach((item) => {
      const cat = item.category || "other";
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });

    const categoryList = [
      { key: "all", label: `${t("filterAll")} (${blueprintItems.length})` },
    ];

    catMap.forEach((count, key) => {
      // Map category key to a friendly capitalized label
      let label = key.toUpperCase();
      if (key === "web") label = isId ? `Web (${count})` : `Web (${count})`;
      else if (key === "backend") label = isId ? `Backend / Network (${count})` : `Backend / Network (${count})`;
      else if (key === "ai") label = `AI (${count})`;
      else if (key === "iot") label = `IoT (${count})`;
      else if (key === "concept") label = `Concept (${count})`;
      else label = `${key.charAt(0).toUpperCase() + key.slice(1)} (${count})`;

      categoryList.push({ key, label });
    });

    return categoryList;
  }, [blueprintItems, isId, t]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return blueprintItems;
    return blueprintItems.filter((card) => card.category === activeFilter);
  }, [blueprintItems, activeFilter]);

  function handleOpenModal(item: BlueprintItem) {
    setSelectedDetail({
      key: item.key,
      title: item.title,
      status: item.badgeText,
      statusColor: item.badgeBg,
      period: item.metaPeriod,
      summary: item.summary,
      problem: item.problem,
      role: item.role,
      tech: item.tech,
      lessons: item.lessons,
      projectUrl: item.projectUrl,
      repoUrl: item.repoUrl,
      coverUrl: item.coverUrl,
    });
    setModalOpen(true);
  }

  return (
    <section className="w-full mb-12 sm:mb-16 pt-4 scroll-mt-28" id="project-directory">
      {/* Directory Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#222222] font-bold">
              {t("dirTitle")}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider">
              {t("dirCount", { count: filteredCards.length })}
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#686660] mt-1.5 flex items-center gap-1.5 flex-wrap">
            <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            <span className="italic font-serif text-sm text-[#444748]">
              {t("dirSubtitle")}
            </span>
          </p>
        </div>

        {/* Margin Hint Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#f0eee8] rounded-full text-xs font-mono text-[#686660] border border-[#ded8cb]">
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span>{t("dirHint")}</span>
        </div>
      </div>

      {/* Filter Pills Toggle */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 pb-6">
          {categories.map((btn) => {
            const isActive = activeFilter === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => setActiveFilter(btn.key)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-mono font-medium transition-all shadow-xs cursor-pointer ${
                  isActive
                    ? "bg-[#222222] text-white shadow-xs"
                    : "bg-white text-[#444748] hover:bg-[#eae8e2] border border-[#ded8cb]"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State when no projects match */}
      {blueprintItems.length === 0 ? (
        <div className="w-full py-16 px-6 bg-white rounded-3xl border border-[#ded8cb] text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#f5f3ee] flex items-center justify-center text-[#2563eb]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#222222]">
            {isId ? "Belum Ada Proyek yang Dipublikasikan" : "No Published Projects Yet"}
          </h3>
          <p className="font-sans text-sm text-[#686660] max-w-md leading-relaxed">
            {isId
              ? "Proyek sedang dalam proses pengerjaan di lab atau sinkronisasi dari database CMS."
              : "Projects are currently being assembled in the lab or synced from the CMS database."}
          </p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="w-full py-12 px-6 bg-white rounded-3xl border border-[#ded8cb] text-center flex flex-col items-center justify-center gap-3">
          <p className="font-sans text-sm text-[#686660]">
            {isId ? "Tidak ada proyek yang cocok dengan filter ini." : "No projects match this category."}
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="px-4 py-1.5 rounded-full bg-[#222222] text-white font-mono text-xs hover:bg-[#2563eb] transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        /* PROJECT CARDS GRID (12-Col Responsive Bento & Scrapbook Stack) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.key}
              role="button"
              tabIndex={0}
              onClick={() => handleOpenModal(card)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenModal(card);
                }
              }}
              className="group relative bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer border border-[#ded8cb] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
            >
              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${card.badgeBg} text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${card.badgeDot}`} />
                    {card.badgeText}
                  </span>
                  <span className="font-mono text-[11px] text-[#686660] font-medium">
                    {card.metaPeriod}
                  </span>
                </div>

                {/* Graphic / Blueprint Box preview simulation */}
                <div className="w-full h-44 bg-[#f5f3ee] rounded-xl mb-4 overflow-hidden relative p-3.5 flex flex-col justify-between border border-[#ded8cb]/80">
                  {card.coverUrl ? (
                    <>
                      <Image
                        src={card.coverUrl}
                        alt={card.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/35 pointer-events-none" />
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-white/95 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded font-bold tracking-wider">
                          {card.blueprintNo}
                        </span>
                        <div className="w-6 h-6 rounded-md bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#2563eb] shadow-xs">
                          <span className="text-xs font-mono font-bold">#</span>
                        </div>
                      </div>

                      <div className="relative z-10 my-auto text-center px-2">
                        <div className="font-serif text-lg sm:text-xl text-white tracking-tight font-bold drop-shadow-xs line-clamp-1">
                          {card.title}
                        </div>
                        <div className="text-[11px] font-mono text-white/85 mt-0.5 line-clamp-1">
                          {card.subtitle}
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded w-fit border border-white/20">
                        <span>{card.statPill}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#686660] font-bold tracking-wider">
                          {card.blueprintNo}
                        </span>
                        <div className="w-6 h-6 rounded-md bg-white/80 flex items-center justify-center text-[#2563eb]">
                          <span className="text-xs font-mono font-bold">#</span>
                        </div>
                      </div>

                      <div className="my-auto text-center px-2">
                        <div className="font-serif text-xl sm:text-2xl text-[#222222] tracking-tight font-bold group-hover:text-[#2563eb] transition-colors line-clamp-2">
                          {card.title}
                        </div>
                        <div className="text-[12px] font-mono text-[#686660] mt-0.5 line-clamp-1">
                          {card.subtitle}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#2563eb] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded w-fit border border-[#ded8cb]">
                        <span>{card.statPill}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Title & Content */}
                <h3 className="font-serif text-xl sm:text-2xl text-[#222222] group-hover:text-[#2563eb] transition-colors mb-2 font-bold line-clamp-2">
                  {card.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#444748] line-clamp-3 mb-4 leading-relaxed">
                  {card.summary}
                </p>
              </div>

              <div>
                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.tech.slice(0, 4).map((tItem) => (
                    <span
                      key={tItem}
                      className="px-2 py-0.5 rounded bg-[#f5f2ea] font-mono text-[11px] text-[#222222] border border-[#ded8cb]"
                    >
                      {tItem}
                    </span>
                  ))}
                  {card.tech.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-[#f0eee8] font-mono text-[11px] text-[#686660]">
                      +{card.tech.length - 4}
                    </span>
                  )}
                </div>

                {/* Action footer on card */}
                <div className="pt-3 border-t border-[#ded8cb]/60 flex items-center justify-between text-xs font-mono text-[#2563eb]">
                  <span className="inline-flex items-center gap-1 group-hover:underline font-semibold">
                    {card.footerAction}
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#686660] uppercase tracking-wider">
                    {card.footerStamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Sandbox Draft Card (Playful Scrapbook Blank) */}
          <div className="project-card relative bg-[#f5f3ee]/80 rounded-2xl p-6 flex flex-col justify-between md:col-span-2 lg:col-span-2 border border-dashed border-[#ded8cb] transition-all hover:bg-[#f5f3ee]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e4e2dd] text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#686660] animate-pulse" />
                  {t("sandboxBadge")}
                </span>
                <span className="font-mono text-xs text-[#686660] font-bold tracking-wider">
                  {t("sandboxTag")}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="font-serif text-xl sm:text-2xl text-[#222222] font-bold">
                  {t("sandboxTitle")}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#444748] max-w-lg mt-1.5 leading-relaxed">
                  {t("sandboxDesc")}
                </p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#ded8cb]/60 mt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-[#686660] bg-white px-2.5 py-1 rounded shadow-xs border border-[#ded8cb]">
                  status: coffee_needed
                </span>
                <span className="font-mono text-[11px] text-[#686660] bg-white px-2.5 py-1 rounded shadow-xs border border-[#ded8cb]">
                  priority: high_curiosity
                </span>
              </div>
              <span className="italic font-serif text-xs sm:text-sm text-[#686660] self-end sm:self-auto">
                {t("sandboxQuote")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Detail Modal */}
      <ProjectDetailModal
        isOpen={modalOpen}
        data={selectedDetail}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

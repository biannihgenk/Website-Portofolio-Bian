"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { ScrollReveal } from "@/components/motion/MotionProviders";

interface FeaturedProjectsProps {
  projects: Project[];
  locale: string;
}

export function FeaturedProjects({ projects, locale }: FeaturedProjectsProps) {
  const t = useTranslations("projects");
  const isId = locale === "id";

  // High quality design reference covers for visual polish
  const fallbackCovers: Record<string, string> = {
    vocaz:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADXSLRE0gTZCzz_ZYNMUFw-gf6aXBpRBbcJMXKa9wui15w4dwV5qYVdlN0tc1iPKHeSbGXE7D1Z_eTLr0xZGqESXIKu43fB95jqqAgrnyUWqKuzzw_abOOUaavdI5njPVdiFZsqSbD9i3L4b9KVB_nCmBfBBFnGjR8bAXCcJE7FJcGR8wV3zl65vfuxN4WK2wDAzp6m7HVRQJcdvmmXfE3aEukbIiQ-pc8bHMyhYC-wK5O3lHswEYD",
    meditrack:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoVoWeWkDOw_h6eO2eMbH3ShGS0AN-wIDUmZ3zWivMHuGr6Q1fOtqO_en_i6fbr5FMGFIhfKQeLEg2otyUVDN19A8Ai2vJAoOSdfbmK2iehguNbtIdRHK17ZEqsA8IdE3dO1Yq7qLKY0xxmfMnRDHPd0-kCDfxXbA_3oo7yDgzeLFuNYz8BD5cv4U7zDMNruUWO2OuS7kHXqQBZWJoxggDAlGb_CnN2N3BKhHcAGvXzxzoPjRkm8w",
    topology:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUjW_YctERHVZ2Y-trL13N57jKo3hP9Vt06D9x356_gdADlkq1bjccR-qj4eUuhgmuLM5qJMpvJdssvS84fVJpVW9CgOQzL-mG7_uqLUkirwWxg-3PFPHkKpCDqzXQtYuEyC9K1secJsNjODhS7hGzvdsQ97pmIlF3eOZFZ8mh0Bpnp4tz9BvxZ2rHN_ZmCjeaaIdaGNn4iW8Fk2CLBhhAqUXzekvuw_QH4KpjgSu-AXdI9CkGlQUX",
    ambis:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrRrOAH_nv_pCJ6UkqSlQPlKcUdcyrTH5lX3iV2iBf55GdltWDE6YxbuuqfUhsQN6Jjdo9tiMKx-Iq4b5RPAqB45BOsgbDuxoCD3Dm77ds4IVVrzx-9Zc8Rs9kluc90Uv5G0f51DfdFMSsr65uh5PkEBXO0Mq5-N4LMIQdYZXwa4MqHJzg9a_X8TTCnRu3oiEud8_dc37HaAJ9HmSY7u8vx11h_mgaTiER5YbU7gQt3fxmpXMtRp-x",
  };

  // Flagship project: VocAZ
  const flagship = projects.find((p) => p.is_featured) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== flagship?.id);

  function getProjectCover(p?: Project, fallbackKey?: string) {
    if (!p) return fallbackCovers[fallbackKey || "vocaz"];
    if (p.cover_image_path) {
      const publicUrl = getStoragePublicUrl(p.cover_image_path);
      if (publicUrl) return publicUrl;
    }
    const slugLower = p.slug?.toLowerCase() || "";
    if (slugLower.includes("vocaz")) return fallbackCovers.vocaz;
    if (slugLower.includes("meditrack") || slugLower.includes("kontrol"))
      return fallbackCovers.meditrack;
    if (slugLower.includes("topology") || slugLower.includes("topologi"))
      return fallbackCovers.topology;
    return fallbackCovers[fallbackKey || "vocaz"];
  }

  return (
    <section id="projects" className="w-full py-16 sm:py-20 bg-transparent border-y border-[#ded8cb] scroll-mt-24 overflow-x-clip">
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#ded8cb] rounded-md font-mono text-xs font-bold text-blue-600 uppercase tracking-widest shadow-xs">
              <span>⚡</span> {t("badge")}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#222222]">
              {t("title")}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#6b6863] max-w-xl">
              {t("subtitle")}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-xs border border-[#ded8cb] shadow-xs transition-all whitespace-nowrap self-start md:self-auto font-bold"
          >
            <span>{isId ? "Lihat Semua Proyek" : "View All Projects"}</span>
            <span className="text-blue-600">→</span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-dashed border-[#ded8cb] text-center space-y-3">
            <div className="text-4xl">⚡</div>
            <p className="font-serif text-xl font-bold text-[#222222]">
              {isId ? "Belum Ada Proyek yang Ditambahkan" : "No Projects Added Yet"}
            </p>
            <p className="font-sans text-sm text-[#6b6863] max-w-md mx-auto">
              {isId
                ? "Proyek rekayasa perangkat lunak dan infrastruktur akan ditampilkan di sini setelah ditambahkan melalui panel admin."
                : "Software engineering and infrastructure projects will be displayed here once added through the admin panel."}
            </p>
          </div>
        ) : (
          /* Asymmetric Project Layout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FLAGSHIP PROJECT (7 Columns) */}
            {flagship && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#ded8cb] shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-900 font-mono text-xs uppercase tracking-wider font-bold">
                    {t("flagship")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f5f3ee] border border-[#ded8cb] font-mono text-[11px] text-[#6b6863]">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>{t("activeDev")}</span>
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#222222] group-hover:text-blue-600 transition-colors">
                    <Link href="/projects" className="hover:underline">
                      {isId ? flagship.title_id : flagship.title_en}
                    </Link>
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#6b6863] leading-relaxed">
                    {isId ? flagship.summary_id : flagship.summary_en}
                  </p>
                </div>

                {/* Visual Preview Container */}
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#f5f3ee] shadow-inner mb-6 border border-[#ded8cb]">
                  <Image
                    src={getProjectCover(flagship, "vocaz")}
                    alt={isId ? flagship.title_id : flagship.title_en}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#222222]/90 text-white px-3 py-1 rounded-lg font-mono text-xs backdrop-blur-sm shadow-md">
                    Next.js 14 + Supabase + Tailwind
                  </div>
                </div>
              </div>

              {/* Technologies & Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#ded8cb]">
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(flagship.technologies) &&
                    (flagship.technologies as string[]).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-[#f5f2ea] border border-[#ded8cb] font-mono text-xs text-[#222222]"
                      >
                        {tech}
                      </span>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                  {flagship.project_url && (
                    <a
                      href={flagship.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 font-sans text-xs sm:text-sm font-semibold hover:underline"
                    >
                      <span>Live Demo</span>
                      <span>↗</span>
                    </a>
                  )}
                  {flagship.repository_url && (
                    <a
                      href={flagship.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#6b6863] hover:text-[#222222] font-mono text-xs"
                    >
                      <span>Code</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY PROJECTS (5 Columns Stack or Bento Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {otherProjects.map((p, idx) => {
              const coverUrl = getProjectCover(
                p,
                idx === 0 ? "meditrack" : "topology"
              );
              const title = isId ? p.title_id : p.title_en;
              const summary = isId ? p.summary_id : p.summary_en;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ded8cb] shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#f3b9a7] text-[#222222] font-mono text-[11px] uppercase tracking-wider font-bold">
                        {p.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#f5f3ee] border border-[#ded8cb] font-mono text-[10px] text-[#6b6863]">
                        {p.project_status || "Completed"}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#222222] group-hover:text-blue-600 transition-colors mb-2">
                      <Link href="/projects" className="hover:underline">
                        {title}
                      </Link>
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed mb-4 line-clamp-3">
                      {summary}
                    </p>

                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb] shadow-inner mb-4">
                      <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        unoptimized
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ded8cb]">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(p.technologies) &&
                        (p.technologies as string[]).slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-[#f5f2ea] border border-[#ded8cb] font-mono text-[11px] text-[#222222]"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {p.project_url && (
                        <a
                          href={p.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold text-xs hover:underline"
                        >
                          Demo ↗
                        </a>
                      )}
                      {p.repository_url && (
                        <a
                          href={p.repository_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6b6863] font-mono text-xs hover:text-[#222222]"
                        >
                          Repo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </ScrollReveal>
    </section>
  );
}

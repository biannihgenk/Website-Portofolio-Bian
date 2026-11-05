"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

interface FeaturedCaseStudyProps {
  locale: string;
  githubUrl?: string;
  projectUrl?: string | null;
  project?: Project | null;
}

export function FeaturedCaseStudy({
  locale,
  githubUrl = "https://github.com",
  project,
}: FeaturedCaseStudyProps) {
  const t = useTranslations("projectsPage");
  const isId = locale === "id";
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!project) return null;

  const title = isId ? project.title_id : project.title_en;
  const summary = isId ? project.summary_id : project.summary_en;
  const description = isId
    ? project.description_id || project.summary_id
    : project.description_en || project.summary_en;

  const techList: string[] = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : [];

  const repoUrl = project.repository_url || githubUrl;
  const liveUrl = project.project_url;

  function handleLiveDemoClick() {
    if (liveUrl) {
      window.open(liveUrl, "_blank", "noopener,noreferrer");
    } else {
      setToastMessage(
        isId
          ? "⚡ Sandbox Demo: Server lokal sedang disinkronkan ke staging environment!"
          : "⚡ Sandbox Demo: Local server currently syncing to staging environment!"
      );
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  }

  // Cover image handling
  const coverUrl = project.cover_image_path
    ? getStoragePublicUrl(project.cover_image_path)
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuADXSLRE0gTZCzz_ZYNMUFw-gf6aXBpRBbcJMXKa9wui15w4dwV5qYVdlN0tc1iPKHeSbGXE7D1Z_eTLr0xZGqESXIKu43fB95jqqAgrnyUWqKuzzw_abOOUaavdI5njPVdiFZsqSbD9i3L4b9KVB_nCmBfBBFnGjR8bAXCcJE7FJcGR8wV3zl65vfuxN4WK2wDAzp6m7HVRQJcdvmmXfE3aEukbIiQ-pc8bHMyhYC-wK5O3lHswEYD";

  return (
    <section className="w-full my-12 sm:my-16" id="featured-inspection">
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden border border-[#ded8cb]">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between relative z-10 pt-2">
          {/* Left Column: Problem & Narrative (7/12) */}
          <div className="lg:w-7/12 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#dbeafe] font-mono text-[11px] font-bold text-[#222222] uppercase tracking-wider">
                  {project.category?.toUpperCase() || t("deepDiveTag")}
                </span>
                <span className="font-mono text-xs text-[#686660]">
                  {project.slug || t("deepDiveFile")}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] font-bold tracking-tight">
                {title}
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#444748] leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Problem & Motivation Quote Box */}
            <div className="bg-[#f5f2ea] p-4 sm:p-5 rounded-2xl relative shadow-xs border border-[#ded8cb]">
              <div className="font-mono text-[11px] text-[#2563eb] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {t("problemTitle")}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#222222] italic leading-relaxed">
                &ldquo;{description}&rdquo;
              </p>
            </div>

            {/* Role & Contributions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f5f3ee] rounded-xl border border-[#ded8cb]">
                <div className="font-mono text-[10px] text-[#686660] uppercase font-bold tracking-wider">
                  {t("roleTitle")}
                </div>
                <div className="font-serif text-base sm:text-lg text-[#222222] font-bold mt-1">
                  Fullstack &amp; Architecture
                </div>
                <p className="font-sans text-xs text-[#444748] mt-1 leading-relaxed">
                  {isId
                    ? "Merancang skema database PostgreSQL, komponen UI responsif, dan alur integrasi sistem."
                    : "Designed PostgreSQL relational schema, responsive UI components, and system integration workflows."}
                </p>
              </div>
              <div className="p-4 bg-[#f5f3ee] rounded-xl border border-[#ded8cb]">
                <div className="font-mono text-[10px] text-[#686660] uppercase font-bold tracking-wider">
                  {t("lessonsTitle")}
                </div>
                <div className="font-serif text-base sm:text-lg text-[#222222] font-bold mt-1">
                  System Reliability
                </div>
                <p className="font-sans text-xs text-[#444748] mt-1 leading-relaxed">
                  {isId
                    ? "Mengoptimalkan performa rendering di koneksi terbatas dan pengujian edge cases secara hands-on."
                    : "Optimized rendering performance on constrained networks and hands-on edge case testing."}
                </p>
              </div>
            </div>

            {/* Honest Status Callout & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#ded8cb]/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] animate-pulse" />
                <span className="font-mono text-xs text-[#222222] font-semibold">
                  {project.project_status ? project.project_status.toUpperCase() : t("statusLabel")}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {repoUrl && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#222222] text-white font-mono text-xs hover:bg-[#2563eb] transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>{t("inspectCode")}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleLiveDemoClick}
                  className="px-4 py-2 rounded-xl bg-[#f0eee8] hover:bg-[#eae8e2] text-[#222222] font-mono text-xs transition-all flex items-center gap-1.5 border border-[#ded8cb]"
                >
                  <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{liveUrl ? (isId ? "Buka Demo" : "Live Demo") : t("liveSandbox")}</span>
                </button>
              </div>
            </div>

            {/* Interactive Feedback Toast */}
            {toastMessage && (
              <div className="p-3 bg-[#dbeafe] text-[#222222] rounded-xl font-mono text-xs border border-[#2563eb]/30 animate-in fade-in duration-200">
                {toastMessage}
              </div>
            )}
          </div>

          {/* Right Column: Project Preview & Tech Stack (5/12) */}
          <div className="lg:w-5/12 flex flex-col items-center w-full">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              {/* Scrapbook Frame */}
              <div className="bg-[#fbf9f3] p-4 rounded-2xl shadow-xs border border-[#ded8cb] rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="rounded-xl overflow-hidden bg-[#f5f2ea] aspect-video flex items-center justify-center relative border border-[#ded8cb]/80">
                  <Image
                    src={coverUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuADXSLRE0gTZCzz_ZYNMUFw-gf6aXBpRBbcJMXKa9wui15w4dwV5qYVdlN0tc1iPKHeSbGXE7D1Z_eTLr0xZGqESXIKu43fB95jqqAgrnyUWqKuzzw_abOOUaavdI5njPVdiFZsqSbD9i3L4b9KVB_nCmBfBBFnGjR8bAXCcJE7FJcGR8wV3zl65vfuxN4WK2wDAzp6m7HVRQJcdvmmXfE3aEukbIiQ-pc8bHMyhYC-wK5O3lHswEYD"}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {/* Badge on bottom */}
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-[#ded8cb]">
                    <span className="font-mono text-[10px] text-[#2563eb] font-bold">
                      {project.is_featured ? "FLAGSHIP PROJECT" : (project.category?.toUpperCase() || "BUILD")}
                    </span>
                  </div>
                </div>

                <div className="pt-3 text-center">
                  <div className="font-serif text-base text-[#222222] italic font-semibold line-clamp-1">
                    {title}
                  </div>
                  <div className="font-mono text-[11px] text-[#686660] mt-0.5">
                    {project.is_featured ? "Featured in Portfolio Showcase" : "Verified Project"}
                  </div>
                </div>
              </div>

              {/* Tech Blueprint Mini-Table */}
              {techList.length > 0 && (
                <div className="mt-5 bg-[#f5f2ea] p-4 rounded-xl shadow-inner w-full space-y-2 border border-[#ded8cb]">
                  <div className="font-mono text-[10px] text-[#686660] uppercase font-bold tracking-wider">
                    {t("archTitle")}
                  </div>
                  {techList.slice(0, 4).map((tech, idx) => (
                    <div
                      key={tech}
                      className={`flex items-center justify-between text-xs font-mono ${
                        idx < Math.min(techList.length, 4) - 1 ? "border-b border-[#ded8cb]/60 pb-1.5" : "pt-1"
                      }`}
                    >
                      <span className="text-[#686660]">Module {idx + 1}</span>
                      <span className="font-semibold text-[#222222]">{tech}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

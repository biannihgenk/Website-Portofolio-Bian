"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { BlogPost } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

interface ArticleReadingViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: string;
}

export function ArticleReadingView({
  post,
  relatedPosts,
  locale,
}: ArticleReadingViewProps) {
  const t = useTranslations("blogPage");
  const isId = locale === "id";

  const [copied, setCopied] = useState(false);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState<number | null>(null);

  const title = isId ? post.title_id : post.title_en;
  const excerpt = isId ? post.excerpt_id : post.excerpt_en;
  const rawContent = isId
    ? post.content_id || post.content_en || excerpt
    : post.content_en || post.content_id || excerpt;

  const resolvedCover = post.cover_image_path
    ? post.cover_image_path.startsWith("http")
      ? post.cover_image_path
      : getStoragePublicUrl(post.cover_image_path)
    : null;

  const categoryName = post.category
    ? isId
      ? post.category.name_id
      : post.category.name_en
    : "Catatan";

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(isId ? "id-ID" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "2026";

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  function handleCopyCode(codeText: string, index: number) {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(codeText);
      setCodeCopiedIndex(index);
      setTimeout(() => setCodeCopiedIndex(null), 2500);
    }
  }

  // Split markdown into sections
  const blocks = (rawContent || "").split("\n\n").filter(Boolean);

  // Extract table of contents headings
  const tocHeadings = blocks
    .filter((b) => b.startsWith("## "))
    .map((b) => b.replace("## ", "").trim());

  return (
    <article className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. BREADCRUMB & BACK NAVIGATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-[#686660] mb-6 sm:mb-8 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-[#222222] transition-colors">
          {t("breadcrumbHome")}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/blog`} className="hover:text-[#222222] transition-colors">
          {t("breadcrumbBlog")}
        </Link>
        <span>/</span>
        <span className="text-[#2563eb] font-semibold truncate max-w-xs sm:max-w-md">
          {title}
        </span>
      </nav>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. ARTICLE HEADER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="space-y-4 sm:space-y-6 pb-8 border-b border-[#ded8cb]">
        {/* Category & Read Time Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#bfdbfe] text-[#1e40af] font-mono text-xs uppercase font-bold shadow-2xs">
            {categoryName}
          </span>
          <span className="font-mono text-xs text-[#686660] flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{post.reading_time_minutes || 5} {t("minRead")}</span>
          </span>
          <span className="font-mono text-xs text-[#686660]">
            • Dipublikasikan {dateStr}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222] font-bold leading-[1.18] tracking-tight">
          {title}
        </h1>

        {/* Author Byline & Share Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dbeafe] text-[#1e3a8a] flex items-center justify-center font-serif font-bold text-lg shadow-2xs border border-[#ded8cb]">
              B
            </div>
            <div>
              <p className="font-sans text-xs sm:text-sm font-bold text-[#222222]">
                Debian (Bian) Firwanto
              </p>
              <p className="font-mono text-[11px] text-[#686660]">
                TKJ SMK Telkom Malang • Process Journal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs bg-white hover:bg-[#f0eee8] text-[#222222] border border-[#ded8cb] transition-colors shadow-2xs"
            >
              <span>🔗</span>
              <span>{copied ? t("copied") : t("shareNote")}</span>
            </button>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs bg-[#f5f3ee] hover:bg-[#dbeafe] text-[#222222] border border-[#ded8cb] transition-colors"
            >
              <span>{t("backToNotes")}</span>
            </Link>
          </div>
        </div>

        {/* Clean Excerpt Highlight */}
        <div className="bg-[#f5f2ea] p-5 sm:p-6 rounded-2xl border-l-4 border-[#2563eb] border border-[#ded8cb] shadow-xs relative">
          <p className="font-serif text-sm sm:text-base text-[#222222] italic leading-relaxed pt-1">
            &ldquo;{excerpt}&rdquo;
          </p>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. COVER IMAGE PREVIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      {resolvedCover && (
        <div className="my-8 sm:my-10 space-y-2">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-[#eae8e2] border border-[#ded8cb] shadow-md">
            <Image
              src={resolvedCover}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              unoptimized
              className="object-cover"
              priority
            />
          </div>
          <p className="font-mono text-[11px] text-[#686660] text-center italic">
            Visual dokumentasi pendukung • SMK Telkom Malang Lab Archive
          </p>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. MAIN TWO-COLUMN EDITORIAL READING LAYOUT */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-8">
        {/* Sticky Table of Contents Sidebar */}
        {tocHeadings.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4 bg-white p-5 rounded-2xl border border-[#ded8cb] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#2563eb] font-mono text-xs uppercase font-bold tracking-wider">
              <span>📑</span>
              <span>{t("tableOfContents")}</span>
            </div>
            <ul className="space-y-2.5 font-sans text-xs text-[#444748] border-l-2 border-[#f0eee8] pl-3">
              {tocHeadings.map((heading, idx) => (
                <li key={idx} className="hover:text-[#2563eb] transition-colors leading-snug">
                  <span className="font-mono text-[10px] text-[#2563eb] font-bold mr-1.5">
                    0{idx + 1}.
                  </span>
                  <span>{heading}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[#f0eee8] font-mono text-[11px] text-[#686660] space-y-1">
              <p className="font-semibold text-[#222222]">Catatan Terkurasi</p>
              <p>Diuji dan diverifikasi secara langsung di perangkat lab fisik.</p>
            </div>
          </aside>
        )}

        {/* Reading Article Body */}
        <div className={`${tocHeadings.length > 0 ? "lg:col-span-8" : "lg:col-span-12 max-w-3xl mx-auto"} space-y-6 text-[#222222]`}>
          {blocks.map((block, index) => {
            // Heading H2
            if (block.startsWith("## ")) {
              const text = block.replace("## ", "").trim();
              return (
                <h2
                  key={index}
                  className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold pt-6 pb-2 border-b border-[#f0eee8] flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  <span>{text}</span>
                </h2>
              );
            }

            // Heading H3
            if (block.startsWith("### ")) {
              const text = block.replace("### ", "").trim();
              return (
                <h3
                  key={index}
                  className="font-serif text-xl sm:text-2xl text-[#222222] font-semibold pt-4"
                >
                  {text}
                </h3>
              );
            }

            // Code Block
            if (block.startsWith("```")) {
              const firstLine = block.split("\n")[0];
              const lang = firstLine.replace("```", "").trim() || "bash";
              const rawSnippet = block.slice(firstLine.length + 1).replace(/```$/, "").trim();

              return (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden bg-[#222222] text-[#fbf9f3] my-6 border border-[#3f1407] shadow-scrapbook"
                >
                  {/* Terminal Header */}
                  <div className="px-4 py-2.5 bg-[#1b1c1c] border-b border-white/10 flex items-center justify-between font-mono text-xs text-[#a8a6a0]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-[#dbeafe] font-bold">{lang}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(rawSnippet, index)}
                      className="px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#fbf9f3] text-[11px] transition-colors flex items-center gap-1"
                    >
                      <span>{codeCopiedIndex === index ? "✓ Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {/* Terminal Code Snippet */}
                  <pre className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] text-[#bfdbfe] leading-relaxed overflow-x-auto whitespace-pre">
                    {rawSnippet}
                  </pre>
                </div>
              );
            }

            // Blockquote
            if (block.startsWith("> ")) {
              return (
                <blockquote
                  key={index}
                  className="my-6 p-4 sm:p-5 rounded-2xl bg-[#f5f2ea] border-l-4 border-[#2563eb] border border-[#ded8cb] font-serif text-sm sm:text-base italic text-[#222222] leading-relaxed shadow-2xs"
                >
                  {block.replace("> ", "")}
                </blockquote>
              );
            }

            // Bullet List
            if (block.startsWith("1. ") || block.startsWith("- ")) {
              const lines = block.split("\n");
              return (
                <ul key={index} className="space-y-2.5 my-4 pl-4 font-sans text-xs sm:text-sm text-[#444748] leading-relaxed">
                  {lines.map((li, lidx) => (
                    <li key={lidx} className="flex items-start gap-2">
                      <span className="text-[#2563eb] font-bold mt-0.5">•</span>
                      <span>{li.replace(/^[0-9]+\.\s+/, "").replace(/^-\s+/, "")}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            // Default Paragraph
            return (
              <p
                key={index}
                className="font-sans text-xs sm:text-sm sm:leading-relaxed text-[#444748] leading-relaxed"
              >
                {block}
              </p>
            );
          })}

          {/* Tags Section */}
          {Array.isArray(post.tags) && (post.tags as string[]).length > 0 && (
            <div className="pt-8 border-t border-[#ded8cb] flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase text-[#686660] font-bold mr-1">
                Tags:
              </span>
              {(post.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md bg-white border border-[#ded8cb] font-mono text-xs text-[#2563eb] shadow-2xs"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* Author Card Footer */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#f5f3ee] border border-[#ded8cb] shadow-scrapbook flex flex-col sm:flex-row items-center gap-5 mt-10">
            <div className="w-16 h-16 rounded-full bg-[#dbeafe] text-[#1e3a8a] flex items-center justify-center font-serif font-bold text-2xl shadow-xs border border-[#ded8cb] shrink-0">
              B
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#222222]">
                {t("authorTitle")}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#444748] leading-relaxed">
                {t("authorBio")}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 font-mono text-xs text-[#2563eb]">
                <Link href={`/${locale}/profile`} className="hover:underline font-bold">
                  Tentang Bian →
                </Link>
                <span>•</span>
                <Link href={`/${locale}/projects`} className="hover:underline font-bold">
                  Daftar Proyek →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. "CATATAN LAINNYA DARI PROSES" RECOMMENDATIONS SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 sm:mt-24 pt-10 border-t border-[#ded8cb]">
          <div className="mb-8 space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2563eb] font-bold">
              [RECOMMENDED DISPATCHES]
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#222222]">
              {t("moreNotesTitle")}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#686660]">
              {t("moreNotesLead")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map((rel) => {
              const relTitle = isId ? rel.title_id : rel.title_en;
              const relExcerpt = isId ? rel.excerpt_id : rel.excerpt_en;
              const relCover = rel.cover_image_path
                ? rel.cover_image_path.startsWith("http")
                  ? rel.cover_image_path
                  : getStoragePublicUrl(rel.cover_image_path)
                : null;

              return (
                <Link
                  key={rel.id}
                  href={`/${locale}/blog/${rel.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-scrapbook border border-[#ded8cb] p-4 flex flex-col justify-between hover:shadow-scrapbook-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="space-y-3">
                    {relCover && (
                      <div className="aspect-[16/10] w-full rounded-xl overflow-hidden relative bg-[#f5f3ee] border border-[#ded8cb]">
                        <Image
                          src={relCover}
                          alt={relTitle}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h3 className="font-serif text-lg font-bold text-[#222222] group-hover:text-[#2563eb] transition-colors line-clamp-2">
                      {relTitle}
                    </h3>

                    <p className="font-sans text-xs text-[#444748] line-clamp-2 leading-relaxed">
                      {relExcerpt}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#f0eee8] flex items-center justify-between font-mono text-xs text-[#686660]">
                    <span>{rel.reading_time_minutes || 5} {t("minRead")}</span>
                    <span className="text-[#2563eb] font-bold group-hover:translate-x-1 transition-transform">
                      {t("readNote")} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}

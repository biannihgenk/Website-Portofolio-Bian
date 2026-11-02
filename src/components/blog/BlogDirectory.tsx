"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { BlogPost, BlogCategory } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { ArticleReadingModal } from "./ArticleReadingModal";

interface BlogDirectoryProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  locale: string;
}

export function BlogDirectory({ posts, categories, locale }: BlogDirectoryProps) {
  const t = useTranslations("blogPage");
  const isId = locale === "id";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "long" | "recommended">("newest");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Keyboard shortcut Cmd/Ctrl + K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("articleSearchInput");
        if (input) input.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Map category slugs and count pills
  const categoryFilters = useMemo(() => {
    const list: Array<{ slug: string; name: string; count: number }> = [
      { slug: "all", name: t("filterAll"), count: posts.length },
    ];

    // Count by category
    const catCounts = new Map<string, number>();
    posts.forEach((p) => {
      const slug = p.category?.slug || "general";
      catCounts.set(slug, (catCounts.get(slug) || 0) + 1);
    });

    // Add categories from DB or posts
    categories.forEach((c) => {
      const count = catCounts.get(c.slug) || 0;
      list.push({
        slug: c.slug,
        name: isId ? c.name_id : c.name_en,
        count,
      });
    });

    // Also include any post categories not in DB categories list
    posts.forEach((p) => {
      if (p.category && !categories.some((c) => c.slug === p.category?.slug)) {
        if (!list.some((it) => it.slug === p.category?.slug)) {
          list.push({
            slug: p.category.slug,
            name: isId ? p.category.name_id : p.category.name_en,
            count: catCounts.get(p.category.slug) || 1,
          });
        }
      }
    });

    return list;
  }, [posts, categories, isId, t]);

  // Filter & Sort
  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ||
        p.category?.slug === activeCategory ||
        p.category_id === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const title = (isId ? p.title_id : p.title_en).toLowerCase();
      const excerpt = (isId ? p.excerpt_id : p.excerpt_en).toLowerCase();
      const tags = Array.isArray(p.tags) ? (p.tags as string[]).join(" ").toLowerCase() : "";

      const matchesSearch = !q || title.includes(q) || excerpt.includes(q) || tags.includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "long") {
      result = [...result].sort(
        (a, b) => (b.reading_time_minutes || 5) - (a.reading_time_minutes || 5)
      );
    } else if (sortBy === "recommended") {
      result = [...result].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    } else {
      // Newest
      result = [...result].sort(
        (a, b) =>
          new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime()
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery, sortBy, isId]);

  function handleCardClick(p: BlogPost) {
    setSelectedPost(p);
    setModalOpen(true);
  }

  // Visual category chip styling
  const getCategoryBadgeClass = (categorySlug?: string) => {
    const s = (categorySlug || "").toLowerCase();
    if (s.includes("tech") || s.includes("network") || s.includes("jaringan")) {
      return "bg-[#bfdbfe] text-[#1e40af]";
    }
    if (s.includes("project") || s.includes("rekayasa") || s.includes("build")) {
      return "bg-[#dbeafe] text-[#1e3a8a]";
    }
    if (s.includes("learn") || s.includes("belajar") || s.includes("catatan")) {
      return "bg-[#f3b9a7]/80 text-[#3f1407]";
    }
    if (s.includes("reflection") || s.includes("gagasan") || s.includes("mind")) {
      return "bg-[#dbeafe] text-[#222222]";
    }
    return "bg-[#f0eee8] text-[#686660]";
  };

  return (
    <div className="w-full">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CATEGORY DISCOVERY & MINIMAL SEARCH FILTER BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-8 sm:mt-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-scrapbook border border-[#ded8cb] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Dynamic Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categoryFilters.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all shrink-0 shadow-2xs ${
                    isActive
                      ? "bg-[#222222] text-white shadow-sm"
                      : "bg-[#f5f3ee] text-[#444748] hover:text-[#222222] hover:bg-[#eae8e2] border border-[#ded8cb]/80"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-white text-[#686660]"
                    }`}
                  >
                    {String(cat.count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input with Cmd+K hint */}
            <div className="relative flex-1 sm:w-64">
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#686660]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="articleSearchInput"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-[#f5f2ea] rounded-full pl-9 pr-12 py-2 font-sans text-xs text-[#222222] placeholder:text-[#686660] focus:outline-none focus:ring-2 focus:ring-[#2563eb] border border-[#ded8cb]"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#686660] bg-white px-1.5 py-0.5 rounded border border-[#ded8cb] shadow-2xs pointer-events-none">
                {t("searchKbd")}
              </kbd>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "long" | "recommended")}
                className="appearance-none bg-[#f5f2ea] font-mono text-xs text-[#222222] pl-3.5 pr-8 py-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563eb] border border-[#ded8cb] shadow-2xs font-medium"
              >
                <option value="newest">{t("sortNewest")}</option>
                <option value="long">{t("sortLongReads")}</option>
                <option value="recommended">{t("sortBookmarked")}</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#686660] text-[16px]">
                unfold_more
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. THE READING ROOM: Structured Uniform 3-Column Card Grid */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-12 sm:mt-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-4 mb-8 border-b border-[#ded8cb] gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#2563eb] font-bold">
              {t("archiveTag")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] font-bold tracking-tight mt-0.5">
              {t("archiveTitle")}
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#686660] max-w-sm text-left sm:text-right leading-relaxed">
            {t("archiveLead")}
          </p>
        </div>

        {/* Card Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredPosts.map((post) => {
              const title = isId ? post.title_id : post.title_en;
              const excerpt = isId ? post.excerpt_id : post.excerpt_en;
              const categoryName = post.category
                ? isId
                  ? post.category.name_id
                  : post.category.name_en
                : "Catatan";

              const resolvedCover = post.cover_image_path
                ? post.cover_image_path.startsWith("http")
                  ? post.cover_image_path
                  : getStoragePublicUrl(post.cover_image_path)
                : null;

              const dateStr = post.published_at
                ? new Date(post.published_at).toLocaleDateString(isId ? "id-ID" : "en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "2026";

              const badgeClass = getCategoryBadgeClass(post.category?.slug);

              return (
                <article
                  key={post.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(post)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(post);
                    }
                  }}
                  className="article-card group bg-white rounded-2xl overflow-hidden shadow-scrapbook hover:shadow-scrapbook-lg border border-[#ded8cb] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#f5f3ee] relative border-b border-[#ded8cb]/60">
                      {resolvedCover ? (
                        <Image
                          src={resolvedCover}
                          alt={title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-[#f5f2ea] to-[#dbeafe]/20">
                          <span className="text-3xl mb-1">📝</span>
                          <span className="font-serif text-xs text-[#686660] italic">
                            Notes from the Process
                          </span>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {post.is_featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="font-mono text-[10px] uppercase bg-[#222222] text-white px-2.5 py-1 rounded-sm shadow-xs font-bold tracking-wider">
                            {t("featuredBadge")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-6 pb-2">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold shadow-2xs ${badgeClass}`}
                        >
                          {categoryName}
                        </span>
                        <span className="font-mono text-[11px] text-[#686660] flex items-center gap-1 font-medium">
                          <svg className="w-3.5 h-3.5 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{post.reading_time_minutes || 5} {t("minRead")}</span>
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-[#222222] leading-snug font-bold group-hover:text-[#2563eb] transition-colors line-clamp-2">
                        {title}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-[#444748] mt-2.5 line-clamp-2 leading-relaxed">
                        {excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer Card */}
                  <div className="px-6 pb-5 pt-3.5 mt-2 border-t border-[#f0eee8] flex items-center justify-between">
                    <span className="font-mono text-xs text-[#686660] font-medium">
                      {dateStr}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-[11px] text-[#2563eb] hover:underline font-semibold"
                        title={isId ? "Buka di halaman tersendiri" : "Open standalone page"}
                      >
                        <span>↗</span>
                      </Link>
                      <div className="inline-flex items-center gap-1 font-mono text-xs uppercase text-[#222222] font-bold group-hover:text-[#2563eb] group-hover:translate-x-0.5 transition-all">
                        <span>{t("readNote")}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-[#ded8cb] text-center space-y-3">
            <div className="text-4xl">{posts.length === 0 ? "📝" : "🔍"}</div>
            <p className="font-serif text-xl text-[#222222] font-semibold">
              {posts.length === 0
                ? (isId ? "Belum Ada Catatan yang Diterbitkan" : "No Published Notes Yet")
                : t("noResults")}
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#686660] max-w-md mx-auto">
              {posts.length === 0
                ? (isId
                    ? "Catatan lab, riset jaringan, dan devlog akan langsung muncul di sini segera setelah Anda mengunggahnya melalui panel admin."
                    : "Lab notes, networking research, and devlogs will appear here as soon as you publish them via the admin panel.")
                : (isId ? "Coba sesuaikan kata kunci pencarian atau ubah kategori filter Anda." : "Try adjusting your search query or switching category filters.")}
            </p>
            {posts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-full font-mono text-xs bg-[#f5f3ee] hover:bg-[#dbeafe] text-[#222222] font-bold border border-[#ded8cb] transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. INTERACTIVE READING DRAWER / MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ArticleReadingModal
        isOpen={modalOpen}
        post={selectedPost}
        onClose={() => setModalOpen(false)}
        locale={locale}
      />
    </div>
  );
}

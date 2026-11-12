"use client";

import React from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import type { BlogPost } from "@/types/content";
import { ScrollReveal } from "@/components/motion/MotionProviders";

interface BlogNotebookProps {
  posts: BlogPost[];
  locale: string;
}

export function BlogNotebook({ posts, locale }: BlogNotebookProps) {
  const t = useTranslations("blog");
  const isId = locale === "id";

  const items = posts.map((p, idx) => ({
    id: p.id,
    slug: p.slug,
    title_id: p.title_id,
    title_en: p.title_en,
    category: p.category?.name_id || (isId ? "Catatan" : "Notes"),
    readTime: `${p.reading_time_minutes || 5} min read`,
    excerpt_id: p.excerpt_id || "",
    excerpt_en: p.excerpt_en || "",
    date: p.published_at ? p.published_at.slice(0, 10) : "2026",
    tagColor: idx % 3 === 0 ? "bg-blue-100" : idx % 3 === 1 ? "bg-sky-100" : "bg-indigo-100",
  }));

  return (
    <section id="blog" className="w-full py-16 sm:py-20 bg-transparent border-y border-[#ded8cb] scroll-mt-24 overflow-x-clip">
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>✍️</span> {t("badge")}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#222222]">
              {t("title")}
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f0eee8] text-[#222222] font-mono text-xs border border-[#ded8cb] shadow-xs transition-all whitespace-nowrap self-start sm:self-auto font-bold"
          >
            <span>{t("readAll")}</span>
            <span className="text-blue-600">→</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-dashed border-[#ded8cb] text-center space-y-3">
            <div className="text-4xl">📝</div>
            <p className="font-serif text-lg sm:text-xl text-[#222222] font-semibold">
              {isId ? "Belum Ada Catatan yang Diterbitkan" : "No Published Notes Yet"}
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#686660] max-w-md mx-auto">
              {isId
                ? "Catatan lab, riset jaringan, dan devlog akan muncul di sini setelah diunggah melalui panel admin."
                : "Lab notes, network research, and devlogs will appear here once published via the admin."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {items.map((post) => {
              const title = isId ? post.title_id : post.title_en;
              const excerpt = isId ? post.excerpt_id : post.excerpt_en;
              const linkHref = post.slug ? `/blog/${post.slug}` : "/blog";

              return (
                <Link
                  key={post.id}
                  href={linkHref}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ded8cb] shadow-scrapbook hover:shadow-scrapbook-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 block"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#686660]">
                      <span
                        className={`px-2.5 py-0.5 rounded-md ${post.tagColor} text-blue-900 border border-blue-200/50 font-bold text-[10px] uppercase`}
                      >
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[#222222] group-hover:text-blue-600 transition-colors leading-snug">
                      {title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#6b6863] leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center justify-between font-mono text-xs text-[#6b6863] border-t border-[#ded8cb] mt-6">
                    <span>{post.date}</span>
                    <span className="inline-flex items-center gap-1 text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>{t("readAction")}</span> →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}

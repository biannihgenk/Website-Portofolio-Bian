"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogPost, BlogCategory } from "@/types/content";
import {
  type BlogPostActionState,
} from "@/lib/validations/blog";
import { CONTENT_STATUS_OPTIONS } from "@/lib/validations/project";
import {
  createBlogPostAction,
  updateBlogPostAction,
} from "@/lib/actions/blog";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface BlogPostFormProps {
  post?: BlogPost | null;
  categories: BlogCategory[];
  mode: "create" | "edit";
}

export function BlogPostForm({ post, categories, mode }: BlogPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [slug, setSlug] = useState(post?.slug ?? "");
  const [titleId, setTitleId] = useState(post?.title_id ?? "");
  const [titleEn, setTitleEn] = useState(post?.title_en ?? "");
  const [excerptId, setExcerptId] = useState(post?.excerpt_id ?? "");
  const [excerptEn, setExcerptEn] = useState(post?.excerpt_en ?? "");
  const [contentId, setContentId] = useState(post?.content_id ?? "");
  const [contentEn, setContentEn] = useState(post?.content_en ?? "");
  const [coverImagePath, setCoverImagePath] = useState<string | null>(
    post?.cover_image_path ?? null
  );
  const [categoryId, setCategoryId] = useState<string>(post?.category_id ?? "");
  
  // Tags
  const [tags, setTags] = useState<string[]>(
    Array.isArray(post?.tags) ? (post.tags as string[]) : []
  );
  const [tagInput, setTagInput] = useState("");

  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);
  const [readingTime, setReadingTime] = useState<number>(
    post?.reading_time_minutes ?? 5
  );

  // SEO
  const [seoTitleId, setSeoTitleId] = useState(post?.seo_title_id ?? "");
  const [seoTitleEn, setSeoTitleEn] = useState(post?.seo_title_en ?? "");
  const [seoDescId, setSeoDescId] = useState(post?.seo_description_id ?? "");
  const [seoDescEn, setSeoDescEn] = useState(post?.seo_description_en ?? "");

  const [status, setStatus] = useState<string>(post?.status ?? "draft");

  const [actionState, setActionState] = useState<BlogPostActionState>({});

  const handleGenerateSlug = () => {
    const source = titleId || titleEn;
    if (!source.trim()) return;
    const generated = source
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,+|,+$/g, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("title_id", titleId);
      formData.append("title_en", titleEn);
      formData.append("excerpt_id", excerptId);
      formData.append("excerpt_en", excerptEn);
      formData.append("content_id", contentId);
      formData.append("content_en", contentEn);
      formData.append("cover_image_path", coverImagePath || "");
      formData.append("category_id", categoryId);
      formData.append("tags", JSON.stringify(tags));
      formData.append("is_featured", isFeatured ? "true" : "false");
      formData.append("reading_time_minutes", readingTime.toString());
      formData.append("seo_title_id", seoTitleId);
      formData.append("seo_title_en", seoTitleEn);
      formData.append("seo_description_id", seoDescId);
      formData.append("seo_description_en", seoDescEn);
      formData.append("status", status);

      let res: BlogPostActionState;
      if (mode === "create") {
        res = await createBlogPostAction({}, formData);
      } else if (post?.id) {
        res = await updateBlogPostAction(post.id, {}, formData);
      } else {
        res = { success: false, message: "ID artikel tidak valid." };
      }

      setActionState(res);

      if (res.success) {
        router.push("/admin/blog");
        router.refresh();
      }
    });
  };

  const errors = actionState.errors || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {actionState.message && !actionState.success && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          <p className="font-semibold text-rose-200">Perhatian</p>
          <p className="mt-0.5">{actionState.message}</p>
        </div>
      )}

      {/* Basic Metadata */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Judul & Tautan URL
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Judul Artikel (Bahasa Indonesia) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={titleId}
              onChange={(e) => {
                setTitleId(e.target.value);
                if (!slug && mode === "create") {
                  handleGenerateSlug();
                }
              }}
              placeholder="Contoh: Arsitektur Microservices dengan Go dan RabbitMQ"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.title_id && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title_id[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Judul Artikel (English) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Contoh: Microservices Architecture with Go and RabbitMQ"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.title_en && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title_en[0]}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-zinc-300">
              Slug URL <span className="text-rose-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="text-[11px] text-zinc-400 hover:text-zinc-200"
            >
              Generate dari judul
            </button>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-500">
              /blog/
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="arsitektur-microservices-go-rabbitmq"
              className="w-full rounded-r-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.slug[0]}</p>
          )}
        </div>
      </div>

      {/* Cover Image & Category */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Gambar Sampul & Taksonomi
        </h3>

        <MediaUploader
          value={coverImagePath}
          onChange={(path) => setCoverImagePath(path)}
          folder="blog"
          label="Foto Sampul Artikel (Cover Image)"
          description="Rasio 16:9 disarankan. Format: JPG, PNG, WebP, AVIF. Maks 5 MB."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Kategori Artikel
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_id} ({c.name_en})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Estimasi Waktu Baca (Menit)
            </label>
            <input
              type="number"
              min={1}
              value={readingTime}
              onChange={(e) => setReadingTime(parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0"
            />
            <label htmlFor="is_featured" className="text-xs text-zinc-300 cursor-pointer">
              Tandai sebagai <span className="font-semibold text-amber-300">Featured Article</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Tags / Topik Artikel (Tekan Enter atau koma untuk menambahkan)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-400 hover:text-white text-[10px]"
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={tags.length === 0 ? "Ketik tag lalu tekan Enter..." : ""}
              className="flex-1 bg-transparent px-1 py-0.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none min-w-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Excerpts */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Ringkasan Artikel (Excerpt)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Ringkasan (Bahasa Indonesia) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={excerptId}
              onChange={(e) => setExcerptId(e.target.value)}
              placeholder="Deskripsi singkat yang tampil pada kartu artikel dan daftar pencarian..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.excerpt_id && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.excerpt_id[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Ringkasan (English) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              placeholder="Short summary displayed on cards and search results..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.excerpt_en && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.excerpt_en[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Body (Markdown) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">
            Isi Konten Artikel (Markdown Didukung)
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">
            Mendukung Heading, Codeblocks, Blockquotes, Links
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Konten Lengkap (Bahasa Indonesia)
            </label>
            <textarea
              rows={12}
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              placeholder="Tulis artikel lengkap menggunakan Markdown...&#10;&#10;## Pengantar&#10;Isi pengantar artikel..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Konten Lengkap (English)
            </label>
            <textarea
              rows={12}
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              placeholder="Write full article using Markdown...&#10;&#10;## Introduction&#10;Introduction content..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* SEO Metadata */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Pengaturan SEO & Meta Tags (Opsional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              SEO Title (Bahasa Indonesia)
            </label>
            <input
              type="text"
              value={seoTitleId}
              onChange={(e) => setSeoTitleId(e.target.value)}
              placeholder="Default: Judul artikel"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              SEO Title (English)
            </label>
            <input
              type="text"
              value={seoTitleEn}
              onChange={(e) => setSeoTitleEn(e.target.value)}
              placeholder="Default: English title"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              SEO Meta Description (Bahasa Indonesia)
            </label>
            <textarea
              rows={2}
              value={seoDescId}
              onChange={(e) => setSeoDescId(e.target.value)}
              placeholder="Default: Ringkasan artikel"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              SEO Meta Description (English)
            </label>
            <textarea
              rows={2}
              value={seoDescEn}
              onChange={(e) => setSeoDescEn(e.target.value)}
              placeholder="Default: English excerpt"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visibility & Actions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
          Status Publikasi
        </h3>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
          >
            {CONTENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-zinc-500">
            Hanya status &quot;Published&quot; yang akan tampil untuk pengunjung publik.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <Link
          href="/admin/blog"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
        >
          {isPending
            ? "Menyimpan..."
            : mode === "create"
            ? "Publikasikan / Simpan Artikel"
            : "Simpan Perubahan Artikel"}
        </button>
      </div>
    </form>
  );
}

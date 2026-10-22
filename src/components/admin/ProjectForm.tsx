"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Project } from "@/types/content";
import {
  PROJECT_STATUS_OPTIONS,
  CONTENT_STATUS_OPTIONS,
  COMMON_CATEGORIES,
  type ProjectActionState,
} from "@/lib/validations/project";
import {
  createProjectAction,
  updateProjectAction,
  uploadProjectCoverAction,
} from "@/lib/actions/projects";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

const POPULAR_TECH_SUGGESTIONS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Node.js",
  "Python",
  "Docker",
  "FastAPI",
  "GraphQL",
  "Redis",
];

interface ProjectFormProps {
  project?: Project | null;
  mode: "create" | "edit";
}

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form Fields State
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [titleId, setTitleId] = useState(project?.title_id ?? "");
  const [titleEn, setTitleEn] = useState(project?.title_en ?? "");
  const [summaryId, setSummaryId] = useState(project?.summary_id ?? "");
  const [summaryEn, setSummaryEn] = useState(project?.summary_en ?? "");
  const [descriptionId, setDescriptionId] = useState(project?.description_id ?? "");
  const [descriptionEn, setDescriptionEn] = useState(project?.description_en ?? "");
  const [category, setCategory] = useState(project?.category ?? COMMON_CATEGORIES[0]);
  const [projectStatus, setProjectStatus] = useState<string>(project?.project_status ?? "concept");
  const [status, setStatus] = useState<string>(project?.status ?? "draft");
  const [isFeatured, setIsFeatured] = useState<boolean>(project?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState<number>(project?.sort_order ?? 0);
  const [projectUrl, setProjectUrl] = useState(project?.project_url ?? "");
  const [repositoryUrl, setRepositoryUrl] = useState(project?.repository_url ?? "");

  // Technologies Tag State
  const initialTechs: string[] = Array.isArray(project?.technologies)
    ? (project?.technologies as string[])
    : [];
  const [technologies, setTechnologies] = useState<string[]>(initialTechs);
  const [techInput, setTechInput] = useState("");

  // Cover Image & Upload State
  const [coverImagePath, setCoverImagePath] = useState<string | null>(project?.cover_image_path ?? null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    project?.cover_image_path ? getStoragePublicUrl(project.cover_image_path) : null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Validation & Error Feedback
  const [actionState, setActionState] = useState<ProjectActionState>({});

  // Auto-generate slug from titleId
  const handleGenerateSlug = () => {
    if (!titleId.trim()) return;
    const generated = titleId
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  };

  // Technologies Handlers
  const handleAddTechnology = (tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    if (!technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
    }
    setTechInput("");
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove));
  };

  // Cover Image File Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug || "project");

    try {
      const res = await uploadProjectCoverAction(formData);
      if (res.success && res.path && res.publicUrl) {
        setCoverImagePath(res.path);
        setCoverPreviewUrl(res.publicUrl);
      } else {
        setUploadError(res.error || "Gagal mengunggah gambar cover.");
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Terjadi kesalahan upload.");
    } finally {
      setIsUploadingImage(false);
      // Reset input value
      e.target.value = "";
    }
  };

  const handleRemoveCover = () => {
    setCoverImagePath(null);
    setCoverPreviewUrl(null);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("title_id", titleId);
      formData.append("title_en", titleEn);
      formData.append("summary_id", summaryId);
      formData.append("summary_en", summaryEn);
      formData.append("description_id", descriptionId);
      formData.append("description_en", descriptionEn);
      formData.append("cover_image_path", coverImagePath || "");
      formData.append("category", category);
      formData.append("project_status", projectStatus);
      formData.append("status", status);
      formData.append("is_featured", isFeatured ? "true" : "false");
      formData.append("sort_order", sortOrder.toString());
      formData.append("technologies", JSON.stringify(technologies));
      formData.append("project_url", projectUrl);
      formData.append("repository_url", repositoryUrl);

      let result: ProjectActionState;
      if (mode === "create") {
        result = await createProjectAction({}, formData);
      } else if (project?.id) {
        result = await updateProjectAction(project.id, {}, formData);
      } else {
        result = { success: false, message: "ID Proyek tidak valid." };
      }

      setActionState(result);

      if (result.success) {
        router.push("/admin/projects");
        router.refresh();
      }
    });
  };

  const errors = actionState.errors || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Banner Feedback */}
      {actionState.message && !actionState.success && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          <p className="font-semibold text-rose-200">Perhatian</p>
          <p className="mt-0.5">{actionState.message}</p>
        </div>
      )}

      {actionState.success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
          <p className="font-semibold text-emerald-200">Sukses</p>
          <p className="mt-0.5">{actionState.message}</p>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: IDENTITY & TITLES (BILINGUAL) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Identitas & Judul Proyek
          </h3>
          <p className="text-xs text-zinc-500">
            Mendukung konten bilingual (Bahasa Indonesia & Bahasa Inggris)
          </p>
        </div>

        {/* Titles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Judul Proyek (Indonesia) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={titleId}
              onChange={(e) => setTitleId(e.target.value)}
              placeholder="e.g. Website Portfolio & CMS"
              className={`w-full rounded-lg border bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 ${
                errors.title_id
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
              }`}
            />
            {errors.title_id && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title_id[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Project Title (English) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Personal Portfolio & CMS"
              className={`w-full rounded-lg border bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 ${
                errors.title_en
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
              }`}
            />
            {errors.title_en && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.title_en[0]}</p>
            )}
          </div>
        </div>

        {/* Slug Generator */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              URL Slug <span className="text-rose-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateSlug}
              className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
            >
              Generate dari Judul ID
            </button>
          </div>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 focus-within:border-zinc-600">
            <span className="text-xs text-zinc-600 font-mono select-none">/projects/</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="portfolio-cms"
              className="w-full bg-transparent text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none ml-1"
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.slug[0]}</p>
          )}
          <p className="mt-1 text-[11px] text-zinc-500 font-mono">
            Hanya huruf kecil, angka, dan tanda hubung (-). Harus unik.
          </p>
        </div>

        {/* Category & Project Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Kategori <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Web Development"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {/* Quick Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COMMON_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    category === cat
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.category[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Tahap Pengembangan (Stage)
            </label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            >
              {PROJECT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Menentukan badge status pengembangan pada tampilan portofolio.
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: SUMMARIES & DETAILED DESCRIPTIONS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Ringkasan & Deskripsi Lengkap
          </h3>
          <p className="text-xs text-zinc-500">
            Ringkasan singkat tampil di kartu proyek, deskripsi lengkap untuk halaman detail.
          </p>
        </div>

        {/* Short Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Ringkasan Singkat (ID) <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={summaryId}
              onChange={(e) => setSummaryId(e.target.value)}
              placeholder="Deskripsi singkat proyek dalam 1-2 kalimat..."
              className={`w-full rounded-lg border bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none ${
                errors.summary_id ? "border-rose-500" : "border-zinc-800 focus:border-zinc-600"
              }`}
            />
            {errors.summary_id && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.summary_id[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Short Summary (EN) <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              placeholder="Brief project summary in 1-2 sentences..."
              className={`w-full rounded-lg border bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none ${
                errors.summary_en ? "border-rose-500" : "border-zinc-800 focus:border-zinc-600"
              }`}
            />
            {errors.summary_en && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.summary_en[0]}</p>
            )}
          </div>
        </div>

        {/* Full Markdown Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Deskripsi Lengkap / Arsitektur (ID) <span className="text-zinc-500">(Opsional)</span>
            </label>
            <textarea
              rows={6}
              value={descriptionId}
              onChange={(e) => setDescriptionId(e.target.value)}
              placeholder="Penjelasan teknis mendalam, tantangan rekayasa, dan solusi (Markdown)..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Full Description / Architecture (EN) <span className="text-zinc-500">(Optional)</span>
            </label>
            <textarea
              rows={6}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="In-depth technical architecture, challenges, and solutions (Markdown)..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: COVER IMAGE & STORAGE UPLOAD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Gambar Cover & Media Proyek
          </h3>
          <p className="text-xs text-zinc-500">
            Tersimpan di Supabase Storage bucket <code className="font-mono text-zinc-400">portfolio-public</code> (Maksimal 5MB, format JPEG/PNG/WebP/AVIF).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Upload Input */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-zinc-300">
              Unggah Gambar Cover Baru
            </label>
            <div className="rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-950/60 p-5 text-center hover:border-zinc-700 transition-colors">
              <input
                type="file"
                id="cover-file-input"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                disabled={isUploadingImage}
                className="hidden"
              />
              <label
                htmlFor="cover-file-input"
                className="cursor-pointer inline-flex flex-col items-center justify-center space-y-2"
              >
                <span className="p-3 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                  📁
                </span>
                <span className="text-xs font-medium text-blue-400 hover:text-blue-300">
                  {isUploadingImage ? "Mengunggah ke Supabase Storage..." : "Pilih file gambar"}
                </span>
                <span className="text-[11px] text-zinc-500">
                  JPEG, PNG, WebP, AVIF hingga 5MB
                </span>
              </label>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded border border-rose-900/50">
                {uploadError}
              </p>
            )}

            {/* Custom Storage Path Input fallback */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Atau masukkan Path / URL Gambar secara langsung:
              </label>
              <input
                type="text"
                value={coverImagePath || ""}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  setCoverImagePath(val || null);
                  setCoverPreviewUrl(val ? getStoragePublicUrl(val) : null);
                }}
                placeholder="projects/project-cover.webp"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Image Preview */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Pratinjau Cover
            </label>
            {coverPreviewUrl ? (
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden group">
                <div className="aspect-video relative w-full bg-zinc-900">
                  <Image
                    src={coverPreviewUrl}
                    alt="Pratinjau Cover Proyek"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-3 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[200px]" title={coverImagePath || ""}>
                    {coverImagePath}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Hapus Cover
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 flex flex-col items-center justify-center text-zinc-600 text-xs">
                <span>Belum ada gambar cover dipilih</span>
                <span className="text-[10px] text-zinc-700 mt-1">
                  Thumbnail fallback default akan digunakan
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: TECHNOLOGIES & EXTERNAL LINKS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Teknologi & Tautan Proyek
          </h3>
          <p className="text-xs text-zinc-500">
            Daftar teknologi / stack dan tautan akses eksternal
          </p>
        </div>

        {/* Technologies Tag Manager */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Stack Teknologi (Tags)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTechnology(techInput);
                }
              }}
              placeholder="Ketik nama teknologi lalu tekan Enter..."
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddTechnology(techInput)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Tambah
            </button>
          </div>

          {/* Active Tags */}
          {technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 border border-zinc-700/80 px-2.5 py-1 text-xs font-medium text-zinc-200 font-mono"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    className="text-zinc-400 hover:text-rose-400"
                    aria-label={`Hapus ${tech}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Quick Technology Suggestions */}
          <div className="mt-3">
            <span className="text-[11px] text-zinc-500 mr-2">Saran Cepat:</span>
            <div className="inline-flex flex-wrap gap-1.5">
              {POPULAR_TECH_SUGGESTIONS.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => handleAddTechnology(sug)}
                  disabled={technologies.includes(sug)}
                  className={`rounded px-2 py-0.5 text-[10px] font-mono transition-colors ${
                    technologies.includes(sug)
                      ? "opacity-40 cursor-not-allowed bg-zinc-900 text-zinc-600"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Live Project URL <span className="text-zinc-500">(Opsional)</span>
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://myproject.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
            />
            {errors.project_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.project_url[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              GitHub / Repository URL <span className="text-zinc-500">(Opsional)</span>
            </label>
            <input
              type="url"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/firwanto/project"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:border-zinc-600 focus:outline-none"
            />
            {errors.repository_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.repository_url[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: PUBLICATION & DISPLAY ORDER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Visibilitas & Urutan Tampilan
          </h3>
          <p className="text-xs text-zinc-500">
            Status publikasi menentukan apakah proyek terlihat oleh pengunjung situs publik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Publication Status */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Status Publikasi <span className="text-rose-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            >
              {CONTENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-zinc-500">
              {status === "published"
                ? "🟢 Terlihat di website publik."
                : status === "draft"
                ? "🟡 Hanya terlihat di admin CMS."
                : "⚪ Diarsipkan."}
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Urutan Tampilan (Sort Order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Angka lebih kecil tampil lebih awal (0, 1, 2...).
            </p>
          </div>

          {/* Featured Toggle */}
          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-3 cursor-pointer pt-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500/20"
              />
              <div>
                <span className="text-xs font-medium text-zinc-200">
                  Featured Project ⭐
                </span>
                <p className="text-[11px] text-zinc-500">
                  Sorot di bagian utama portofolio
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FORM ACTIONS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <Link
          href="/admin/projects"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          ← Batal & Kembali
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending || isUploadingImage}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 transition-all hover:bg-white disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : mode === "create" ? (
              <span>Simpan Proyek Baru</span>
            ) : (
              <span>Perbarui Proyek</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

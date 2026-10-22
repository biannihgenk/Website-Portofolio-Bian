"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { deleteProjectAction } from "@/lib/actions/projects";

interface ProjectListTableProps {
  initialProjects: Project[];
  categories: string[];
}

export function ProjectListTable({
  initialProjects,
  categories,
}: ProjectListTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Deletion State
  const [isDeleting, startDeleteTransition] = useTransition();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Status filter
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && p.category !== categoryFilter) {
        return false;
      }
      // Search
      if (search.trim() !== "") {
        const q = search.toLowerCase();
        const matchTitleId = p.title_id.toLowerCase().includes(q);
        const matchTitleEn = p.title_en.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        return matchTitleId || matchTitleEn || matchSlug || matchCat;
      }
      return true;
    });
  }, [projects, search, statusFilter, categoryFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (!projectToDelete) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      const res = await deleteProjectAction(projectToDelete.id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        setProjectToDelete(null);
      } else {
        setDeleteError(res.error || "Gagal menghapus proyek.");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* FILTER & SEARCH BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari berdasarkan judul, slug, atau kategori..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status & Category Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none max-w-[170px]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {(search || statusFilter !== "all" || categoryFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setCurrentPage(1);
                }}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1"
                title="Reset semua filter"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            Menampilkan <strong className="text-zinc-300">{filteredProjects.length}</strong> dari{" "}
            {projects.length} total proyek
          </span>
          {isDeleting && (
            <span className="text-rose-400 font-medium animate-pulse">
              Menghapus proyek dari database...
            </span>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PROJECTS TABLE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 mb-3 text-xl">
            💼
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {projects.length === 0 ? "Belum Ada Proyek di Database" : "Tidak Ada Proyek yang Cocok"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            {projects.length === 0
              ? "Tabel public.projects siap. Tambahkan proyek pertamamu untuk memulai mengisi portofolio."
              : "Ubah kata kunci pencarian atau bersihkan filter untuk menampilkan data kembali."}
          </p>
          {projects.length === 0 && (
            <div className="mt-4">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white transition-colors"
              >
                <span>+ Buat Proyek Pertama</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Proyek</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Urutan</th>
                <th className="px-4 py-3 font-semibold">Diperbarui</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {paginatedProjects.map((p) => {
                const coverUrl = p.cover_image_path ? getStoragePublicUrl(p.cover_image_path) : null;

                return (
                  <tr key={p.id} className="group hover:bg-zinc-800/30 transition-colors">
                    {/* Thumbnail + Title + Slug */}
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={p.title_id}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-zinc-600 text-xs">No Cover</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-100 truncate block max-w-xs">
                              {p.title_id}
                            </span>
                            {p.is_featured && (
                              <span
                                className="text-amber-400 text-xs shrink-0"
                                title="Featured Project"
                              >
                                ⭐
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500 block truncate">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 font-sans text-zinc-300">
                      <span className="rounded bg-zinc-800/70 border border-zinc-700/60 px-2 py-0.5 text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    {/* Development Stage */}
                    <td className="px-4 py-3 font-sans">
                      <span className="text-[11px] text-zinc-400 capitalize">
                        {p.project_status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Publication Status */}
                    <td className="px-4 py-3 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : p.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            p.status === "published"
                              ? "bg-emerald-400"
                              : p.status === "draft"
                              ? "bg-amber-400"
                              : "bg-zinc-500"
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>

                    {/* Sort Order */}
                    <td className="px-4 py-3 text-zinc-400 text-xs font-mono">
                      {p.sort_order}
                    </td>

                    {/* Updated At */}
                    <td className="px-4 py-3 text-zinc-500 text-[11px] whitespace-nowrap">
                      {new Date(p.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(p)}
                          className="rounded-md border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:border-rose-900/50 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900/40 text-xs">
              <span className="text-zinc-500">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isDeleting && setProjectToDelete(null)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                ⚠️
              </span>
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  Hapus Proyek Secara Permanen?
                </h3>
                <p className="text-xs text-zinc-400">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800 text-xs space-y-1">
              <p className="font-semibold text-zinc-200">{projectToDelete.title_id}</p>
              <p className="text-zinc-500 font-mono">Slug: /{projectToDelete.slug}</p>
              <p className="text-zinc-500">Kategori: {projectToDelete.category}</p>
            </div>

            {deleteError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900/50">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

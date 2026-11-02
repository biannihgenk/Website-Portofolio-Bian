"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost, BlogCategory } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { deleteBlogPostAction } from "@/lib/actions/blog";

interface BlogPostListTableProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export function BlogPostListTable({ initialPosts, categories }: BlogPostListTableProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isDeleting, startDeleteTransition] = useTransition();
  const [itemToDelete, setItemToDelete] = useState<BlogPost | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name_id));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false;
      if (categoryFilter !== "all" && post.category_id !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          post.title_id.toLowerCase().includes(q) ||
          post.title_en.toLowerCase().includes(q) ||
          post.slug.toLowerCase().includes(q) ||
          post.excerpt_id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [posts, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      const res = await deleteBlogPostAction(itemToDelete.id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== itemToDelete.id));
        setItemToDelete(null);
      } else {
        setDeleteError(res.error || "Gagal menghapus artikel.");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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
              placeholder="Cari berdasarkan judul, slug, atau ringkasan..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>

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
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="text-3xl mb-3">✍️</div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {posts.length === 0 ? "Belum Ada Artikel Blog" : "Tidak Ada Data yang Cocok"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            Mulai tulis artikel, catatan teknis, atau pemikiran industri untuk blog portofolio Anda.
          </p>
          {posts.length === 0 && (
            <div className="mt-4">
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white"
              >
                + Tulis Artikel Baru
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Artikel</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Estimasi Baca</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {paginated.map((post) => {
                const coverUrl = post.cover_image_path
                  ? getStoragePublicUrl(post.cover_image_path)
                  : null;
                const categoryName = post.category_id ? categoryMap.get(post.category_id) : null;

                return (
                  <tr key={post.id} className="group hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 rounded border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center">
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={post.title_id}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-zinc-600 text-[10px]">No Cover</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-100 block">{post.title_id}</span>
                            {post.is_featured && (
                              <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-medium text-amber-300 border border-amber-500/20">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500">/{post.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      {categoryName ? (
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">
                          {categoryName}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs font-mono">
                      {post.reading_time_minutes ? `${post.reading_time_minutes} min` : "—"}
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : post.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="rounded border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(post)}
                          className="rounded border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-300"
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
          <span>
            Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} artikel
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="font-mono text-zinc-400">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isDeleting && setItemToDelete(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-100">
              Hapus Artikel Blog Secara Permanen?
            </h3>
            <p className="text-xs text-zinc-400">
              {itemToDelete.title_id} (/{itemToDelete.slug})
            </p>
            {deleteError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900/50">
                {deleteError}
              </p>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

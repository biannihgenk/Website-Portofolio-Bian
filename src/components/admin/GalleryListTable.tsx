"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { GalleryItem } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { deleteGalleryItemAction } from "@/lib/actions/gallery";

interface GalleryListTableProps {
  initialItems: GalleryItem[];
  categories: string[];
}

export function GalleryListTable({ initialItems, categories }: GalleryListTableProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isDeleting, startDeleteTransition] = useTransition();
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.caption_id?.toLowerCase().includes(q) ?? false) ||
          (item.caption_en?.toLowerCase().includes(q) ?? false) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      const res = await deleteGalleryItemAction(itemToDelete.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        setItemToDelete(null);
      } else {
        setDeleteError(res.error || "Gagal menghapus item galeri.");
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
              placeholder="Cari berdasarkan judul, takarir (caption), atau kategori..."
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
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="text-3xl mb-3">🖼️</div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {items.length === 0 ? "Belum Ada Item Galeri" : "Tidak Ada Data yang Cocok"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            Unggah foto dokumentasi kegiatan, fotografi, atau karya visual Anda.
          </p>
          {items.length === 0 && (
            <div className="mt-4">
              <Link
                href="/admin/gallery/new"
                className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white"
              >
                + Tambah Foto Galeri
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((item) => {
            const imgUrl = getStoragePublicUrl(item.image_path);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-700"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={item.alt_text || item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-600 text-xs font-mono">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                        item.status === "published"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                          : item.status === "draft"
                          ? "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                          : "bg-zinc-900/80 text-zinc-400 border border-zinc-700/50"
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.is_featured && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-medium text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-zinc-300">
                        {item.category}
                      </span>
                      {item.captured_at && (
                        <span>{item.captured_at}</span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-100 line-clamp-1">
                      {item.title}
                    </h4>
                    {item.caption_id && (
                      <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
                        {item.caption_id}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/60">
                    <Link
                      href={`/admin/gallery/${item.id}/edit`}
                      className="rounded border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="rounded border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-300"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
          <span>
            Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} foto
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
              Hapus Item Galeri Secara Permanen?
            </h3>
            <p className="text-xs text-zinc-400">
              {itemToDelete.title} ({itemToDelete.category})
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

"use client";

import React, { useState, useTransition } from "react";
import type { BlogCategory } from "@/types/content";
import {
  createBlogCategoryAction,
  updateBlogCategoryAction,
  deleteBlogCategoryAction,
} from "@/lib/actions/blog";

interface BlogCategoryManagerProps {
  initialCategories: BlogCategory[];
}

export function BlogCategoryManager({ initialCategories }: BlogCategoryManagerProps) {
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [itemToDelete, setItemToDelete] = useState<BlogCategory | null>(null);

  const handleGenerateSlug = (source: string) => {
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

  const handleStartEdit = (cat: BlogCategory) => {
    setEditingId(cat.id);
    setNameId(cat.name_id);
    setNameEn(cat.name_en);
    setSlug(cat.slug);
    setSortOrder(cat.sort_order);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNameId("");
    setNameEn("");
    setSlug("");
    setSortOrder(0);
    setErrorMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name_id", nameId);
      formData.append("name_en", nameEn);
      formData.append("slug", slug);
      formData.append("sort_order", sortOrder.toString());

      if (editingId) {
        const res = await updateBlogCategoryAction(editingId, {}, formData);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingId
                ? { ...c, name_id: nameId, name_en: nameEn, slug, sort_order: sortOrder }
                : c
            )
          );
          setSuccessMsg("Kategori berhasil diperbarui.");
          handleCancelEdit();
        } else {
          setErrorMsg(res.message || "Gagal memperbarui kategori.");
        }
      } else {
        const res = await createBlogCategoryAction({}, formData);
        if (res.success && res.categoryId) {
          setCategories((prev) => [
            ...prev,
            {
              id: res.categoryId!,
              name_id: nameId,
              name_en: nameEn,
              slug,
              sort_order: sortOrder,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
          setSuccessMsg("Kategori baru berhasil ditambahkan.");
          handleCancelEdit();
        } else {
          setErrorMsg(res.message || "Gagal membuat kategori.");
        }
      }
    });
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setErrorMsg(null);

    startTransition(async () => {
      const res = await deleteBlogCategoryAction(itemToDelete.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        setItemToDelete(null);
        setSuccessMsg("Kategori berhasil dihapus.");
      } else {
        setErrorMsg(res.error || "Gagal menghapus kategori.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Category List */}
      <div className="lg:col-span-2 space-y-4">
        {successMsg && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            {successMsg}
          </div>
        )}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100">
              Daftar Kategori ({categories.length})
            </h3>
            <span className="text-xs text-zinc-500">Urutan & Slug</span>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-500">
              Belum ada kategori artikel. Buat kategori pertama menggunakan formulir di samping.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama (ID / EN)</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Urutan</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <span className="font-semibold text-zinc-200 block">{cat.name_id}</span>
                      <span className="text-xs text-zinc-400">{cat.name_en}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs font-mono">
                      /{cat.slug}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs font-mono">
                      {cat.sort_order}
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="rounded border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(cat)}
                          className="rounded border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-300"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Sidebar */}
      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
            {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
          </h3>

          {errorMsg && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Nama (Bahasa Indonesia) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={nameId}
                onChange={(e) => {
                  setNameId(e.target.value);
                  if (!editingId && !slug) {
                    handleGenerateSlug(e.target.value);
                  }
                }}
                placeholder="Contoh: Rekayasa Perangkat Lunak"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Nama (English) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Contoh: Software Engineering"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-zinc-300">
                  Slug URL <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleGenerateSlug(nameId || nameEn)}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200"
                >
                  Generate
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="software-engineering"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-zinc-100 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Urutan Tampilan
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400 hover:bg-zinc-800"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-zinc-100 px-4 py-2 font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
              >
                {isPending
                  ? "Menyimpan..."
                  : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Kategori"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isPending && setItemToDelete(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-100">
              Hapus Kategori Blog?
            </h3>
            <p className="text-xs text-zinc-400">
              Kategori &quot;{itemToDelete.name_id}&quot; akan dihapus. Artikel yang terkait akan di-set menjadi tanpa kategori.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setItemToDelete(null)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

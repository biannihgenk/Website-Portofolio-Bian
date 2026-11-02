"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/types/content";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { deleteMediaAction } from "@/lib/actions/media";
import { MediaUploader } from "@/components/admin/MediaUploader";

type UploadFolder = "projects" | "achievements" | "education" | "gallery" | "blog" | "general";

interface MediaLibraryManagerProps {
  initialAssets: MediaAsset[];
  total: number;
}

export function MediaLibraryManager({ initialAssets, total }: MediaLibraryManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaAsset | null>(null);

  // Folder for quick upload
  const [uploadFolder, setUploadFolder] = useState<UploadFolder>("general");

  const filtered = assets.filter((asset) => {
    if (selectedFolder !== "all") {
      if (!asset.storage_path.startsWith(`${selectedFolder}/`)) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        asset.original_filename.toLowerCase().includes(q) ||
        asset.storage_path.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyUrl = (path: string) => {
    const url = getStoragePublicUrl(path);
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      const res = await deleteMediaAction(itemToDelete.storage_path);
      if (res.success) {
        setAssets((prev) => prev.filter((a) => a.id !== itemToDelete.id));
        if (selectedAsset?.id === itemToDelete.id) {
          setSelectedAsset(null);
        }
        setItemToDelete(null);
      } else {
        setDeleteError(res.error || "Gagal menghapus file media.");
      }
    });
  };

  const handleUploadComplete = (newPath: string) => {
    // When an upload finishes, add placeholder asset to state
    const newAsset: MediaAsset = {
      id: "new-" + Date.now(),
      storage_path: newPath,
      original_filename: newPath.split("/").pop() || newPath,
      mime_type: "image/*",
      size_bytes: 0,
      alt_text: null,
      created_at: new Date().toISOString(),
    };
    setAssets((prev) => [newAsset, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Unggah Media Langsung ke Storage
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Bucket: <code className="font-mono text-zinc-300">portfolio-public</code> (Maks 5 MB)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 mr-2 font-mono">
              Total {total} berkas
            </span>
            <label className="text-xs text-zinc-400">Direktori Tujuan:</label>
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value as UploadFolder)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="general">general/</option>
              <option value="projects">projects/</option>
              <option value="achievements">achievements/</option>
              <option value="education">education/</option>
              <option value="gallery">gallery/</option>
              <option value="blog">blog/</option>
            </select>
          </div>
        </div>

        <MediaUploader
          key={uploadFolder}
          value={null}
          onChange={(path) => path && handleUploadComplete(path)}
          folder={uploadFolder}
          label="Pilih File Media"
          description="Format: JPG, PNG, WebP, AVIF."
        />
      </div>

      {/* Filter and Search */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama file atau path storage..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none"
            >
              <option value="all">Semua Folder</option>
              <option value="projects">projects/</option>
              <option value="achievements">achievements/</option>
              <option value="education">education/</option>
              <option value="gallery">gallery/</option>
              <option value="blog">blog/</option>
              <option value="profiles">profiles/</option>
              <option value="general">general/</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="text-3xl mb-3">📁</div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {assets.length === 0 ? "Belum Ada Media di Storage" : "Tidak Ada Media yang Cocok"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            Gunakan pengunggah di atas untuk menambahkan aset visual ke pustaka.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((asset) => {
            const publicUrl = getStoragePublicUrl(asset.storage_path);
            const isCopied = copiedPath === asset.storage_path;

            return (
              <div
                key={asset.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-700"
              >
                <div
                  className="relative aspect-square w-full cursor-pointer bg-zinc-950 overflow-hidden flex items-center justify-center"
                  onClick={() => setSelectedAsset(asset)}
                >
                  {publicUrl ? (
                    <Image
                      src={publicUrl}
                      alt={asset.original_filename}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-zinc-600 text-xs font-mono">No Preview</span>
                  )}
                </div>

                <div className="p-2 space-y-1">
                  <p className="text-[11px] font-medium text-zinc-200 truncate" title={asset.original_filename}>
                    {asset.original_filename}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500 truncate" title={asset.storage_path}>
                    {asset.storage_path}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset.storage_path)}
                      className={`text-[10px] font-medium ${
                        isCopied ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {isCopied ? "✓ Disalin" : "Salin URL"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(asset)}
                      className="text-[10px] text-zinc-500 hover:text-rose-400"
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

      {/* Details Viewer Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedAsset(null)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-semibold text-zinc-100 truncate">
                {selectedAsset.original_filename}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-lg bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center">
              {(() => {
                const selUrl = getStoragePublicUrl(selectedAsset.storage_path);
                return selUrl ? (
                  <Image
                    src={selUrl}
                    alt={selectedAsset.original_filename}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-zinc-600 font-mono">No Image</span>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-zinc-400 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
              <div>
                <span className="text-zinc-600 block text-[10px]">STORAGE PATH</span>
                <span className="text-zinc-200 truncate block">{selectedAsset.storage_path}</span>
              </div>
              <div>
                <span className="text-zinc-600 block text-[10px]">UKURAN FILE</span>
                <span className="text-zinc-200">
                  {selectedAsset.size_bytes > 0
                    ? `${(selectedAsset.size_bytes / 1024).toFixed(1)} KB`
                    : "—"}
                </span>
              </div>
              <div>
                <span className="text-zinc-600 block text-[10px]">TIPE MIME</span>
                <span className="text-zinc-200">{selectedAsset.mime_type}</span>
              </div>
              <div>
                <span className="text-zinc-600 block text-[10px]">DIUNGGAH PADA</span>
                <span className="text-zinc-200">
                  {selectedAsset.created_at ? selectedAsset.created_at.slice(0, 10) : "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(selectedAsset.storage_path)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-200 hover:bg-zinc-800"
              >
                {copiedPath === selectedAsset.storage_path ? "✓ URL Berhasil Disalin" : "Salin Public URL"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setItemToDelete(selectedAsset);
                }}
                className="rounded-lg bg-rose-950/60 border border-rose-800/50 px-4 py-2 text-xs text-rose-300 hover:bg-rose-900/80"
              >
                Hapus File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isDeleting && setItemToDelete(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-100">
              Hapus File dari Storage?
            </h3>
            <p className="text-xs text-zinc-400">
              Path: <code className="font-mono text-zinc-300">{itemToDelete.storage_path}</code>
            </p>
            <p className="text-[11px] text-zinc-500">
              Sistem akan memverifikasi bahwa file ini tidak sedang digunakan oleh proyek, artikel blog, galeri, atau riwayat pendidikan aktif.
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
                {isDeleting ? "Menghapus..." : "Ya, Hapus File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

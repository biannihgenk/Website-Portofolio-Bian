import Link from "next/link";
import { getAdminGalleryItems } from "@/lib/content/queries";
import { GalleryListTable } from "@/components/admin/GalleryListTable";
import { GALLERY_CATEGORIES } from "@/lib/validations/gallery";
import type { GalleryItem } from "@/types/content";

export default async function AdminGalleryPage() {
  let items: GalleryItem[] = [];
  let errorMsg: string | null = null;

  try {
    items = await getAdminGalleryItems();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat galeri.";
  }

  // Collect distinct categories from both defaults and existing items
  const itemCats = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);
  const allCategories = Array.from(new Set([...GALLERY_CATEGORIES, ...itemCats]));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
              Admin
            </Link>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-300">Gallery</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Galeri Media & Foto
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Kelola dokumentasi visual, fotografi, dan portofolio visual interaktif.
          </p>
        </div>

        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white transition-colors"
        >
          + Tambah Foto
        </Link>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Gagal Memuat Galeri</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : (
        <GalleryListTable initialItems={items} categories={allCategories} />
      )}
    </div>
  );
}

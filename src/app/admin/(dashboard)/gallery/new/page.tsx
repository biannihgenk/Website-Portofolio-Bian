import Link from "next/link";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default function NewGalleryItemPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <Link href="/admin/gallery" className="text-xs text-zinc-500 hover:text-zinc-300">
            Gallery
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Baru</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Tambah Foto Galeri
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Unggah foto baru ke storage bucket `portfolio-public` dan atur takarir serta kategori.
        </p>
      </div>

      <GalleryForm mode="create" />
    </div>
  );
}

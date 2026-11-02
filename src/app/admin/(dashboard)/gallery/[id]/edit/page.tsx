import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminGalleryItemById } from "@/lib/content/queries";
import { GalleryForm } from "@/components/admin/GalleryForm";

export const dynamic = "force-dynamic";

interface AdminEditGalleryItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditGalleryItemPage({
  params,
}: AdminEditGalleryItemPageProps) {
  const { id } = await params;
  const item = await getAdminGalleryItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
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
          <span className="text-xs text-zinc-300">Edit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Edit Foto Galeri: {item.title}
        </h1>
        <p className="mt-1 text-xs text-zinc-400 font-mono">
          ID: {item.id} • Kategori: {item.category}
        </p>
      </div>

      <GalleryForm item={item} mode="edit" />
    </div>
  );
}

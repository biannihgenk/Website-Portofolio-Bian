import Link from "next/link";
import { getAdminMediaAssets } from "@/lib/content/queries";
import { MediaLibraryManager } from "@/components/admin/MediaLibraryManager";
import type { MediaAsset } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  let assets: MediaAsset[] = [];
  let total = 0;
  let errorMsg: string | null = null;

  try {
    const res = await getAdminMediaAssets({ page: 1, pageSize: 60 });
    assets = res.data;
    total = res.total;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat pustaka media.";
  }


  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Media</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Pustaka Media & Storage
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Kelola berkas gambar yang tersimpan di bucket Supabase Storage <code>portfolio-public</code>.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Gagal Memuat Media</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : (
        <MediaLibraryManager initialAssets={assets} total={total} />
      )}
    </div>
  );
}

import Link from "next/link";
import { getAdminSiteSettings } from "@/lib/content/queries";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import type { SiteSetting } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: SiteSetting[] = [];
  let errorMsg: string | null = null;

  try {
    settings = await getAdminSiteSettings();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat pengaturan situs.";
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Settings</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Pengaturan Situs & SEO
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Konfigurasi identitas portofolio, metadata mesin pencari, kontak, dan tautan sosial.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Gagal Memuat Pengaturan</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : (
        <SiteSettingsManager initialSettings={settings} />
      )}
    </div>
  );
}

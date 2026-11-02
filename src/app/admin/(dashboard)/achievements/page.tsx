import Link from "next/link";
import {
  getAdminAchievements,
  getDistinctAchievementCategories,
} from "@/lib/content/queries";
import { AchievementListTable } from "@/components/admin/AchievementListTable";
import type { Achievement } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  let items: Achievement[] = [];
  let categories: string[] = [];
  let errorMsg: string | null = null;

  try {
    const [fetchedItems, fetchedCategories] = await Promise.all([
      getAdminAchievements(),
      getDistinctAchievementCategories(),
    ]);
    items = fetchedItems;
    categories = fetchedCategories;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat data penghargaan.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
              Admin
            </Link>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-300">Achievements</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Penghargaan & Sertifikasi
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola piagam kompetisi, sertifikasi profesional, dan kehormatan akademik.
          </p>
        </div>

        <div>
          <Link
            href="/admin/achievements/new"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white transition-colors"
          >
            + Penghargaan Baru
          </Link>
        </div>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Database Notice</p>
          <p className="mt-1 text-xs text-rose-300/80">{errorMsg}</p>
        </div>
      ) : (
        <AchievementListTable
          initialAchievements={items}
          categories={categories}
        />
      )}
    </div>
  );
}

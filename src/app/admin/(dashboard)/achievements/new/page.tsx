import Link from "next/link";
import { AchievementForm } from "@/components/admin/AchievementForm";

export const dynamic = "force-dynamic";

export default function AdminNewAchievementPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <Link href="/admin/achievements" className="text-xs text-zinc-500 hover:text-zinc-300">
            Achievements
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">New</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Tambah Penghargaan Baru
        </h1>
      </div>

      <AchievementForm mode="create" />
    </div>
  );
}

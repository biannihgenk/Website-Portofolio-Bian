import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAchievementById } from "@/lib/content/queries";
import { AchievementForm } from "@/components/admin/AchievementForm";

export const dynamic = "force-dynamic";

interface AdminEditAchievementPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditAchievementPage({
  params,
}: AdminEditAchievementPageProps) {
  const { id } = await params;
  const achievement = await getAdminAchievementById(id);

  if (!achievement) {
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
          <Link href="/admin/achievements" className="text-xs text-zinc-500 hover:text-zinc-300">
            Achievements
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Edit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Edit Penghargaan: {achievement.title_id}
        </h1>
        <p className="mt-1 text-xs text-zinc-400 font-mono">
          ID: {achievement.id} • Slug: /{achievement.slug}
        </p>
      </div>

      <AchievementForm achievement={achievement} mode="edit" />
    </div>
  );
}

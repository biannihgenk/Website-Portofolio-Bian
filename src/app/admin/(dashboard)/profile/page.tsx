import Link from "next/link";
import { getProfile } from "@/lib/content/queries";
import { ProfileForm } from "@/components/admin/ProfileForm";
import type { Profile } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  let profile: Profile | null = null;
  let errorMsg: string | null = null;

  try {
    profile = await getProfile();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat data profil dari database.";
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
              Admin
            </Link>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-300">Profile</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Manajemen Profil & Bio
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola identitas publik, biografi dwibahasa, avatar, dan tautan sosial di tabel <code className="font-mono text-zinc-300">public.profiles</code>.
          </p>
        </div>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Database Notice</p>
          <p className="mt-1 text-xs text-rose-300/80">{errorMsg}</p>
        </div>
      ) : (
        <ProfileForm profile={profile} />
      )}
    </div>
  );
}

import Link from "next/link";
import { getProfile } from "@/lib/content/queries";
import type { Profile } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  let profile: Profile | null = null;
  let errorMsg: string | null = null;

  try {
    profile = await getProfile();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Failed to load profile record";
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Profile</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Personal Profile & Bio
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Core biographical data stored in <code className="font-mono text-zinc-300">public.profiles</code>.
        </p>
      </div>

      {/* Scope Limit Notice */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-xs text-zinc-400">
        <p className="font-semibold text-zinc-200">📌 Read-Only Placeholder Stage</p>
        <p className="mt-1">
          This page displays database-persisted profile information. Full CRUD and image upload editing forms will be introduced with Google Stitch designs in subsequent phases.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-medium">Database Error</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : !profile ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <div className="text-3xl mb-3">👤</div>
          <h3 className="text-base font-semibold text-zinc-200">No Profile Record Found</h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            Table <code className="font-mono text-zinc-400">public.profiles</code> is initialized and RLS policies are active. No record has been inserted yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Profile Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-3 border-b border-zinc-800">
              Identity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block">Full Name</span>
                <span className="text-zinc-200 font-medium">{profile.full_name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Nickname</span>
                <span className="text-zinc-200 font-medium">{profile.nickname ?? "—"}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-zinc-500 block">Headline</span>
                <span className="text-zinc-200 font-medium">{profile.headline ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Location</span>
                <span className="text-zinc-200 font-medium">{profile.location ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Public Email</span>
                <span className="text-zinc-200 font-mono">{profile.email_public ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">School / University</span>
                <span className="text-zinc-200">{profile.school ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Study Program</span>
                <span className="text-zinc-200">{profile.study_program ?? "—"}</span>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-3 border-b border-zinc-800">
              Online Profiles & Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block">GitHub</span>
                <span className="text-zinc-300 truncate block">{profile.github_url ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">LinkedIn</span>
                <span className="text-zinc-300 truncate block">{profile.linkedin_url ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Instagram</span>
                <span className="text-zinc-300 truncate block">{profile.instagram_url ?? "—"}</span>
              </div>
            </div>
          </div>

          {/* Bio Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Bio (Indonesian)
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {profile.bio_id ?? "Belum ada bio bahasa Indonesia."}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Bio (English)
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {profile.bio_en ?? "No English bio provided."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

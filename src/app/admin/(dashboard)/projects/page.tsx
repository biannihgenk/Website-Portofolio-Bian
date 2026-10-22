import Link from "next/link";
import {
  getAdminProjects,
  getDistinctProjectCategories,
} from "@/lib/content/queries";
import { ProjectListTable } from "@/components/admin/ProjectListTable";
import type { Project } from "@/types/content";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  let projects: Project[] = [];
  let categories: string[] = [];
  let errorMsg: string | null = null;

  try {
    const [fetchedProjects, fetchedCategories] = await Promise.all([
      getAdminProjects(),
      getDistinctProjectCategories(),
    ]);
    projects = fetchedProjects;
    categories = fetchedCategories;
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat data proyek dari database.";
  }

  return (
    <div className="space-y-6">
      {/* Top Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
              Admin
            </Link>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-300">Projects</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Manajemen Proyek Portofolio
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola karya rekayasa perangkat lunak, deskripsi bilingual, dan aset media portofolio.
          </p>
        </div>

        <div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white shadow-sm"
          >
            <span>+ Proyek Baru</span>
          </Link>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Database Notice</p>
          <p className="mt-1 text-xs text-rose-300/80">{errorMsg}</p>
        </div>
      ) : (
        <ProjectListTable
          initialProjects={projects}
          categories={categories}
        />
      )}
    </div>
  );
}

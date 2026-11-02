import Link from "next/link";
import { getAdminEducation } from "@/lib/content/queries";
import { EducationListTable } from "@/components/admin/EducationListTable";
import type { Education } from "@/types/content";

export default async function AdminEducationPage() {
  let records: Education[] = [];
  let errorMsg: string | null = null;

  try {
    records = await getAdminEducation();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Gagal memuat data pendidikan.";
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
              Admin
            </Link>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-300">Education</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Riwayat Pendidikan
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Kelola latar belakang pendidikan formal, sertifikasi keahlian, dan pelatihan.
          </p>
        </div>

        <Link
          href="/admin/education/new"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-white transition-colors"
        >
          + Tambah Riwayat
        </Link>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <p className="font-semibold text-rose-200">Gagal Memuat Data</p>
          <p className="mt-1 text-xs text-rose-400/80">{errorMsg}</p>
        </div>
      ) : (
        <EducationListTable initialEducation={records} />
      )}
    </div>
  );
}

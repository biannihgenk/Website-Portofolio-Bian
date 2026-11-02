import Link from "next/link";
import { EducationForm } from "@/components/admin/EducationForm";

export default function NewEducationPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <Link href="/admin/education" className="text-xs text-zinc-500 hover:text-zinc-300">
            Education
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Baru</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Tambah Riwayat Pendidikan
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Masukkan informasi institusi, jenjang/jurusan, periode studi, dan kredensial.
        </p>
      </div>

      <EducationForm mode="create" />
    </div>
  );
}

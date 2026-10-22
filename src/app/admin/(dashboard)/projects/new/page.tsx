import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default function AdminNewProjectPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <Link href="/admin/projects" className="text-xs text-zinc-500 hover:text-zinc-300">
            Projects
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">New</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Tambah Proyek Baru
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Lengkapi detail proyek, ringkasan dwibahasa, teknologi, dan gambar cover.
        </p>
      </div>

      {/* Project Form in Create Mode */}
      <ProjectForm mode="create" />
    </div>
  );
}

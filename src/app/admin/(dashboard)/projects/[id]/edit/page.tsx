import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminProjectById } from "@/lib/content/queries";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

interface AdminEditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

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
          <span className="text-xs text-zinc-300">Edit</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Edit Proyek: {project.title_id}
          </h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium font-mono ${
              project.status === "published"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : project.status === "draft"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {project.status}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400 font-mono">
          ID: {project.id} • Slug: /{project.slug}
        </p>
      </div>

      {/* Project Form in Edit Mode */}
      <ProjectForm project={project} mode="edit" />
    </div>
  );
}

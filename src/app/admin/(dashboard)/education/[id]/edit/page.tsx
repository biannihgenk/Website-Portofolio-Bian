import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminEducationById } from "@/lib/content/queries";
import { EducationForm } from "@/components/admin/EducationForm";

export const dynamic = "force-dynamic";

interface AdminEditEducationPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditEducationPage({
  params,
}: AdminEditEducationPageProps) {
  const { id } = await params;
  const education = await getAdminEducationById(id);

  if (!education) {
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
          <Link href="/admin/education" className="text-xs text-zinc-500 hover:text-zinc-300">
            Education
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Edit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Edit Riwayat: {education.institution}
        </h1>
        <p className="mt-1 text-xs text-zinc-400 font-mono">
          ID: {education.id} {education.program ? `• ${education.program}` : ""}
        </p>
      </div>

      <EducationForm education={education} mode="edit" />
    </div>
  );
}

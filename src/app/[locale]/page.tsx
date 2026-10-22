import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/content/queries";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { Project } from "@/types/content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("meta");

  // Fetch only published projects from Supabase database (RLS enforced)
  let publishedProjects: Project[] = [];
  try {
    publishedProjects = await getProjects({ limit: 6 });
  } catch {
    publishedProjects = [];
  }

  const isId = locale === "id";

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 sm:p-12 max-w-6xl mx-auto space-y-12">
      {/* Hero / Intro */}
      <section className="text-center space-y-4 pt-12">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          Debian Firwanto • Software Engineer
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100">
          {t("siteTitle")}
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {t("siteDescription")}
        </p>
      </section>

      {/* Published Projects Section */}
      {publishedProjects.length > 0 ? (
        <section className="w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-100">
                {isId ? "Proyek Pilihan" : "Featured Projects"}
              </h2>
              <p className="text-xs text-zinc-500">
                {isId
                  ? "Karya rekayasa perangkat lunak dan arsitektur sistem"
                  : "Software engineering case studies and systems"}
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {publishedProjects.length} {isId ? "proyek" : "projects"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProjects.map((p) => {
              const title = isId ? p.title_id : p.title_en;
              const summary = isId ? p.summary_id : p.summary_en;
              const coverUrl = p.cover_image_path ? getStoragePublicUrl(p.cover_image_path) : null;
              const techs = Array.isArray(p.technologies) ? (p.technologies as string[]) : [];

              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden flex flex-col justify-between transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="aspect-video relative w-full bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-center">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs text-zinc-600 font-mono">No Cover</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="rounded bg-zinc-800 px-2 py-0.5 font-medium text-zinc-300">
                          {p.category}
                        </span>
                        {p.is_featured && (
                          <span className="text-amber-400 font-mono text-xs">⭐ Featured</span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-zinc-100">{title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {summary}
                      </p>

                      {/* Tech stack */}
                      {techs.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {techs.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Links Footer */}
                  <div className="p-5 pt-0 flex items-center gap-3 text-xs">
                    {p.project_url && (
                      <Link
                        href={p.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Live Demo ↗
                      </Link>
                    )}
                    {p.repository_url && (
                      <Link
                        href={p.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-200 font-mono"
                      >
                        Source Code ↗
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="text-center py-10">
          <p className="text-sm text-zinc-500">
            🏗️ {isId ? "Proyek publik akan segera ditampilkan." : "Public projects will be showcased here soon."}
          </p>
        </section>
      )}

      {/* Footer Info */}
      <footer className="w-full text-center text-xs text-zinc-600 border-t border-zinc-800/80 pt-6">
        <p>Debian Firwanto • Built with Next.js App Router, Supabase PostgreSQL & Storage</p>
      </footer>
    </main>
  );
}

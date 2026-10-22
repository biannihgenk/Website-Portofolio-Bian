import Link from "next/link";
import { getAdminStats } from "@/lib/content/queries";
import { getClientEnv, getServerEnv } from "@/lib/env";

export default async function AdminDashboardOverviewPage() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();

  // Safely attempt to fetch database statistics
  let stats: Awaited<ReturnType<typeof getAdminStats>> | null = null;
  let dbConnected = false;
  let dbErrorMessage: string | null = null;

  try {
    stats = await getAdminStats();
    dbConnected = true;
  } catch (err: unknown) {
    dbConnected = false;
    dbErrorMessage = err instanceof Error ? err.message : "Database connection pending configuration";
  }

  // Safe diagnostics (never expose secrets)
  const supabaseHost = (() => {
    try {
      return new URL(clientEnv.NEXT_PUBLIC_SUPABASE_URL).hostname;
    } catch {
      return "Invalid or unconfigured URL";
    }
  })();

  const diagnostics = [
    {
      name: "Supabase Endpoint",
      status: supabaseHost.includes("supabase.co") ? "Configured" : "Placeholder / Local",
      detail: supabaseHost,
      ok: true,
    },
    {
      name: "Anon / Publishable Key",
      status: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing",
      detail: "Client-safe token for RLS queries",
      ok: Boolean(clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
    {
      name: "Service Role Key",
      status: serverEnv.SUPABASE_SERVICE_ROLE_KEY ? "Present" : "Missing",
      detail: "Server-only elevated token",
      ok: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY),
    },
    {
      name: "Admin Allowlist",
      status: serverEnv.ADMIN_EMAIL_ALLOWLIST.length > 0 ? "Configured" : "Empty",
      detail: `${serverEnv.ADMIN_EMAIL_ALLOWLIST.length} allowed administrator(s)`,
      ok: serverEnv.ADMIN_EMAIL_ALLOWLIST.length > 0,
    },
    {
      name: "Database Connection",
      status: dbConnected ? "Online" : "Pending Credentials",
      detail: dbConnected ? "Connected and RLS active" : (dbErrorMessage ?? "Not reachable"),
      ok: dbConnected,
    },
  ];

  const modules = [
    {
      title: "Projects",
      description: "Portfolio showcases and engineering case studies",
      icon: "💼",
      href: "/admin/projects",
      stats: stats?.projects,
    },
    {
      title: "Blog",
      description: "Articles, technical notes, and updates",
      icon: "✍️",
      href: "/admin/blog",
      stats: stats?.blogPosts,
    },
    {
      title: "Gallery",
      description: "Visual assets, photographs, and event captures",
      icon: "🖼️",
      href: "/admin/gallery",
      stats: stats?.galleryItems,
    },
    {
      title: "Achievements",
      description: "Awards, certifications, and honors",
      icon: "🏆",
      href: "/admin/achievements",
      stats: stats?.achievements,
    },
    {
      title: "Education",
      description: "Academic history and formal qualifications",
      icon: "🎓",
      href: "/admin/education",
      count: stats?.educationCount,
    },
    {
      title: "Media Assets",
      description: "Supabase Storage files (portfolio-public)",
      icon: "📁",
      href: "/admin/media",
      count: stats?.mediaAssetsCount,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          System Overview & Diagnostics
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Infrastructure and Content Management Foundation v1.0
        </p>
      </div>

      {/* Diagnostics Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
          Environment & Connection Diagnostics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnostics.map((diag) => (
            <div
              key={diag.name}
              className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{diag.name}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    diag.ok
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {diag.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500 truncate" title={diag.detail}>
                {diag.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Content Modules
          </h3>
          <span className="text-xs text-zinc-500">
            Schema & Queries ready for Google Stitch UI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              href={mod.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mod.icon}</span>
                  <div>
                    <h4 className="font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{mod.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                {mod.stats ? (
                  <div className="flex gap-3 text-zinc-400">
                    <span>
                      <strong className="text-emerald-400 font-mono">
                        {mod.stats.published}
                      </strong>{" "}
                      published
                    </span>
                    <span>
                      <strong className="text-amber-400 font-mono">
                        {mod.stats.draft}
                      </strong>{" "}
                      draft
                    </span>
                  </div>
                ) : (
                  <span className="text-zinc-400">
                    <strong className="text-zinc-200 font-mono">{mod.count ?? 0}</strong>{" "}
                    records
                  </span>
                )}
                <span className="text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  Manage →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Information Banner */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 text-sm text-zinc-300">
        <h4 className="font-semibold text-blue-300 mb-1">
          📌 Infrastructure Foundation Notice
        </h4>
        <p className="text-xs leading-relaxed text-zinc-400">
          This admin shell provides server-side authorization, database types, SQL migrations,
          and public/private query modules per the PRD. Visual forms for editing content will be
          implemented incrementally from approved Google Stitch designs in subsequent phases.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  getAdminStats,
  getAdminRecentContent,
  type ModuleStatResult,
  type RecentContentItem,
} from "@/lib/content/queries";
import { getClientEnv, getServerEnv } from "@/lib/env";
import {
  IconProjects,
  IconAchievements,
  IconBlog,
  IconGallery,
  IconEducation,
  IconMedia,
  IconSettings,
  IconProfile,
  IconExternalLink,
} from "@/components/admin/AdminIcons";

export const dynamic = "force-dynamic";

interface SummaryCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  result: ModuleStatResult;
}

function SummaryCard({ title, description, href, icon: Icon, result }: SummaryCardProps) {
  const { stats, error } = result;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700/80 hover:bg-zinc-900/70">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-zinc-800/80 text-zinc-300">
              <Icon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
              <p className="text-[11px] text-zinc-500">{description}</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-4">
          {error ? (
            <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-3 text-xs text-rose-300">
              <p className="font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Query Failed
              </p>
              <p className="mt-1 text-[11px] text-rose-400/80 truncate" title={error}>
                {error}
              </p>
            </div>
          ) : !stats || stats.total === 0 ? (
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-zinc-400">0</span>
                <span className="text-xs text-zinc-500">items</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                Table initialized. No records created yet.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-zinc-100">
                  {stats.total}
                </span>
                <span className="text-xs text-zinc-500 font-medium">total records</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {stats.published} published
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/20 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {stats.draft} draft
                </span>
                {stats.archived > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400 font-mono">
                    {stats.archived} archived
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Link */}
      <div className="pt-3 border-t border-zinc-800/60">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <span>View module</span>
          <span className="text-zinc-600">→</span>
        </Link>
      </div>
    </div>
  );
}

export default async function AdminDashboardOverviewPage() {
  const clientEnv = getClientEnv();
  const serverEnv = getServerEnv();

  // Safely attempt to fetch database statistics & recent content
  let statsData: Awaited<ReturnType<typeof getAdminStats>> | null = null;
  let recentData: Awaited<ReturnType<typeof getAdminRecentContent>> | null = null;
  let generalError: string | null = null;

  try {
    const [stats, recent] = await Promise.all([
      getAdminStats(),
      getAdminRecentContent(),
    ]);
    statsData = stats;
    recentData = recent;
  } catch (err: unknown) {
    generalError = err instanceof Error ? err.message : "Database connection pending";
  }

  // Safe hostname detection (no secret exposure)
  const supabaseHost = (() => {
    try {
      return new URL(clientEnv.NEXT_PUBLIC_SUPABASE_URL).hostname;
    } catch {
      return "Configured Endpoint";
    }
  })();

  const recentItems: RecentContentItem[] = recentData?.items ?? [];

  return (
    <div className="space-y-8">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HEADER & GREETING */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Portfolio CMS Overview
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Database-driven administration panel and content statistics for Debian Firwanto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[200px]" title={supabaseHost}>
              {supabaseHost}
            </span>
          </div>
        </div>
      </div>

      {/* Global Connection Error banner if catastrophic fail */}
      {generalError && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
          <h3 className="font-semibold text-rose-200">Database Connection Notice</h3>
          <p className="mt-1 text-xs text-rose-300/80 leading-relaxed">
            {generalError}. Verify that Supabase credentials in your server environment are valid and that migrations have been applied.
          </p>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: PRIMARY SUMMARY CARDS (Projects, Achievements, Blog, Gallery) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Content Summary
            </h2>
            <p className="text-[11px] text-zinc-500">
              Live record counts fetched with server RLS authorization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard
            title="Projects"
            description="Engineering & design works"
            href="/admin/projects"
            icon={IconProjects}
            result={
              statsData
                ? statsData.projects
                : { stats: null, error: generalError ?? "Loading stats" }
            }
          />

          <SummaryCard
            title="Achievements"
            description="Certificates, honors & awards"
            href="/admin/achievements"
            icon={IconAchievements}
            result={
              statsData
                ? statsData.achievements
                : { stats: null, error: generalError ?? "Loading stats" }
            }
          />

          <SummaryCard
            title="Blog Posts"
            description="Articles & technical notes"
            href="/admin/blog"
            icon={IconBlog}
            result={
              statsData
                ? statsData.blogPosts
                : { stats: null, error: generalError ?? "Loading stats" }
            }
          />

          <SummaryCard
            title="Gallery Items"
            description="Visual assets & photographs"
            href="/admin/gallery"
            icon={IconGallery}
            result={
              statsData
                ? statsData.galleryItems
                : { stats: null, error: generalError ?? "Loading stats" }
            }
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: SECONDARY METRICS (Education, Media Assets, Settings, Profile) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Education Count */}
        <Link
          href="/admin/education"
          className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-zinc-200">
              <IconEducation className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] text-zinc-500 uppercase font-semibold tracking-wider block">
                Education
              </span>
              <span className="text-base font-bold font-mono text-zinc-200">
                {statsData?.education.error ? "Error" : statsData?.education.count ?? "0"}
              </span>
              <span className="text-[11px] text-zinc-500 ml-1">history records</span>
            </div>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
        </Link>

        {/* Media Assets Count */}
        <Link
          href="/admin/media"
          className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-zinc-200">
              <IconMedia className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] text-zinc-500 uppercase font-semibold tracking-wider block">
                Media Assets
              </span>
              <span className="text-base font-bold font-mono text-zinc-200">
                {statsData?.mediaAssets.error ? "Error" : statsData?.mediaAssets.count ?? "0"}
              </span>
              <span className="text-[11px] text-zinc-500 ml-1">storage files</span>
            </div>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
        </Link>

        {/* Profile Card */}
        <Link
          href="/admin/profile"
          className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-zinc-200">
              <IconProfile className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] text-zinc-500 uppercase font-semibold tracking-wider block">
                Profile & Bio
              </span>
              <span className="text-xs font-medium text-zinc-300">
                Debian Firwanto
              </span>
            </div>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
        </Link>

        {/* Site Settings Card */}
        <Link
          href="/admin/settings"
          className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-zinc-200">
              <IconSettings className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] text-zinc-500 uppercase font-semibold tracking-wider block">
                Site Settings
              </span>
              <span className="text-xs font-medium text-zinc-300">
                Key-Value Config
              </span>
            </div>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
        </Link>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: RECENT CONTENT ACTIVITY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
              Recent Content Activity
            </h2>
            <p className="text-[11px] text-zinc-500">
              Latest items created or updated across projects, blog, and achievements
            </p>
          </div>
          {recentItems.length > 0 && (
            <span className="text-xs font-mono text-zinc-500">
              Showing {recentItems.length} latest records
            </span>
          )}
        </div>

        {recentData?.error ? (
          <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 text-xs text-amber-300">
            <p className="font-semibold">Notice while fetching recent activity</p>
            <p className="mt-1 text-amber-400/80">{recentData.error}</p>
          </div>
        ) : recentItems.length === 0 ? (
          /* Empty State */
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 mb-3">
              <IconProjects className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">No Content Records Created</h3>
            <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              When projects, blog articles, or achievements are added to the database, their publication status and timestamps will appear here automatically.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/admin/projects"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Go to Projects →
              </Link>
              <Link
                href="/admin/blog"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Go to Blog →
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="pb-2.5 font-medium">Type</th>
                  <th className="pb-2.5 font-medium">Title</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium">Created</th>
                  <th className="pb-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {recentItems.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="group hover:bg-zinc-800/20">
                    <td className="py-3 pr-4">
                      <span className="inline-block rounded px-2 py-0.5 text-[10px] uppercase font-sans font-medium bg-zinc-800 text-zinc-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-sans font-medium text-zinc-200 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-sans font-medium ${
                          item.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-zinc-500 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={item.href}
                        className="text-xs font-sans text-zinc-400 hover:text-white transition-colors"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: ARCHITECTURE FOUNDATION & DIAGNOSTICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Access */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800">
            Authorization & Access Control
          </h3>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-center justify-between">
              <span>Allowlist Enforcement</span>
              <span className="font-mono text-zinc-300">
                {serverEnv.ADMIN_EMAIL_ALLOWLIST.length} permitted admin(s)
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Database Verification</span>
              <span className="font-mono text-emerald-400">public.admin_users</span>
            </li>
            <li className="flex items-center justify-between">
              <span>PostgreSQL RLS Functions</span>
              <span className="font-mono text-emerald-400">public.is_admin()</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Session Mechanism</span>
              <span className="font-mono text-zinc-300">@supabase/ssr HTTP Cookie</span>
            </li>
          </ul>
        </div>

        {/* Phase Scope Guidelines */}
        <div className="rounded-xl border border-blue-900/30 bg-blue-950/10 p-5 space-y-2 text-xs text-zinc-400">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-300 pb-2 border-b border-blue-900/40">
            📌 CMS Phase Boundary Notice
          </h3>
          <p className="leading-relaxed">
            The foundation layout, authorization barrier, database types, and live query pipelines are active. Visual CRUD editing forms (rich text editors, media uploaders, sorting) will be implemented in subsequent phases using approved Google Stitch designs.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium"
            >
              <span>Preview current public site</span>
              <IconExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

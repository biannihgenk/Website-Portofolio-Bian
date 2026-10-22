import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Projects", href: "/admin/projects", icon: "💼" },
  { label: "Blog", href: "/admin/blog", icon: "✍️" },
  { label: "Gallery", href: "/admin/gallery", icon: "🖼️" },
  { label: "Achievements", href: "/admin/achievements", icon: "🏆" },
  { label: "Education", href: "/admin/education", icon: "🎓" },
  { label: "Media Assets", href: "/admin/media", icon: "📁" },
  { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforces server-side authentication & single-admin authorization
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full border-b border-zinc-800 bg-zinc-900/60 p-4 md:w-64 md:border-b-0 md:border-r md:p-6 flex flex-col justify-between">
        <div>
          {/* Logo / Brand */}
          <div className="mb-6">
            <Link href="/admin" className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Debian Firwanto
              </span>
              <h1 className="text-lg font-bold text-zinc-100">CMS Admin</h1>
            </Link>
            <p className="mt-1 text-xs text-zinc-500">Infrastructure v1.0</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User profile & Sign out */}
        <div className="mt-8 border-t border-zinc-800 pt-4">
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-zinc-400">Authorized Admin</span>
            </div>
            <p className="truncate text-xs text-zinc-300 font-mono mt-1" title={user.email}>
              {user.email}
            </p>
          </div>

          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 md:p-10 bg-zinc-950">
        {children}
      </main>
    </div>
  );
}

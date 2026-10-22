import Link from "next/link";
import { getSiteSettings } from "@/lib/content/queries";
import type { SiteSetting } from "@/types/content";

export default async function AdminSettingsPage() {
  let settings: SiteSetting[] = [];
  let errorMsg = null;

  try {
    settings = await getSiteSettings();
  } catch (err: unknown) {
    errorMsg = err instanceof Error ? err.message : "Database connection pending";
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-300">Settings</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Site Configuration & Settings
        </h2>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-300">
          <p className="font-medium">Database Notice</p>
          <p className="mt-1 text-xs text-amber-400/80">{errorMsg}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200">Database Settings Key-Values</h3>
            <span className="text-xs text-zinc-500">{settings.length} key(s) configured</span>
          </div>

          {settings.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No custom settings rows in <code className="font-mono text-zinc-300">public.site_settings</code>. Default fallback configurations in <code className="font-mono text-zinc-300">src/lib/env.ts</code> are active.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800/60 font-mono text-xs">
              {settings.map((s) => (
                <div key={s.id} className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">{s.key}</span>
                  <span className="text-zinc-200">{JSON.stringify(s.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

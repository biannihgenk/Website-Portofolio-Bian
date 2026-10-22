import Link from "next/link";
import { getAdminMediaAssets } from "@/lib/content/queries";

export default async function AdminMediaPage() {
  let assetsData = null;
  let errorMsg = null;

  try {
    assetsData = await getAdminMediaAssets({ page: 1, pageSize: 20 });
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
          <span className="text-xs text-zinc-300">Media</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Media Assets & Storage
        </h2>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-zinc-400">
        <p className="font-medium text-blue-300">Storage Configuration</p>
        <p className="mt-1">
          Connected to bucket <code className="font-mono text-zinc-200">portfolio-public</code>. Allowed MIME types: JPEG, PNG, WebP, AVIF. Max file size: 5MB.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-300">
          <p className="font-medium">Database Notice</p>
          <p className="mt-1 text-xs text-amber-400/80">{errorMsg}</p>
        </div>
      ) : !assetsData || assetsData.data.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
          <div className="text-3xl mb-3">📁</div>
          <h3 className="text-base font-semibold text-zinc-200">No Media Uploaded Yet</h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">
            The media storage pipeline and metadata schema (`public.media_assets`) are established.
            Upload components will be added with the visual Stitch admin design.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Filename</th>
                <th className="px-4 py-3">Storage Path</th>
                <th className="px-4 py-3">MIME</th>
                <th className="px-4 py-3">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {assetsData.data.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-sans font-medium text-zinc-200">{a.original_filename}</td>
                  <td className="px-4 py-3 text-zinc-400">{a.storage_path}</td>
                  <td className="px-4 py-3 text-zinc-400">{a.mime_type}</td>
                  <td className="px-4 py-3 text-zinc-400">{(a.size_bytes / 1024).toFixed(1)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

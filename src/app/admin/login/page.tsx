"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Gagal mengirim permintaan. Periksa koneksi internet Anda.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Masuk dengan magic link untuk mengelola konten
          </p>
        </div>

        {/* Error from redirect */}
        {errorParam === "unauthorized" && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Akses ditolak. Akun Anda tidak memiliki izin admin.
          </div>
        )}
        {errorParam === "provision_failed" && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Gagal menyiapkan akun admin. Hubungi administrator.
          </div>
        )}

        {/* Success state */}
        {status === "success" ? (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <div className="text-3xl">✉️</div>
            <h2 className="mt-3 text-lg font-semibold text-emerald-300">
              Cek email Anda
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Jika alamat email terdaftar, kami telah mengirimkan link masuk.
              Periksa inbox dan folder spam Anda.
            </p>
          </div>
        ) : (
          /* Login form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={status === "loading"}
                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Mengirim..." : "Kirim Magic Link"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600">
          Hanya pemilik website yang dapat masuk.
        </p>
      </div>
    </main>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const errorMessages: Record<string, { title: string; desc: string }> = {
    unauthorized: {
      title: "Akses Ditolak (403)",
      desc: "Alamat email Anda tidak memiliki hak akses administratif untuk portofolio ini.",
    },
    invalid_code: {
      title: "Tautan Kadaluarsa",
      desc: "Tautan masuk sudah tidak valid atau telah digunakan sebelumnya. Silakan ajukan tautan baru.",
    },
    no_code: {
      title: "Parameter Tidak Lengkap",
      desc: "Kode verifikasi tidak ditemukan pada tautan callback.",
    },
    provision_failed: {
      title: "Gagal Otorisasi Database",
      desc: "Gagal memverifikasi identitas administrator pada tabel admin_users database.",
    },
    callback_failed: {
      title: "Gangguan Sesi",
      desc: "Terjadi kesalahan saat memproses sesi autentikasi. Silakan coba kembali.",
    },
  };

  const currentError = errorParam ? errorMessages[errorParam] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

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
        setErrorMessage(data.error || "Gagal memproses permintaan login.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Koneksi gagal. Periksa jaringan internet Anda.");
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Editorial Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
              Debian Firwanto • CMS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Masuk Administrator
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Autentikasi aman tanpa kata sandi via Supabase Magic Link. Hak akses dibatasi hanya untuk pemilik portofolio.
          </p>
        </div>

        {/* URL Error Banner */}
        {currentError && status !== "success" && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
            <div className="font-semibold text-red-200 flex items-center gap-2">
              <span>⚠️</span>
              <span>{currentError.title}</span>
            </div>
            <p className="mt-1 text-red-300/80 leading-relaxed">{currentError.desc}</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-2xl border border-emerald-500/20">
              ✉️
            </div>
            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                Tautan Masuk Telah Dikirim
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Jika alamat email Anda terdaftar dalam allowlist admin, kami telah mengirimkan tautan masuk ke kotak masuk Anda.
              </p>
            </div>
            <div className="border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500 leading-normal">
              <p>Periksa inbox serta folder Spam / Promosi Anda. Tautan ini berlaku selama beberapa menit.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
            >
              Gunakan email lain atau kirim ulang
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-2"
              >
                Alamat Email Terdaftar
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
                autoComplete="email"
                autoFocus
                disabled={status === "loading"}
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 font-mono"
              />
            </div>

            {status === "error" && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Mengirim Magic Link...</span>
                </>
              ) : (
                <span>Kirim Magic Link Masuk →</span>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <Link
            href="/"
            className="hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            ← Kembali ke Portofolio
          </Link>
          <span className="font-mono">Security: RLS + Allowlist</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-zinc-950 text-zinc-100">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-xs text-zinc-500">
            Memuat portal autentikasi...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}

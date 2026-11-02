"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error info for observability without leaking to UI
    console.error("Application Error:", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-transparent text-[#222222] flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative selection:bg-[#dbeafe]">
      <div className="max-w-md w-full text-center">
        {/* Scrapbook warning badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fceee8] text-[#d95c47] text-xs font-mono uppercase tracking-wider mb-6 border border-[#d95c47]/20">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Sistem Mengalami Gangguan Sementara</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#222222] mb-3">
          Terjadi Kesalahan Tak Terduga
        </h1>

        <p className="font-sans text-sm sm:text-base text-[#666666] leading-relaxed mb-6">
          Halaman tidak dapat dimuat dengan sempurna. Kami telah mencatat kejadian ini agar dapat segera ditangani.
        </p>

        {error.digest && (
          <p className="font-mono text-xs text-[#888888] bg-[#f5f2e9] py-1.5 px-3 rounded-lg inline-block mb-6 border border-[#222222]/5">
            Kode Referensi: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#222222] text-[#fbf9f3] text-sm font-medium hover:bg-[#333333] transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            <span>Muat Ulang Halaman</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#222222]/15 text-[#222222] text-sm font-medium hover:bg-[#f5f2e9] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

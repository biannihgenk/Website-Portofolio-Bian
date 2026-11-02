import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent text-[#222222] flex flex-col justify-center items-center px-4 sm:px-6 py-16 relative selection:bg-[#dbeafe]">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#e8eedb]/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#fceee8]/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-xl w-full text-center">
        {/* Scrapbook stamp */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#222222] text-[#fbf9f3] text-xs font-mono uppercase tracking-wider mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
          <span>Error 404 • Lost in Transit</span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#222222] mb-4">
          Jejak yang Dicari Tidak Ditemukan
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#555555] leading-relaxed mb-8 max-w-md mx-auto">
          Mungkin halaman telah berpindah alamat, catatan telah diarsipkan, atau ada kesalahan ketik pada URL.
        </p>

        {/* Editorial Paper Card Navigation */}
        <div className="bg-[#f5f2e9] border border-[#222222]/10 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 text-left">
          <p className="font-mono text-xs uppercase tracking-wider text-[#666666] mb-4 font-semibold">
            Rekomendasi Jalur Alternatif:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 hover:bg-white border border-[#222222]/5 transition-all text-sm font-medium text-[#222222] group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#dbeafe] flex items-center justify-center text-[#222222] group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span>Halaman Utama</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 hover:bg-white border border-[#222222]/5 transition-all text-sm font-medium text-[#222222] group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#fceee8] flex items-center justify-center text-[#d95c47] group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <span>Tentang & Profil</span>
            </Link>

            <Link
              href="/blog"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 hover:bg-white border border-[#222222]/5 transition-all text-sm font-medium text-[#222222] group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e8eedb] flex items-center justify-center text-[#222222] group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span>Catatan Proses (Blog)</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 hover:bg-white border border-[#222222]/5 transition-all text-sm font-medium text-[#222222] group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#fed7aa] flex items-center justify-center text-[#9a3412] group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span>Hubungi Langsung</span>
            </Link>
          </div>
        </div>

        {/* Primary Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#222222] text-[#fbf9f3] text-sm font-medium hover:bg-[#333333] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}

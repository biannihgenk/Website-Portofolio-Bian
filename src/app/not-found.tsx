import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#fbf9f3] text-[#222222] font-sans antialiased flex flex-col justify-center items-center px-4 sm:px-6 py-16 selection:bg-[#dbeafe]">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#222222] text-[#fbf9f3] text-xs font-mono uppercase tracking-wider mb-6 shadow-sm">
            <span>404 • Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222222] mb-3">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-8">
            Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>

          <Link
            href="/id"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#222222] text-[#fbf9f3] text-sm font-medium hover:bg-[#333333] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Menuju Beranda Portofolio</span>
          </Link>
        </div>
      </body>
    </html>
  );
}

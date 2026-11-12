"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export function SchoolLocationMap() {
  const locale = useLocale();
  const isId = locale === "id";
  const [copied, setCopied] = useState(false);

  const schoolAddress =
    "SMK Telkom Malang, Jl. Danau Ranau, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139";
  const mapsDirectionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=SMK+Telkom+Malang";
  const mapsSearchUrl =
    "https://maps.google.com/?q=SMK+Telkom+Malang";

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(schoolAddress).catch(() => {});
    setCopied(true);
  };

  return (
    <div
      id="campus-location"
      className="w-full mt-6 bg-white/95 rounded-3xl border border-[#ded8cb] p-5 sm:p-8 shadow-xs relative overflow-hidden scroll-mt-28"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ded8cb]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0 border border-[#bfdbfe]">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1e40af] bg-[#dbeafe]/80 border border-[#bfdbfe] px-2.5 py-0.5 rounded-full">
                GEO CAMPUS // SMK TELKOM MALANG
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111827] mt-1">
              {isId ? "Lokasi SMK Telkom Malang" : "SMK Telkom Malang Campus"}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#6b6863]">
              {isId
                ? "Pusat Kegiatan Pendidikan Kejuruan & Laboratorium TKJ"
                : "Vocational Engineering Campus & Computer Network Labs"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold bg-[#fbf9f3] text-[#111827] rounded-xl border border-[#ded8cb] hover:bg-white hover:border-[#2563eb]/60 transition-all shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <span className="text-emerald-600">✓</span>
                <span>{isId ? "Alamat Disalin" : "Address Copied"}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 text-[#6b6863]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>{isId ? "Salin Alamat" : "Copy Address"}</span>
              </>
            )}
          </button>

          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold bg-[#0b0c0c] hover:bg-[#2563eb] text-white rounded-xl shadow-xs transition-all group"
          >
            <span>{isId ? "Petunjuk Arah" : "Get Directions"}</span>
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Grid: Interactive Google Maps Iframe + Location Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* Map Viewport (8 Cols) */}
        <div className="lg:col-span-8 relative w-full h-[300px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#ded8cb] bg-[#f5f3ee]">
          <iframe
            title={isId ? "Lokasi SMK Telkom Malang" : "SMK Telkom Malang Location Map"}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.213824143171!2d112.65554337588383!3d-7.978643992046467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6285c5b7da7e7%3A0x6b14f828a167098e!2sSMK%20Telkom%20Malang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover"
          />

          {/* Floating Pill on top of map */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#ded8cb] shadow-xs flex items-center gap-2 pointer-events-none max-w-[calc(100%-24px)]">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
            <span className="font-mono text-[11px] font-bold text-[#111827] truncate">
              SMK TELKOM MALANG (MOKLET)
            </span>
          </div>

          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-white/95 hover:bg-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#ded8cb] shadow-xs font-mono text-[11px] text-[#2563eb] font-bold flex items-center gap-1.5 transition-all"
          >
            <span>{isId ? "Buka Google Maps ↗" : "Open Google Maps ↗"}</span>
          </a>
        </div>

        {/* Location Insights (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-[#fbf9f3] p-5 rounded-2xl border border-[#ded8cb]">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#6b6863] tracking-wider">
                {isId ? "ALAMAT PRESISI" : "STREET ADDRESS"}
              </span>
              <p className="font-sans text-sm font-semibold text-[#111827] mt-0.5 leading-snug">
                Jl. Danau Ranau, Sawojajar, Kedungkandang, Kota Malang
              </p>
              <p className="font-mono text-xs text-[#2563eb] font-bold mt-1">
                {isId ? "Kode Pos: 65139 • Jawa Timur" : "Postal 65139 • East Java"}
              </p>
            </div>

            <div className="pt-3 border-t border-[#ded8cb]/80">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6b6863] tracking-wider">
                {isId ? "KOORDINAT GPS" : "GPS COORDINATES"}
              </span>
              <p className="font-mono text-xs text-[#111827] font-bold mt-0.5 leading-relaxed">
                Latitude: -7.9786° S <br />
                Longitude: 112.6577° E
              </p>
            </div>

            <div className="pt-3 border-t border-[#ded8cb]/80">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6b6863] tracking-wider">
                {isId ? "INSTITUSI" : "INSTITUTION"}
              </span>
              <p className="font-sans text-xs text-[#4b5563] leading-relaxed mt-0.5">
                {isId
                  ? "Sekolah Menengah Kejuruan Telkom pertama di Indonesia, pelopor pendidikan kejuruan teknologi informasi dan jaringan."
                  : "Indonesia's pioneering ICT vocational institute specializing in telecommunications, networking, and software engineering."}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="font-mono text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded-md font-bold">
                  Moklet A&apos;35
                </span>
                <span className="font-mono text-[10px] bg-white border border-[#ded8cb] text-[#4b5563] px-2 py-0.5 rounded-md font-bold">
                  {isId ? "Kelas X TKJ" : "Grade X TKJ"}
                </span>
                <span className="font-mono text-[10px] bg-white border border-[#ded8cb] text-[#4b5563] px-2 py-0.5 rounded-md font-bold">
                  Network Engineering
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#ded8cb] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fbf9f3] border border-[#ded8cb] text-[#2563eb] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="text-[11px] text-[#4b5563] leading-snug font-medium">
              {isId
                ? "Basis harian praktikum routing, administrasi Linux, dan proyek web."
                : "Daily base for routing labs, Linux servers, and software projects."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

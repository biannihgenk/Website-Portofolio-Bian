"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

interface ProfileGalleryShowcaseProps {
  avatarUrl?: string | null;
}

export function ProfileGalleryShowcase({ avatarUrl }: ProfileGalleryShowcaseProps) {
  const locale = useLocale();
  const isId = locale === "id";
  const [activeView, setActiveView] = useState<"campus" | "avatar">("campus");

  const campusPhotoUrl = "/images/debian_real_landscape.jpg";
  const avatar3dUrl = "/images/debian_avatar_3d.jpg";
  const portraitUrl = avatarUrl || "/images/Foto Bian.png";

  const mainImageSrc = activeView === "campus" ? campusPhotoUrl : avatar3dUrl;

  return (
    <section className="w-full my-8 sm:my-10">
      <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xs border border-[#ded8cb]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {/* LEFT SHOWCASE (7 Cols): Real Campus Photo / 3D Concept Switcher */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                  {isId ? "Dokumentasi Identitas" : "Identity Visual Record"}
                </span>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-[#f5f3ee] border border-[#ded8cb] text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveView("campus")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeView === "campus"
                      ? "bg-white text-[#2563eb] shadow-2xs"
                      : "text-[#6b6863] hover:text-[#111827]"
                  }`}
                >
                  {isId ? "Potret Resmi" : "Official Portrait"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("avatar")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeView === "avatar"
                      ? "bg-white text-[#2563eb] shadow-2xs"
                      : "text-[#6b6863] hover:text-[#111827]"
                  }`}
                >
                  {isId ? "Konsep Digital 3D" : "3D Digital Render"}
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#f5f2ea] border border-[#ded8cb] group">
              <Image
                src={mainImageSrc}
                alt={
                  activeView === "campus"
                    ? "Naufal Nizar De Bian — SMK Telkom Malang"
                    : "Digital 3D Identity Render of Naufal Nizar De Bian"
                }
                fill
                priority
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 text-white">
                <div className="px-3 py-1.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[11px] font-semibold">
                  Naufal Nizar De Bian • Moklet A&apos;35
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold">
                  SMK TELKOM MALANG
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (5 Cols): Crisp Studio Portrait & Active Engineering Focus Card */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {/* Compact Real Portrait Frame */}
            <div className="bg-[#fbf9f3] p-3.5 sm:p-4 rounded-2xl border border-[#ded8cb] flex items-center gap-4">
              <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-[#f5f3ee] border border-[#ded8cb] shrink-0">
                <Image
                  src={portraitUrl}
                  alt="Naufal Nizar De Bian"
                  fill
                  unoptimized
                  className="object-cover object-top"
                  sizes="120px"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2563eb] block">
                  {isId ? "Profil Pelajar Vokasi" : "Vocational Profile"}
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#111827] leading-snug">
                  Naufal Nizar De Bian Setyo Firwanto
                </h2>
                <p className="font-sans text-xs text-[#6b6863] leading-relaxed">
                  {isId
                    ? "Teknik Komputer dan Jaringan (TKJ) — SMK Telkom Malang."
                    : "Computer & Network Engineering — SMK Telkom Malang."}
                </p>
              </div>
            </div>

            {/* Clean Dark Executive Status Block */}
            <div className="bg-[#0b1120] text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 flex-1 border border-slate-800">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blue-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {isId ? "Fokus Pembelajaran Saat Ini" : "Current Academic Focus"}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    MALANG 65139
                  </span>
                </div>

                <p className="font-sans text-sm text-slate-200 leading-relaxed">
                  {isId
                    ? "Siswa Kelas X TKJ — Mendalami arsitektur routing MikroTik & Cisco (OSPF/VLAN), administrasi server Debian Linux, containerization Docker, dan pengembangan aplikasi web modern."
                    : "Grade X TKJ Student — Focusing on MikroTik & Cisco routing architectures (OSPF/VLAN), Debian Linux server administration, Docker containerization, and modern full-stack web engineering."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
                {["MikroTik & Cisco", "Debian Linux", "Next.js 15 & TS", "Docker"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 font-mono text-[10px] font-semibold text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

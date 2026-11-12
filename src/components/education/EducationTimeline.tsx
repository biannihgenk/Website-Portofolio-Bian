"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import type { Education } from "@/types/content";
import {
  EducationDetailModal,
  type EducationModalItem,
} from "./EducationDetailModal";

interface EducationTimelineProps {
  educationList: Education[];
  locale: string;
}

export function EducationTimeline({
  educationList,
  locale,
}: EducationTimelineProps) {
  const t = useTranslations("educationPage");
  const isId = locale === "id";

  const [modalItem, setModalItem] = useState<EducationModalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fallback to rich seed values if Supabase has fewer entries
  const primaryDb = educationList[0];

  function openCompetencyModal(competency: string, context: "smk" | "mts") {
    if (context === "smk") {
      const descriptions: Record<string, string> = {
        "MikroTik RouterOS":
          "Praktikum konfigurasi dasar routerboard: setting IP address, DHCP server, NAT masquerade, firewall filter rules, serta simple queues untuk bandwidth management di lab Sawojajar.",
        "Linux Server & Bash":
          "Deploy dan administrasi server Debian 12: DNS server (BIND9), Web server (Nginx), SSH security hardening, dan cron job scheduling via shell script.",
        "VLAN / OSPF":
          "Perancangan segmentasi jaringan kampus sekolah: konfigurasi VLAN ID pada switch manageable, inter-VLAN routing, dan simulasi dynamic routing OSPF.",
        "Web Basics (Laravel)":
          "Pengembangan web modern berbasis PHP & Laravel: MVC architecture, database migrations, Eloquent ORM, dan implementasi UI responsif.",
        "IoT Mikrokontroler":
          "Otomasi perangkat keras menggunakan ESP32/Arduino: membaca sensor DHT11/22, pengendalian relay 4-channel, dan transmisi telemetry data via protokol MQTT.",
      };

      setModalItem({
        id: `competency-${competency}`,
        title: competency,
        subtitle: "Fokus Kejuruan TKJ • SMK Telkom Malang",
        category: "Kompetensi Lab",
        date: "2024 — 2026",
        description: descriptions[competency] || "Kompetensi kejuruan yang dipelajari dan diuji secara hands-on di laboratorium.",
        reflection: "Teori di slide itu baru 20%. 80% sisanya baru paham waktu troubleshooting kabel kusut atau port forwarding yang belum tembus.",
        tags: [competency, "TKJ-Lab", "Praktikum-Vokasi"],
        statusBadge: "Verified Lab Drill",
        statusColor: "bg-[#bfdbfe] text-[#1e40af]",
      });
    } else {
      setModalItem({
        id: `competency-${competency}`,
        title: competency,
        subtitle: "MTsN 2 Sidoarjo",
        category: "Aktivitas Sekolah",
        date: "2021 — 2024",
        description: "Pengembangan karakter, kedisiplinan berorganisasi, serta pemahaman awal logika komputasi dan pemecahan masalah.",
        tags: [competency, "Madrasah", "Softskills"],
        statusBadge: "Fondasi Akademik",
        statusColor: "bg-[#f3b9a7] text-[#222222]",
      });
    }
    setModalOpen(true);
  }

  const smkCompetencies = [
    "MikroTik RouterOS",
    "Linux Server & Bash",
    "VLAN / OSPF",
    "Web Basics (Laravel)",
    "IoT Mikrokontroler",
  ];

  const mtsCompetencies = [
    "Pramuka & Organisasi",
    "Literasi Sains & Komputer",
    "Logika Matematika",
  ];

  return (
    <section className="flex flex-col gap-8 w-full scroll-mt-28" id="timeline-education">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase text-[#2563eb] font-bold tracking-widest">
            {t("timelineTag")}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] font-bold mt-1">
            {t("timelineTitle")}
          </h2>
        </div>
        <p className="font-sans text-sm sm:text-base text-[#686660] max-w-md leading-relaxed">
          {t("timelineLead")}
        </p>
      </div>

      {/* Timeline Cards Container */}
      <div className="relative pl-6 md:pl-10 space-y-8">
        {/* Hand-drawn dashed vertical line */}
        <div className="absolute top-4 bottom-4 left-2.5 md:left-4 w-0.5 border-l-2 border-dashed border-[#ded8cb]" />

        {/* Timeline Entry 1 (Current) */}
        <div className="relative group">
          {/* Node Marker */}
          <div className="absolute -left-6 md:-left-10 top-6 w-5 h-5 rounded-full bg-[#bfdbfe] flex items-center justify-center shadow-xs ring-4 ring-[#fbf9f3]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] animate-ping opacity-75" />
            <span className="w-2 h-2 rounded-full bg-[#2563eb] absolute" />
          </div>

          {/* Card Content */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-[#ded8cb] transition-all duration-300 hover:shadow-scrapbook hover:-translate-y-0.5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#bfdbfe] text-[#1e40af] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  {t("curStudying")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f0eee8] font-mono text-xs text-[#686660] font-medium border border-[#ded8cb]">
                  2024 — Sekarang
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#686660] font-sans text-xs sm:text-sm">
                <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{t("smkLocation")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-8 flex flex-col gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold">
                  {primaryDb?.institution || t("smkName")}
                </h3>
                <div className="font-sans text-sm sm:text-base font-bold text-[#2563eb]">
                  {primaryDb?.program || t("smkMajor")}
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#444748] mt-2 leading-relaxed">
                  {primaryDb
                    ? isId
                      ? primaryDb.description_id
                      : primaryDb.description_en
                    : t("smkDesc")}
                </p>
              </div>

              {/* Sticky Reflection Note */}
              <div className="md:col-span-4 bg-[#f5f2ea] p-4 rounded-xl flex flex-col justify-between gap-3 shadow-inner border border-[#ded8cb]">
                <div className="flex items-center gap-1.5 text-[#2563eb] font-mono text-[11px] font-bold uppercase tracking-wider">
                  <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                  <span>{t("smkStickyTitle")}</span>
                </div>
                <p className="font-serif text-xs sm:text-sm text-[#222222] italic leading-relaxed">
                  {t("smkStickyNote")}
                </p>
                <div className="font-mono text-[11px] text-[#686660] text-right font-medium">
                  {t("smkStickyAuthor")}
                </div>
              </div>
            </div>

            {/* Interactive Tags / Core Competencies */}
            <div className="mt-6 pt-4 border-t border-[#f0eee8] flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[11px] text-[#686660] font-bold uppercase mr-1">
                {t("smkFocusLabel")}
              </span>
              {smkCompetencies.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => openCompetencyModal(comp, "smk")}
                  className="px-2.5 py-1 rounded-md bg-[#f5f3ee] hover:bg-[#dbeafe]/60 font-mono text-xs text-[#222222] border border-[#ded8cb] transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1 group/btn cursor-pointer"
                >
                  <span>{comp}</span>
                  <span className="text-[10px] text-[#2563eb] opacity-0 group-hover/btn:opacity-100 transition-opacity">
                    🔍
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Entry 2 (Previous) */}
        <div className="relative group">
          {/* Node Marker */}
          <div className="absolute -left-6 md:-left-10 top-6 w-5 h-5 rounded-full bg-[#e4e2dd] flex items-center justify-center shadow-xs ring-4 ring-[#fbf9f3]">
            <span className="w-2 h-2 rounded-full bg-[#686660]" />
          </div>

          {/* Card Content */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-[#ded8cb] transition-all duration-300 hover:shadow-scrapbook">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#dbeafe] text-[#222222] font-mono text-[11px] font-bold uppercase tracking-wider">
                  {t("alumni")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f0eee8] font-mono text-xs text-[#686660] font-medium border border-[#ded8cb]">
                  2021 — 2024
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#686660] font-sans text-xs sm:text-sm">
                <svg className="w-4 h-4 text-[#686660]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{t("mtsLocation")}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#222222] font-bold">
                {t("mtsName")}
              </h3>
              <div className="font-sans text-sm sm:text-base font-bold text-[#686660]">
                {t("mtsLevel")}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#444748] mt-2 leading-relaxed max-w-3xl">
                {t("mtsDesc")}
              </p>
            </div>

            {/* Interactive Tags */}
            <div className="mt-5 pt-4 border-t border-[#f0eee8] flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[11px] text-[#686660] font-bold uppercase mr-1">
                {t("mtsFocusLabel")}
              </span>
              {mtsCompetencies.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => openCompetencyModal(comp, "mts")}
                  className="px-2.5 py-1 rounded-md bg-[#f5f3ee] hover:bg-[#f3b9a7]/50 font-mono text-xs text-[#222222] border border-[#ded8cb] transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1 group/btn cursor-pointer"
                >
                  <span>{comp}</span>
                  <span className="text-[10px] text-[#2563eb] opacity-0 group-hover/btn:opacity-100 transition-opacity">
                    🔍
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Competency / Timeline Modal */}
      <EducationDetailModal
        isOpen={modalOpen}
        item={modalItem}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

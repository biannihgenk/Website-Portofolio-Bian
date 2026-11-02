"use client";

import React, { useState, useTransition } from "react";
import type { SiteSetting } from "@/types/content";
import type { Json } from "@/types/database.types";
import { upsertSettingAction, deleteSettingAction } from "@/lib/actions/settings";

interface SiteSettingsManagerProps {
  initialSettings: SiteSetting[];
}

export function SiteSettingsManager({ initialSettings }: SiteSettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSetting[]>(initialSettings);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "socials" | "custom">("general");

  // Helper to extract value by key
  const getSettingValue = (key: string, defaultVal: Record<string, unknown> = {}): Record<string, unknown> => {
    const s = settings.find((item) => item.key === key);
    if (!s || typeof s.value !== "object" || s.value === null || Array.isArray(s.value)) {
      return defaultVal;
    }
    return s.value as Record<string, unknown>;
  };

  // General Tab States
  const generalData = getSettingValue("general", {});
  const [siteName, setSiteName] = useState((generalData.site_name as string) ?? "Debian Firwanto");
  const [siteTagline, setSiteTagline] = useState(
    (generalData.site_tagline as string) ?? "Software Engineer & System Architect"
  );
  const [contactEmail, setContactEmail] = useState(
    (generalData.contact_email as string) ?? "debianfirwanto@gmail.com"
  );
  const [availableForHire, setAvailableForHire] = useState(
    (generalData.available_for_hire as boolean) ?? true
  );

  // SEO Tab States
  const seoData = getSettingValue("seo", {});
  const [metaTitle, setMetaTitle] = useState(
    (seoData.meta_title as string) ?? "Debian Firwanto — Software Engineer Portfolio"
  );
  const [metaDesc, setMetaDesc] = useState(
    (seoData.meta_description as string) ??
      "Personal portfolio and blog showcasing high-performance backend, cloud infrastructure, and modern web applications."
  );
  const [keywords, setKeywords] = useState(
    Array.isArray(seoData.keywords)
      ? (seoData.keywords as string[]).join(", ")
      : typeof seoData.keywords === "string"
      ? seoData.keywords
      : "software engineer, full-stack, typescript, go, nextjs"
  );

  // Socials Tab States
  const socialsData = getSettingValue("socials", {});
  const [githubUrl, setGithubUrl] = useState((socialsData.github as string) ?? "https://github.com/debianfirwanto");
  const [linkedinUrl, setLinkedinUrl] = useState(
    (socialsData.linkedin as string) ?? "https://linkedin.com/in/debianfirwanto"
  );
  const [twitterUrl, setTwitterUrl] = useState((socialsData.twitter as string) ?? "");
  const [instagramUrl, setInstagramUrl] = useState((socialsData.instagram as string) ?? "");

  // Custom Key State
  const [customKey, setCustomKey] = useState("");
  const [customValueJson, setCustomValueJson] = useState("{}");
  const [customDesc, setCustomDesc] = useState("");
  const [customIsPublic, setCustomIsPublic] = useState(true);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const val = {
        site_name: siteName.trim(),
        site_tagline: siteTagline.trim(),
        contact_email: contactEmail.trim(),
        available_for_hire: availableForHire,
      };
      const res = await upsertSettingAction(
        "general",
        val,
        "Identitas umum dan status ketersediaan situs",
        true
      );
      if (res.success) {
        setMessage({ type: "success", text: "Pengaturan umum berhasil disimpan." });
      } else {
        setMessage({ type: "error", text: res.message || "Gagal menyimpan." });
      }
    });
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const val = {
        meta_title: metaTitle.trim(),
        meta_description: metaDesc.trim(),
        keywords: keywords
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean),
      };
      const res = await upsertSettingAction(
        "seo",
        val,
        "Pengaturan SEO global dan metadata OpenGraph",
        true
      );
      if (res.success) {
        setMessage({ type: "success", text: "Pengaturan SEO berhasil disimpan." });
      } else {
        setMessage({ type: "error", text: res.message || "Gagal menyimpan." });
      }
    });
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const val = {
        github: githubUrl.trim(),
        linkedin: linkedinUrl.trim(),
        twitter: twitterUrl.trim(),
        instagram: instagramUrl.trim(),
      };
      const res = await upsertSettingAction(
        "socials",
        val,
        "Tautan media sosial dan profil profesional",
        true
      );
      if (res.success) {
        setMessage({ type: "success", text: "Tautan sosial berhasil disimpan." });
      } else {
        setMessage({ type: "error", text: res.message || "Gagal menyimpan." });
      }
    });
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    let parsedVal: unknown;
    try {
      parsedVal = JSON.parse(customValueJson);
    } catch {
      setMessage({ type: "error", text: "Format JSON untuk value tidak valid." });
      return;
    }

    startTransition(async () => {
      const res = await upsertSettingAction(
        customKey,
        parsedVal as Json,
        customDesc,
        customIsPublic
      );
      if (res.success) {
        setMessage({ type: "success", text: `Kunci "${customKey}" berhasil disimpan.` });
        setCustomKey("");
        setCustomValueJson("{}");
        setCustomDesc("");
      } else {
        setMessage({ type: "error", text: res.message || "Gagal menyimpan." });
      }
    });
  };

  const handleDeleteSetting = (keyToDelete: string) => {
    if (!confirm(`Hapus kunci pengaturan "${keyToDelete}"?`)) return;
    setMessage(null);

    startTransition(async () => {
      const res = await deleteSettingAction(keyToDelete);
      if (res.success) {
        setSettings((prev) => prev.filter((s) => s.key !== keyToDelete));
        setMessage({ type: "success", text: `Kunci "${keyToDelete}" berhasil dihapus.` });
      } else {
        setMessage({ type: "error", text: res.error || "Gagal menghapus." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {message && (
        <div
          className={`rounded-xl border p-4 text-xs ${
            message.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/20 bg-rose-500/10 text-rose-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`pb-3 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-white text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Identitas Situs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`pb-3 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "seo"
              ? "border-white text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          SEO & Meta Tags
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("socials")}
          className={`pb-3 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "socials"
              ? "border-white text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Tautan Sosial
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`pb-3 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "custom"
              ? "border-white text-white"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Kunci Kustom (JSONB)
        </button>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
            Identitas & Tagline Situs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nama Situs / Pemilik
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Tagline / Profesi Utama
              </label>
              <input
                type="text"
                required
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email Kontak Publik
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="avail_hire"
                checked={availableForHire}
                onChange={(e) => setAvailableForHire(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0"
              />
              <label htmlFor="avail_hire" className="text-xs text-zinc-300 cursor-pointer">
                Tampilkan badge status <span className="text-emerald-400 font-semibold">Available for Work / Hire</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Pengaturan Umum"}
            </button>
          </div>
        </form>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <form onSubmit={handleSaveSeo} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
            SEO & Metadata Global
          </h3>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Meta Title Default
            </label>
            <input
              type="text"
              required
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Meta Description Default
            </label>
            <textarea
              rows={3}
              required
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Keywords (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Pengaturan SEO"}
            </button>
          </div>
        </form>
      )}

      {/* Socials Tab */}
      {activeTab === "socials" && (
        <form onSubmit={handleSaveSocials} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
            Tautan Profil Media Sosial
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Tautan Sosial"}
            </button>
          </div>
        </form>
      )}

      {/* Custom Key Tab */}
      {activeTab === "custom" && (
        <div className="space-y-6">
          {/* Add custom setting */}
          <form onSubmit={handleSaveCustom} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3">
              Tambah / Update Kunci Kustom
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Kunci (Key) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="custom_config_name"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Deskripsi Kunci
                </label>
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Catatan fungsi kunci ini..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nilai JSON (JSONB Value)
              </label>
              <textarea
                rows={4}
                required
                value={customValueJson}
                onChange={(e) => setCustomValueJson(e.target.value)}
                placeholder='{ "key": "value" }'
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customIsPublic}
                  onChange={(e) => setCustomIsPublic(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0"
                />
                Dapat diakses pengunjung publik (is_public)
              </label>

              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Simpan Kunci"}
              </button>
            </div>
          </form>

          {/* List of existing settings in public.site_settings */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3 mb-4">
              Kunci yang Tersimpan di Database ({settings.length})
            </h3>

            {settings.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Belum ada kunci di tabel <code>public.site_settings</code>. Nilai fallback dari kode masih digunakan.
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {settings.map((s) => (
                  <div key={s.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-200">{s.key}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] ${
                            s.is_public
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {s.is_public ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-zinc-500 mt-0.5">
                        {s.description || "Tidak ada deskripsi"}
                      </p>
                      <pre className="mt-1 text-[11px] text-zinc-400 overflow-x-auto max-w-xl bg-zinc-950 p-2 rounded">
                        {JSON.stringify(s.value, null, 2)}
                      </pre>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDeleteSetting(s.key)}
                        className="rounded border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-300"
                      >
                        Hapus Kunci
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

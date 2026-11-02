"use client";

import React, { useState, useTransition } from "react";
import type { Profile } from "@/types/content";
import { saveProfileAction } from "@/lib/actions/profile";
import { type ProfileActionState } from "@/lib/validations/profile";
import { MediaUploader } from "@/components/admin/MediaUploader";

interface ProfileFormProps {
  profile: Profile | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(profile?.full_name ?? "Debian Firwanto");
  const [nickname, setNickname] = useState(profile?.nickname ?? "Debian");
  const [headline, setHeadline] = useState(profile?.headline ?? "");
  const [location, setLocation] = useState(profile?.location ?? "Indonesia");
  const [emailPublic, setEmailPublic] = useState(profile?.email_public ?? "");
  const [avatarPath, setAvatarPath] = useState<string | null>(profile?.avatar_path ?? null);
  const [school, setSchool] = useState(profile?.school ?? "");
  const [studyProgram, setStudyProgram] = useState(profile?.study_program ?? "");
  const [githubUrl, setGithubUrl] = useState(profile?.github_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(profile?.instagram_url ?? "");
  const [bioId, setBioId] = useState(profile?.bio_id ?? "");
  const [bioEn, setBioEn] = useState(profile?.bio_en ?? "");

  // JSON list helpers
  const initialInterests: string[] = Array.isArray(profile?.interests)
    ? (profile?.interests as string[])
    : [];
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [interestInput, setInterestInput] = useState("");

  const initialFacts: string[] = Array.isArray(profile?.random_facts)
    ? (profile?.random_facts as string[])
    : [];
  const [factsText, setFactsText] = useState(initialFacts.join("\n"));

  const initialNotes: string[] = Array.isArray(profile?.character_notes)
    ? (profile?.character_notes as string[])
    : [];
  const [notesText, setNotesText] = useState(initialNotes.join("\n"));

  const [actionState, setActionState] = useState<ProfileActionState>({});

  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    if (!interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
    }
    setInterestInput("");
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("nickname", nickname);
      formData.append("headline", headline);
      formData.append("location", location);
      formData.append("email_public", emailPublic);
      formData.append("avatar_path", avatarPath || "");
      formData.append("school", school);
      formData.append("study_program", studyProgram);
      formData.append("github_url", githubUrl);
      formData.append("linkedin_url", linkedinUrl);
      formData.append("instagram_url", instagramUrl);
      formData.append("bio_id", bioId);
      formData.append("bio_en", bioEn);
      formData.append("interests", JSON.stringify(interests));
      formData.append("random_facts", JSON.stringify(factsText.split("\n").map((s) => s.trim()).filter(Boolean)));
      formData.append("character_notes", JSON.stringify(notesText.split("\n").map((s) => s.trim()).filter(Boolean)));

      const res = await saveProfileAction({}, formData);
      setActionState(res);
    });
  };

  const errors = actionState.errors || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Feedback Banner */}
      {actionState.message && (
        <div
          className={`rounded-xl border p-4 text-xs ${
            actionState.success
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/20 bg-rose-500/10 text-rose-300"
          }`}
        >
          <p className="font-semibold">{actionState.success ? "Berhasil" : "Perhatian"}</p>
          <p className="mt-0.5">{actionState.message}</p>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* IDENTITY & BASIC INFO */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Identitas Utama & Avatar
          </h3>
          <p className="text-xs text-zinc-500">
            Data identitas publik yang ditampilkan pada beranda dan halaman profil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Avatar Upload */}
          <div>
            <MediaUploader
              value={avatarPath}
              onChange={setAvatarPath}
              folder="profiles"
              prefix="avatar"
              label="Foto Profil (Avatar)"
              aspectRatio="square"
              helperText="Format persegi disarankan • Maks 5 MB"
            />
          </div>

          {/* Identity Fields */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nama Lengkap <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
                {errors.full_name && (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.full_name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nama Panggilan (Nickname)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Headline / Profesi Utama
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Software Engineer & Cloud Architect"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Jakarta, Indonesia"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Publik
                </label>
                <input
                  type="email"
                  value={emailPublic}
                  onChange={(e) => setEmailPublic(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
                />
                {errors.email_public && (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.email_public[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* BIOGRAPHY (BILINGUAL) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Biografi & Narasi Pribadi
          </h3>
          <p className="text-xs text-zinc-500">
            Dukungan teks dwibahasa untuk halaman Tentang Saya (About).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Biografi (Bahasa Indonesia)
            </label>
            <textarea
              rows={6}
              value={bioId}
              onChange={(e) => setBioId(e.target.value)}
              placeholder="Ceritakan latar belakang, fokus rekayasa perangkat lunak, dan visi Anda..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 leading-relaxed focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Biography (English)
            </label>
            <textarea
              rows={6}
              value={bioEn}
              onChange={(e) => setBioEn(e.target.value)}
              placeholder="Tell your background, software engineering focus, and vision..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 leading-relaxed focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDUCATION & INSTITUTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Institusi Akademik
          </h3>
          <p className="text-xs text-zinc-500">
            Pendidikan formal yang sedang atau telah ditempuh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Institusi / Universitas
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Nama Universitas / Sekolah"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Program Studi / Jurusan
            </label>
            <input
              type="text"
              value={studyProgram}
              onChange={(e) => setStudyProgram(e.target.value)}
              placeholder="Teknik Informatika / Computer Science"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SOCIAL LINKS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Tautan Media Sosial & Profil Online
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            {errors.github_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.github_url[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            {errors.linkedin_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.linkedin_url[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            {errors.instagram_url && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.instagram_url[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERESTS & CHARACTER NOTES (JSON ARRAYS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
            Minat & Catatan Karakter
          </h3>
          <p className="text-xs text-zinc-500">
            Data pelengkap untuk memperkaya bagian profil dan fun facts.
          </p>
        </div>

        {/* Interests Tags */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Minat / Fokus Riset (Tags)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              placeholder="e.g. Distributed Systems, Distributed AI..."
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
            >
              Tambah
            </button>
          </div>
          {interests.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 border border-zinc-700/80 px-2.5 py-1 text-xs font-medium text-zinc-200"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(item)}
                    className="text-zinc-400 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Facts & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Fakta Menarik (Random Facts) — 1 baris per fakta
            </label>
            <textarea
              rows={4}
              value={factsText}
              onChange={(e) => setFactsText(e.target.value)}
              placeholder="Fakta 1&#10;Fakta 2&#10;Fakta 3"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Catatan Karakter (Character Notes) — 1 baris per catatan
            </label>
            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Catatan 1&#10;Catatan 2"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUBMIT BUTTON */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50 transition-all"
        >
          {isPending ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
              <span>Menyimpan Profil...</span>
            </>
          ) : (
            <span>Simpan Perubahan Profil</span>
          )}
        </button>
      </div>
    </form>
  );
}

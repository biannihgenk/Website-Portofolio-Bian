-- ============================================================================
-- Supabase Development Seed Data
-- Personal Portfolio Website — Debian Firwanto
--
-- NOTE: All test content is clearly tagged with "[DEV]" to comply with PRD 14.2:
-- "Never create real-looking achievements, certificates, articles, or personal
-- details just to make the application appear finished. Ensure test content is
-- clearly identified and cannot accidentally be published to the real portfolio."
-- ============================================================================

-- 1. Profile Initial Structure
INSERT INTO public.profiles (
  full_name,
  headline_id,
  headline_en,
  bio_id,
  bio_en,
  email,
  github_url,
  linkedin_url
) VALUES (
  'Debian Firwanto',
  'Software Engineer & System Architect',
  'Software Engineer & System Architect',
  'Profil resmi Debian Firwanto. Konten detail akan diperbarui melalui CMS.',
  'Official profile of Debian Firwanto. Detailed content will be updated via CMS.',
  'firwanto.debian@gmail.com',
  'https://github.com',
  'https://linkedin.com'
) ON CONFLICT DO NOTHING;

-- 2. Blog Categories
INSERT INTO public.blog_categories (name_id, name_en, slug, sort_order) VALUES
  ('[DEV] Rekayasa Perangkat Lunak', '[DEV] Software Engineering', 'dev-software-engineering', 1),
  ('[DEV] Catatan Teknis', '[DEV] Technical Notes', 'dev-technical-notes', 2)
ON CONFLICT (slug) DO NOTHING;

-- 3. Sample Dev Project
INSERT INTO public.projects (
  slug,
  title_id,
  title_en,
  summary_id,
  summary_en,
  description_id,
  description_en,
  technologies,
  is_featured,
  sort_order,
  status,
  published_at
) VALUES (
  'dev-sample-project',
  '[DEV] Contoh Proyek Pengujian',
  '[DEV] Test Sample Project',
  '[DEV] Ringkasan proyek pengujian sistem portfolio.',
  '[DEV] Summary of test portfolio project infrastructure.',
  '[DEV] Deskripsi teknis pengujian database dan RLS Supabase.',
  '[DEV] Technical description testing database and Supabase RLS.',
  '["Next.js", "TypeScript", "Supabase", "Tailwind CSS"]'::jsonb,
  true,
  1,
  'published',
  now()
) ON CONFLICT (slug) DO NOTHING;

-- 4. Sample Dev Draft Project (Validates RLS draft isolation)
INSERT INTO public.projects (
  slug,
  title_id,
  title_en,
  summary_id,
  summary_en,
  technologies,
  is_featured,
  sort_order,
  status
) VALUES (
  'dev-draft-project',
  '[DEV] Draft Proyek Rahasia',
  '[DEV] Draft Secret Project',
  '[DEV] Hanya boleh dilihat oleh admin yang terautentikasi.',
  '[DEV] Only visible to authenticated admin sessions.',
  '["PostgreSQL"]'::jsonb,
  false,
  2,
  'draft'
) ON CONFLICT (slug) DO NOTHING;

-- 5. Sample Dev Education
INSERT INTO public.education (
  institution,
  program,
  description_id,
  description_en,
  start_date,
  end_date,
  is_current,
  entry_type,
  sort_order,
  status,
  published_at
) VALUES (
  '[DEV] Universitas Contoh',
  'Sarjana Komputer - Teknik Informatika',
  '[DEV] Program studi Teknik Informatika dengan fokus rekayasa perangkat lunak.',
  '[DEV] Informatics Engineering program focused on software engineering.',
  '2018-09-01',
  '2022-08-31',
  false,
  'education',
  1,
  'published',
  now()
) ON CONFLICT DO NOTHING;

-- 6. Sample Dev Achievement
INSERT INTO public.achievements (
  slug,
  title_id,
  title_en,
  category,
  organization,
  achievement_date,
  sort_order,
  status
) VALUES (
  'dev-sample-achievement',
  '[DEV] Sertifikasi Pengujian Sistem',
  '[DEV] System Testing Certification',
  'certification',
  'Development Test Authority',
  '2024-01-15',
  1,
  'published'
) ON CONFLICT (slug) DO NOTHING;

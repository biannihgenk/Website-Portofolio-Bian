-- =============================================================================
-- Portfolio Database Schema — Initial Migration (v1.1)
-- =============================================================================
-- This migration creates all core tables, enums, indexes, RLS policies,
-- triggers, and the is_admin() helper function for the portfolio CMS.
--
-- DEPENDENCY ORDER:
-- 1. Extensions (uuid-ossp, pgcrypto)
-- 2. Custom Enums (idempotent DO block)
-- 3. Utility Trigger Functions (trigger_set_updated_at)
-- 4. Base Security Table (admin_users) — MUST precede is_admin()
-- 5. Security Definer Function (is_admin) — validates against admin_users
-- 6. Content Tables, Triggers & RLS Policies
-- 7. Storage Bucket & Storage RLS Policies
-- 8. Explicit Role Permissions & Grants
-- =============================================================================

-- ─────────────────────────────────────────────
-- 1. EXTENSIONS
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 2. CUSTOM TYPES (ENUMS) — Idempotent
-- ─────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_enum') THEN
    CREATE TYPE project_status_enum AS ENUM ('concept', 'prototype', 'in_development', 'completed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'education_entry_type') THEN
    CREATE TYPE education_entry_type AS ENUM ('education', 'certificate', 'training');
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 3. UTILITY TRIGGER FUNCTION: trigger_set_updated_at()
-- ─────────────────────────────────────────────
-- Reusable trigger function for automatically maintaining the updated_at column.
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────
-- 4. BASE SECURITY TABLE: admin_users
-- ─────────────────────────────────────────────
-- MUST BE CREATED BEFORE is_admin() because PostgreSQL validates table
-- existence when the function is defined.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 5. SECURITY DEFINER HELPER: is_admin()
-- ─────────────────────────────────────────────
-- Evaluates whether the currently authenticated session belongs to an authorized admin.
-- Fixed search_path = public prevents search-path hijacking and avoids recursive RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- RLS Policy for admin_users: only authenticated admins can inspect admin records
DROP POLICY IF EXISTS "admin_users_select_admin" ON public.admin_users;
CREATE POLICY "admin_users_select_admin" ON public.admin_users
  FOR SELECT USING (public.is_admin());

-- No client INSERT/UPDATE/DELETE policies — only service-role can bootstrap/modify admin_users


-- ─────────────────────────────────────────────
-- 6. CONTENT TABLES & POLICIES
-- ─────────────────────────────────────────────

-- A. profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name       TEXT NOT NULL,
  nickname        TEXT,
  headline        TEXT,
  bio_id          TEXT,
  bio_en          TEXT,
  school          TEXT,
  study_program   TEXT,
  location        TEXT,
  avatar_path     TEXT,
  email_public    TEXT,
  github_url      TEXT,
  linkedin_url    TEXT,
  instagram_url   TEXT,
  interests       JSONB,
  random_facts    JSONB,
  character_notes JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- B. site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "site_settings_select_admin" ON public.site_settings;
CREATE POLICY "site_settings_select_admin" ON public.site_settings
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "site_settings_insert_admin" ON public.site_settings;
CREATE POLICY "site_settings_insert_admin" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_settings_update_admin" ON public.site_settings;
CREATE POLICY "site_settings_update_admin" ON public.site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_settings_delete_admin" ON public.site_settings;
CREATE POLICY "site_settings_delete_admin" ON public.site_settings
  FOR DELETE USING (public.is_admin());

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- C. projects
CREATE TABLE IF NOT EXISTS public.projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  title_id         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  summary_id       TEXT NOT NULL,
  summary_en       TEXT NOT NULL,
  description_id   TEXT,
  description_en   TEXT,
  cover_image_path TEXT,
  gallery_paths    JSONB,
  technologies     JSONB,
  project_url      TEXT,
  repository_url   TEXT,
  category         TEXT NOT NULL,
  project_status   project_status_enum NOT NULL DEFAULT 'concept',
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  status           content_status NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_public" ON public.projects;
CREATE POLICY "projects_select_public" ON public.projects
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "projects_select_admin" ON public.projects;
CREATE POLICY "projects_select_admin" ON public.projects
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "projects_insert_admin" ON public.projects;
CREATE POLICY "projects_insert_admin" ON public.projects
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "projects_update_admin" ON public.projects;
CREATE POLICY "projects_update_admin" ON public.projects
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "projects_delete_admin" ON public.projects;
CREATE POLICY "projects_delete_admin" ON public.projects
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_sort ON public.projects(sort_order);

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- D. achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  title_id         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  description_id   TEXT,
  description_en   TEXT,
  organization     TEXT,
  achievement_date DATE,
  category         TEXT NOT NULL,
  image_path       TEXT,
  credential_url   TEXT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  status           content_status NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "achievements_select_public" ON public.achievements;
CREATE POLICY "achievements_select_public" ON public.achievements
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "achievements_select_admin" ON public.achievements;
CREATE POLICY "achievements_select_admin" ON public.achievements
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "achievements_insert_admin" ON public.achievements;
CREATE POLICY "achievements_insert_admin" ON public.achievements
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "achievements_update_admin" ON public.achievements;
CREATE POLICY "achievements_update_admin" ON public.achievements
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "achievements_delete_admin" ON public.achievements;
CREATE POLICY "achievements_delete_admin" ON public.achievements
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_achievements_status ON public.achievements(status);
CREATE INDEX IF NOT EXISTS idx_achievements_slug ON public.achievements(slug);
CREATE INDEX IF NOT EXISTS idx_achievements_sort ON public.achievements(sort_order);

DROP TRIGGER IF EXISTS set_achievements_updated_at ON public.achievements;
CREATE TRIGGER set_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- E. education
CREATE TABLE IF NOT EXISTS public.education (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution     TEXT NOT NULL,
  program         TEXT,
  description_id  TEXT,
  description_en  TEXT,
  start_date      DATE,
  end_date        DATE,
  is_current      BOOLEAN NOT NULL DEFAULT false,
  entry_type      education_entry_type NOT NULL DEFAULT 'education',
  credential_url  TEXT,
  image_path      TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  status          content_status NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "education_select_public" ON public.education;
CREATE POLICY "education_select_public" ON public.education
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "education_select_admin" ON public.education;
CREATE POLICY "education_select_admin" ON public.education
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "education_insert_admin" ON public.education;
CREATE POLICY "education_insert_admin" ON public.education
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "education_update_admin" ON public.education;
CREATE POLICY "education_update_admin" ON public.education
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "education_delete_admin" ON public.education;
CREATE POLICY "education_delete_admin" ON public.education
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_education_status ON public.education(status);
CREATE INDEX IF NOT EXISTS idx_education_sort ON public.education(sort_order);

DROP TRIGGER IF EXISTS set_education_updated_at ON public.education;
CREATE TRIGGER set_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- F. gallery_items
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  caption_id      TEXT,
  caption_en      TEXT,
  image_path      TEXT NOT NULL,
  alt_text        TEXT NOT NULL,
  category        TEXT NOT NULL,
  captured_at     DATE,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  status          content_status NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gallery_items_select_public" ON public.gallery_items;
CREATE POLICY "gallery_items_select_public" ON public.gallery_items
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "gallery_items_select_admin" ON public.gallery_items;
CREATE POLICY "gallery_items_select_admin" ON public.gallery_items
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "gallery_items_insert_admin" ON public.gallery_items;
CREATE POLICY "gallery_items_insert_admin" ON public.gallery_items
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "gallery_items_update_admin" ON public.gallery_items;
CREATE POLICY "gallery_items_update_admin" ON public.gallery_items
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "gallery_items_delete_admin" ON public.gallery_items;
CREATE POLICY "gallery_items_delete_admin" ON public.gallery_items
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_gallery_items_status ON public.gallery_items(status);
CREATE INDEX IF NOT EXISTS idx_gallery_items_featured ON public.gallery_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_gallery_items_sort ON public.gallery_items(sort_order);

DROP TRIGGER IF EXISTS set_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER set_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- G. blog_categories (MUST precede blog_posts due to foreign key)
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_id     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_categories_select_public" ON public.blog_categories;
CREATE POLICY "blog_categories_select_public" ON public.blog_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "blog_categories_insert_admin" ON public.blog_categories;
CREATE POLICY "blog_categories_insert_admin" ON public.blog_categories
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "blog_categories_update_admin" ON public.blog_categories;
CREATE POLICY "blog_categories_update_admin" ON public.blog_categories
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "blog_categories_delete_admin" ON public.blog_categories;
CREATE POLICY "blog_categories_delete_admin" ON public.blog_categories
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);

DROP TRIGGER IF EXISTS set_blog_categories_updated_at ON public.blog_categories;
CREATE TRIGGER set_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- H. blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 TEXT NOT NULL UNIQUE,
  title_id             TEXT NOT NULL,
  title_en             TEXT NOT NULL,
  excerpt_id           TEXT NOT NULL,
  excerpt_en           TEXT NOT NULL,
  content_id           TEXT,
  content_en           TEXT,
  cover_image_path     TEXT,
  category_id          UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  tags                 JSONB,
  is_featured          BOOLEAN NOT NULL DEFAULT false,
  reading_time_minutes INTEGER,
  seo_title_id         TEXT,
  seo_title_en         TEXT,
  seo_description_id   TEXT,
  seo_description_en   TEXT,
  status               content_status NOT NULL DEFAULT 'draft',
  published_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_posts_select_public" ON public.blog_posts;
CREATE POLICY "blog_posts_select_public" ON public.blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "blog_posts_select_admin" ON public.blog_posts;
CREATE POLICY "blog_posts_select_admin" ON public.blog_posts
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "blog_posts_insert_admin" ON public.blog_posts;
CREATE POLICY "blog_posts_insert_admin" ON public.blog_posts
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "blog_posts_update_admin" ON public.blog_posts;
CREATE POLICY "blog_posts_update_admin" ON public.blog_posts
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "blog_posts_delete_admin" ON public.blog_posts;
CREATE POLICY "blog_posts_delete_admin" ON public.blog_posts
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured) WHERE is_featured = true;

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- I. media_assets
CREATE TABLE IF NOT EXISTS public.media_assets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_path      TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  size_bytes        BIGINT NOT NULL,
  alt_text          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_assets_select_admin" ON public.media_assets;
CREATE POLICY "media_assets_select_admin" ON public.media_assets
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "media_assets_insert_admin" ON public.media_assets;
CREATE POLICY "media_assets_insert_admin" ON public.media_assets
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "media_assets_update_admin" ON public.media_assets;
CREATE POLICY "media_assets_update_admin" ON public.media_assets
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "media_assets_delete_admin" ON public.media_assets;
CREATE POLICY "media_assets_delete_admin" ON public.media_assets
  FOR DELETE USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_media_assets_storage_path ON public.media_assets(storage_path);


-- ─────────────────────────────────────────────
-- 7. STORAGE BUCKET & STORAGE RLS POLICIES
-- ─────────────────────────────────────────────
-- Ensure the portfolio-public bucket exists with appropriate restrictions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-public',
  'portfolio-public',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Public read access for portfolio-public
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for portfolio-public'
  ) THEN
    CREATE POLICY "Public Access for portfolio-public" ON storage.objects
      FOR SELECT USING (bucket_id = 'portfolio-public');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Upload for portfolio-public'
  ) THEN
    CREATE POLICY "Admin Upload for portfolio-public" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'portfolio-public' AND public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Update for portfolio-public'
  ) THEN
    CREATE POLICY "Admin Update for portfolio-public" ON storage.objects
      FOR UPDATE USING (bucket_id = 'portfolio-public' AND public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Delete for portfolio-public'
  ) THEN
    CREATE POLICY "Admin Delete for portfolio-public" ON storage.objects
      FOR DELETE USING (bucket_id = 'portfolio-public' AND public.is_admin());
  END IF;
END $$;


-- ─────────────────────────────────────────────
-- 8. PERMISSIONS & GRANTS
-- ─────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

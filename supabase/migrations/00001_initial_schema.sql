-- =============================================================================
-- Portfolio Database Schema — Initial Migration
-- =============================================================================
-- This migration creates all core tables, enums, indexes, RLS policies,
-- triggers, and the is_admin() helper function for the portfolio CMS.
--
-- Run this migration against a fresh Supabase PostgreSQL database.
-- =============================================================================

-- ─────────────────────────────────────────────
-- 1. EXTENSIONS
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 2. CUSTOM TYPES (ENUMS)
-- ─────────────────────────────────────────────
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE project_status_enum AS ENUM ('concept', 'prototype', 'in_development', 'completed');
CREATE TYPE education_entry_type AS ENUM ('education', 'certificate', 'training');

-- ─────────────────────────────────────────────
-- 3. HELPER FUNCTION: is_admin()
-- ─────────────────────────────────────────────
-- SECURITY DEFINER function with a fixed search_path to avoid recursive RLS.
-- Returns TRUE if the currently authenticated user is in the admin_users table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────
-- 4. HELPER FUNCTION: trigger_set_updated_at()
-- ─────────────────────────────────────────────
-- Reusable trigger function for auto-updating the updated_at column.
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
-- 5. TABLES
-- ─────────────────────────────────────────────

-- A. admin_users
CREATE TABLE public.admin_users (
  user_id   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users: only admins can read, no public insert/update/delete
CREATE POLICY "admin_users_select_admin" ON public.admin_users
  FOR SELECT USING (public.is_admin());

-- No INSERT/UPDATE/DELETE policies — only service-role can modify this table


-- B. profiles
CREATE TABLE public.profiles (
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
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read profiles (it's a portfolio)
CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (true);

-- Admin: can update profiles
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin: can insert profiles
CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- C. site_settings
CREATE TABLE public.site_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL UNIQUE,
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read site settings
CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (true);

-- Admin: can update site settings
CREATE POLICY "site_settings_update_admin" ON public.site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin: can insert site settings
CREATE POLICY "site_settings_insert_admin" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- D. projects
CREATE TABLE public.projects (
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

-- Public: only published projects
CREATE POLICY "projects_select_public" ON public.projects
  FOR SELECT USING (status = 'published');

-- Admin: can see all projects
CREATE POLICY "projects_select_admin" ON public.projects
  FOR SELECT USING (public.is_admin());

-- Admin: full write access
CREATE POLICY "projects_insert_admin" ON public.projects
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "projects_update_admin" ON public.projects
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "projects_delete_admin" ON public.projects
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_featured ON public.projects(is_featured) WHERE is_featured = true;
CREATE INDEX idx_projects_sort ON public.projects(sort_order);

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- E. achievements
CREATE TABLE public.achievements (
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

CREATE POLICY "achievements_select_public" ON public.achievements
  FOR SELECT USING (status = 'published');

CREATE POLICY "achievements_select_admin" ON public.achievements
  FOR SELECT USING (public.is_admin());

CREATE POLICY "achievements_insert_admin" ON public.achievements
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "achievements_update_admin" ON public.achievements
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "achievements_delete_admin" ON public.achievements
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_achievements_status ON public.achievements(status);
CREATE INDEX idx_achievements_slug ON public.achievements(slug);
CREATE INDEX idx_achievements_sort ON public.achievements(sort_order);

CREATE TRIGGER set_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- F. education
CREATE TABLE public.education (
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

CREATE POLICY "education_select_public" ON public.education
  FOR SELECT USING (status = 'published');

CREATE POLICY "education_select_admin" ON public.education
  FOR SELECT USING (public.is_admin());

CREATE POLICY "education_insert_admin" ON public.education
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "education_update_admin" ON public.education
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "education_delete_admin" ON public.education
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_education_status ON public.education(status);
CREATE INDEX idx_education_sort ON public.education(sort_order);

CREATE TRIGGER set_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- G. gallery_items
CREATE TABLE public.gallery_items (
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

CREATE POLICY "gallery_items_select_public" ON public.gallery_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "gallery_items_select_admin" ON public.gallery_items
  FOR SELECT USING (public.is_admin());

CREATE POLICY "gallery_items_insert_admin" ON public.gallery_items
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "gallery_items_update_admin" ON public.gallery_items
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "gallery_items_delete_admin" ON public.gallery_items
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_gallery_items_status ON public.gallery_items(status);
CREATE INDEX idx_gallery_items_featured ON public.gallery_items(is_featured) WHERE is_featured = true;
CREATE INDEX idx_gallery_items_sort ON public.gallery_items(sort_order);

CREATE TRIGGER set_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- H. blog_categories
CREATE TABLE public.blog_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_id     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read categories
CREATE POLICY "blog_categories_select_public" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "blog_categories_insert_admin" ON public.blog_categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "blog_categories_update_admin" ON public.blog_categories
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "blog_categories_delete_admin" ON public.blog_categories
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_blog_categories_slug ON public.blog_categories(slug);

CREATE TRIGGER set_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- I. blog_posts
CREATE TABLE public.blog_posts (
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

-- Public: only published posts
CREATE POLICY "blog_posts_select_public" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "blog_posts_select_admin" ON public.blog_posts
  FOR SELECT USING (public.is_admin());

CREATE POLICY "blog_posts_insert_admin" ON public.blog_posts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "blog_posts_update_admin" ON public.blog_posts
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "blog_posts_delete_admin" ON public.blog_posts
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON public.blog_posts(is_featured) WHERE is_featured = true;

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


-- J. media_assets
CREATE TABLE public.media_assets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_path      TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  size_bytes        BIGINT NOT NULL,
  alt_text          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Admin only: read, create, update, delete
CREATE POLICY "media_assets_select_admin" ON public.media_assets
  FOR SELECT USING (public.is_admin());

CREATE POLICY "media_assets_insert_admin" ON public.media_assets
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "media_assets_update_admin" ON public.media_assets
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "media_assets_delete_admin" ON public.media_assets
  FOR DELETE USING (public.is_admin());

CREATE INDEX idx_media_assets_storage_path ON public.media_assets(storage_path);


-- ─────────────────────────────────────────────
-- 6. STORAGE BUCKETS (documentation only)
-- ─────────────────────────────────────────────
-- Storage buckets must be created via the Supabase dashboard or CLI:
--
-- Bucket: portfolio-public
--   - Public: YES (for published images)
--   - Allowed MIME types: image/jpeg, image/png, image/webp, image/avif
--   - Max file size: 5MB
--   - RLS: Allow public read, admin-only upload/delete
--
-- Bucket: portfolio-private (optional)
--   - Public: NO
--   - Same MIME types and size limits
--   - RLS: Admin-only read/upload/delete
--
-- Storage RLS policies should be configured after bucket creation.
-- See docs/SECURITY.md for detailed storage policy definitions.

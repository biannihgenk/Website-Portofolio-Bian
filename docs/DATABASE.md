# Database Architecture & Schema — Debian Firwanto Portfolio

## 1. Overview

The database is built on Supabase PostgreSQL with strict Row Level Security (RLS) enabled on all application tables. The schema is fully version-controlled under `supabase/migrations/`.

---

## 2. Entity Relationship Summary

```
                      ┌──────────────────────┐
                      │     admin_users      │
                      │  (user_id, created)  │
                      └──────────────────────┘
                                  │
                                  │ validates is_admin()
                                  ▼
┌──────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│     profiles     │  │     site_settings    │  │       projects       │
│ (bio, links, etc)│  │ (key-value config)   │  │(slug, tech, status)  │
└──────────────────┘  └──────────────────────┘  └──────────────────────┘
                                                           │
┌──────────────────┐  ┌──────────────────────┐             │
│   achievements   │  │      education       │             │
│(awards, certs)   │  │(institutions, degrees│             │
└──────────────────┘  └──────────────────────┘             ▼
                                                        ┌──────────────────────┐
┌──────────────────┐  ┌──────────────────────┐          │     media_assets     │
│   blog_posts     │──┤   blog_categories    │          │ (storage_path, MIME) │
│ (slug, content)  │  │   (name, slug, sort) │          └──────────────────────┘
└──────────────────┘  └──────────────────────┘
          │
          ▼
┌──────────────────┐
│  gallery_items   │
│(images, captions)│
└──────────────────┘
```

---

## 3. Table Definitions & Schemas

### 3.1 `admin_users`
- **Purpose**: Database-backed authorization for single-admin policy.
- **Columns**:
  - `user_id` (`UUID`, PK, references `auth.users(id)` ON DELETE CASCADE).
  - `created_at` (`TIMESTAMPTZ`, default `now()`).
- **RLS**: Admin only read/insert/delete. Non-admins cannot query or modify this table.

### 3.2 `profiles`
- **Purpose**: Owner personal biography, headline, contact email, and social profiles.
- **Columns**: `id` (`UUID`, PK), `full_name`, `nickname`, `headline`, `bio_id`, `bio_en`, `school`, `study_program`, `location`, `avatar_path`, `email_public`, `github_url`, `linkedin_url`, `instagram_url`, `created_at`, `updated_at`.
- **RLS**: Public read; admin update/insert.

### 3.3 `site_settings`
- **Purpose**: Global configuration key-value store (JSONB).
- **Columns**: `id`, `key` (UNIQUE), `value` (`JSONB`), `description`, `is_public` (`BOOLEAN`, default false), `created_at`, `updated_at`.
- **RLS**: Public read only where `is_public = true`; admin full CRUD.

### 3.4 `projects`
- **Purpose**: Software engineering showcase items.
- **Columns**: `id`, `slug` (UNIQUE), `title_id`, `title_en`, `summary_id`, `summary_en`, `description_id`, `description_en`, `project_status`, `technologies` (`JSONB`), `repo_url`, `demo_url`, `cover_image_path`, `is_featured`, `sort_order`, `status` (`content_status`: 'draft', 'published', 'archived'), `published_at`, `created_at`, `updated_at`.
- **RLS**: Public reads only where `status = 'published'`; admin full CRUD.

### 3.5 `achievements`
- **Purpose**: Certifications, awards, competition placements, and honors.
- **Columns**: `id`, `slug` (UNIQUE), `title_id`, `title_en`, `description_id`, `description_en`, `organization`, `achievement_date` (`DATE`), `category`, `image_path`, `credential_url`, `sort_order`, `status` (`content_status`), `published_at`, `created_at`, `updated_at`.
- **RLS**: Public reads only where `status = 'published'`; admin full CRUD.

### 3.6 `education`
- **Purpose**: Formal academic degrees, certifications, and vocational courses.
- **Columns**: `id`, `institution`, `program`, `description_id`, `description_en`, `start_date`, `end_date`, `is_current`, `entry_type` (`education_entry_type`: 'education', 'certificate', 'training'), `credential_url`, `image_path`, `sort_order`, `status` (`content_status`), `published_at`, `created_at`, `updated_at`.
- **RLS**: Public reads only where `status = 'published'`; admin full CRUD.

### 3.7 `gallery_items`
- **Purpose**: Photographs, event captures, and visual media with bilingual captions.
- **Columns**: `id`, `title`, `caption_id`, `caption_en`, `image_path`, `alt_text`, `category`, `captured_at`, `is_featured`, `sort_order`, `status` (`content_status`), `created_at`, `updated_at`.
- **RLS**: Public reads only where `status = 'published'`; admin full CRUD.

### 3.8 `blog_categories`
- **Purpose**: Taxonomy and categorization for technical articles.
- **Columns**: `id`, `name_id`, `name_en`, `slug` (UNIQUE), `sort_order`, `created_at`, `updated_at`.
- **RLS**: Public read; admin full CRUD.

### 3.9 `blog_posts`
- **Purpose**: Technical articles and long-form writing.
- **Columns**: `id`, `slug` (UNIQUE), `title_id`, `title_en`, `excerpt_id`, `excerpt_en`, `content_id`, `content_en`, `cover_image_path`, `category_id` (FK `blog_categories`), `tags` (`JSONB`), `is_featured`, `reading_time_minutes`, `seo_title_id`, `seo_title_en`, `seo_description_id`, `seo_description_en`, `status` (`content_status`), `published_at`, `created_at`, `updated_at`.
- **RLS**: Public reads only where `status = 'published'`; admin full CRUD.

### 3.10 `media_assets`
- **Purpose**: Metadata tracking for uploaded files in Supabase Storage (`portfolio-public`).
- **Columns**: `id`, `storage_path` (UNIQUE), `original_filename`, `mime_type`, `size_bytes`, `alt_text`, `created_at`.
- **RLS**: Admin only read, insert, update, delete.

---

## 4. Helper Functions & Triggers

- `public.is_admin()`: A `SECURITY DEFINER` function executing `SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())`. This isolates privilege checking to the database layer.
- `public.trigger_set_updated_at()`: Trigger applied to all content tables to automatically set `updated_at = now()` before row updates.

---

## 5. Migration and Seed Workflow

1. **Migrations directory**: `supabase/migrations/00001_initial_schema.sql`
2. **Apply migrations**:
   ```bash
   npx supabase db push
   # or with local Supabase CLI:
   supabase db reset
   ```
3. **Seed development database**:
   ```bash
   psql $DATABASE_URL -f supabase/seed.sql
   # or via Supabase dashboard SQL editor
   ```
4. **Regenerate TypeScript Types**:
   ```bash
   npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
   ```

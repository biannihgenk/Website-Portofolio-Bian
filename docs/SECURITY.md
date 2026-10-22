# Security Architecture & Policies — Portfolio Debian Firwanto

## 1. Threat Assumptions & Perimeter

1. **Adversary capabilities**: Anonymous Internet visitors can send arbitrary HTTP requests, tamper with parameters, inspect client JavaScript bundles, and query Supabase endpoints directly with the public anonymous key.
2. **Untrusted network**: Client-side storage and cookies must be secured with modern cookie flags (`HttpOnly`, `SameSite=Lax`, `Secure`).
3. **Single Owner**: Only Debian Firwanto (`firwanto.debian@gmail.com`) is permitted to create, modify, publish, or delete content and media.

---

## 2. Row Level Security (RLS) Policies

RLS is enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) on all 10 application tables.

| Table | Anonymous / Public Access | Authenticated Admin Access |
|---|---|---|
| `admin_users` | Denied | SELECT, INSERT, DELETE (via `is_admin()`) |
| `profiles` | SELECT (all rows) | UPDATE, INSERT |
| `site_settings` | SELECT (only where `is_public = true`) | SELECT, INSERT, UPDATE, DELETE |
| `projects` | SELECT (only where `status = 'published'`) | Full CRUD (draft, published, archived) |
| `achievements` | SELECT (only where `status = 'published'`) | Full CRUD (draft, published, archived) |
| `education` | SELECT (only where `status = 'published'`) | Full CRUD (draft, published, archived) |
| `gallery_items` | SELECT (only where `status = 'published'`) | Full CRUD (draft, published, archived) |
| `blog_categories`| SELECT (all rows) | Full CRUD |
| `blog_posts` | SELECT (only where `status = 'published'`) | Full CRUD (draft, published, archived) |
| `media_assets` | Denied | Full CRUD |

---

## 3. Storage Security & Media Validation

### 3.1 Bucket Configuration
- **`portfolio-public`**:
  - Purpose: Public images (avatars, project covers, gallery photos).
  - Publicly accessible via HTTP for image display.
  - Upload & delete operations restricted to authenticated admin only via Storage RLS.
- **`portfolio-private`** (optional):
  - Retained for sensitive documents or draft-only media if needed.
  - Private; access requires signed URLs generated on the server.

### 3.2 Upload Validation Rules (`src/lib/storage/index.ts`)
1. **Size Limit**: Maximum 5 MB (`5 * 1024 * 1024` bytes).
2. **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
3. **SVG Disallowed**: SVG uploads are explicitly rejected to prevent Stored Cross-Site Scripting (XSS).
4. **Unique Paths**: Files are saved with timestamps and cryptographically random UUIDs (`${folder}/${Date.now()}-${uuid}.${ext}`) to eliminate path traversal and collisions.

---

## 4. Secret Management & Client Bundle Protection

- **No Secrets in Client Code**: All environment variables containing secrets (`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL_ALLOWLIST`) omit the `NEXT_PUBLIC_` prefix and are imported exclusively into server files (`src/lib/supabase/admin.ts`, `src/lib/auth/index.ts`).
- **Validation at Startup**: `src/lib/env.ts` validates all required environment variables with Zod schemas. If any required secret is missing or invalid, an explicit error is thrown on the server without leaking values.
- **Git Hygiene**: `.env`, `.env.local`, and private key files are strictly ignored in `.gitignore`. Only `.env.example` with blank/placeholder values is tracked in version control.

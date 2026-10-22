/**
 * Database types for Supabase PostgreSQL.
 *
 * NOTE: This file is manually authored as the initial type definition.
 * Once a Supabase project is connected, regenerate these types using:
 *   npx supabase gen types typescript --project-id <project-ref> > src/types/database.types.ts
 *
 * The generated types will replace this file entirely.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Content publication status */
export type ContentStatus = "draft" | "published" | "archived";

/** Project development stage */
export type ProjectStatus = "concept" | "prototype" | "in_development" | "completed";

/** Education entry type */
export type EducationEntryType = "education" | "certificate" | "training";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          nickname: string | null;
          headline: string | null;
          bio_id: string | null;
          bio_en: string | null;
          school: string | null;
          study_program: string | null;
          location: string | null;
          avatar_path: string | null;
          email_public: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          instagram_url: string | null;
          interests: Json | null;
          random_facts: Json | null;
          character_notes: Json | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          nickname?: string | null;
          headline?: string | null;
          bio_id?: string | null;
          bio_en?: string | null;
          school?: string | null;
          study_program?: string | null;
          location?: string | null;
          avatar_path?: string | null;
          email_public?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          interests?: Json | null;
          random_facts?: Json | null;
          character_notes?: Json | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          nickname?: string | null;
          headline?: string | null;
          bio_id?: string | null;
          bio_en?: string | null;
          school?: string | null;
          study_program?: string | null;
          location?: string | null;
          avatar_path?: string | null;
          email_public?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          interests?: Json | null;
          random_facts?: Json | null;
          character_notes?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title_id: string;
          title_en: string;
          summary_id: string;
          summary_en: string;
          description_id: string | null;
          description_en: string | null;
          cover_image_path: string | null;
          gallery_paths: Json | null;
          technologies: Json | null;
          project_url: string | null;
          repository_url: string | null;
          category: string;
          project_status: ProjectStatus;
          is_featured: boolean;
          sort_order: number;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_id: string;
          title_en: string;
          summary_id: string;
          summary_en: string;
          description_id?: string | null;
          description_en?: string | null;
          cover_image_path?: string | null;
          gallery_paths?: Json | null;
          technologies?: Json | null;
          project_url?: string | null;
          repository_url?: string | null;
          category: string;
          project_status?: ProjectStatus;
          is_featured?: boolean;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_id?: string;
          title_en?: string;
          summary_id?: string;
          summary_en?: string;
          description_id?: string | null;
          description_en?: string | null;
          cover_image_path?: string | null;
          gallery_paths?: Json | null;
          technologies?: Json | null;
          project_url?: string | null;
          repository_url?: string | null;
          category?: string;
          project_status?: ProjectStatus;
          is_featured?: boolean;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          title_id: string;
          title_en: string;
          description_id: string | null;
          description_en: string | null;
          organization: string | null;
          achievement_date: string | null;
          category: string;
          image_path: string | null;
          credential_url: string | null;
          sort_order: number;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_id: string;
          title_en: string;
          description_id?: string | null;
          description_en?: string | null;
          organization?: string | null;
          achievement_date?: string | null;
          category: string;
          image_path?: string | null;
          credential_url?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_id?: string;
          title_en?: string;
          description_id?: string | null;
          description_en?: string | null;
          organization?: string | null;
          achievement_date?: string | null;
          category?: string;
          image_path?: string | null;
          credential_url?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          institution: string;
          program: string | null;
          description_id: string | null;
          description_en: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          entry_type: EducationEntryType;
          credential_url: string | null;
          image_path: string | null;
          sort_order: number;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          program?: string | null;
          description_id?: string | null;
          description_en?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          entry_type?: EducationEntryType;
          credential_url?: string | null;
          image_path?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          program?: string | null;
          description_id?: string | null;
          description_en?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          entry_type?: EducationEntryType;
          credential_url?: string | null;
          image_path?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          caption_id: string | null;
          caption_en: string | null;
          image_path: string;
          alt_text: string;
          category: string;
          captured_at: string | null;
          is_featured: boolean;
          sort_order: number;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          caption_id?: string | null;
          caption_en?: string | null;
          image_path: string;
          alt_text: string;
          category: string;
          captured_at?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          caption_id?: string | null;
          caption_en?: string | null;
          image_path?: string;
          alt_text?: string;
          category?: string;
          captured_at?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title_id: string;
          title_en: string;
          excerpt_id: string;
          excerpt_en: string;
          content_id: string | null;
          content_en: string | null;
          cover_image_path: string | null;
          category_id: string | null;
          tags: Json | null;
          is_featured: boolean;
          reading_time_minutes: number | null;
          seo_title_id: string | null;
          seo_title_en: string | null;
          seo_description_id: string | null;
          seo_description_en: string | null;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_id: string;
          title_en: string;
          excerpt_id: string;
          excerpt_en: string;
          content_id?: string | null;
          content_en?: string | null;
          cover_image_path?: string | null;
          category_id?: string | null;
          tags?: Json | null;
          is_featured?: boolean;
          reading_time_minutes?: number | null;
          seo_title_id?: string | null;
          seo_title_en?: string | null;
          seo_description_id?: string | null;
          seo_description_en?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_id?: string;
          title_en?: string;
          excerpt_id?: string;
          excerpt_en?: string;
          content_id?: string | null;
          content_en?: string | null;
          cover_image_path?: string | null;
          category_id?: string | null;
          tags?: Json | null;
          is_featured?: boolean;
          reading_time_minutes?: number | null;
          seo_title_id?: string | null;
          seo_title_en?: string | null;
          seo_description_id?: string | null;
          seo_description_en?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          id: string;
          name_id: string;
          name_en: string;
          slug: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_id: string;
          name_en: string;
          slug: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_id?: string;
          name_en?: string;
          slug?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          storage_path?: string;
          original_filename?: string;
          mime_type?: string;
          size_bytes?: number;
          alt_text?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      content_status: ContentStatus;
      project_status_enum: ProjectStatus;
      education_entry_type: EducationEntryType;
    };
  };
}

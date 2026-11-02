"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { Json } from "@/types/database.types";

export interface SettingActionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

export async function upsertSettingAction(
  key: string,
  value: Json,
  description?: string,
  isPublic: boolean = true
): Promise<SettingActionState> {
  await requireAdmin();
  const supabase = await createClient();

  if (!key || typeof key !== "string" || !key.trim()) {
    return { success: false, message: "Kunci pengaturan (key) wajib diisi." };
  }

  const cleanKey = key.trim().toLowerCase();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: cleanKey,
        value,
        description: description?.trim() || null,
        is_public: isPublic,
      },
      { onConflict: "key" }
    );

  if (error) {
    return { success: false, message: `Gagal menyimpan pengaturan: ${error.message}` };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return {
    success: true,
    message: `Pengaturan "${cleanKey}" berhasil disimpan.`,
  };
}

export async function deleteSettingAction(
  key: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .delete()
    .eq("key", key);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "page");

  return { success: true };
}

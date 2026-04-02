import { supabase } from "./supabaseClient";

export function resolveMediaUrl(media) {
  if (!media) {
    return "";
  }

  if (media.source_type === "external") {
    return media.external_url || "";
  }

  if (media.storage_bucket && media.storage_path) {
    const { data } = supabase.storage
      .from(media.storage_bucket)
      .getPublicUrl(media.storage_path);

    return data?.publicUrl || "";
  }

  return "";
}

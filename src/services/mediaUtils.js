import { supabase } from "./supabaseClient";

const DEFAULT_MEDIA_BUCKET = "portfolio-public";
const OPTIMIZED_IMAGE_EXTENSION =
  /\.(png|jpe?g|webp)$/i;

export function getOptimizedStoragePath(path) {
  if (!path) {
    return "";
  }

  if (!OPTIMIZED_IMAGE_EXTENSION.test(path)) {
    return path;
  }

  return path.replace(OPTIMIZED_IMAGE_EXTENSION, ".webp");
}

export function getPublicImageUrl(
  path,
  bucket = DEFAULT_MEDIA_BUCKET
) {
  if (!path) {
    return "";
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(getOptimizedStoragePath(path));

  return data?.publicUrl || "";
}

export function normalizeStorageMedia(media) {
  if (!media) {
    return null;
  }

  return {
    ...media,
    storage_path: getOptimizedStoragePath(media.storage_path),
  };
}

export function resolveMediaUrl(media) {
  if (!media) {
    return "";
  }

  if (media.external_url) {
    return media.external_url || "";
  }

  if (media.storage_path) {
    return getPublicImageUrl(
      media.storage_path,
      media.storage_bucket || DEFAULT_MEDIA_BUCKET
    );
  }

  return "";
}

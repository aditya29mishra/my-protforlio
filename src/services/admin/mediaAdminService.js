import { supabase } from "../supabaseClient";
import { resolveMediaUrl } from "../mediaUtils";

const BUCKET_NAME = "portfolio-public";

/**
 * Uploads a file to Supabase Storage and inserts a media DB record.
 * 
 * @param {File} file - Browser File object
 * @param {string} prefix - Storage path prefix, e.g. "projects/my-slug"
 * @param {Object} meta - { label, alt_text }
 * @returns {Promise<{ id: string, url: string, storage_path: string }>}
 */
export async function uploadMedia(file, prefix, meta) {
  // 1. Client-Side Validation Guards
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 5MB.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only image files are allowed.");
  }

  // 2. Normalize filename
  const sanitizedFilename = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  // 3. Build storage path
  const timestamp = Date.now();
  const storagePath = `${prefix}/${timestamp}-${sanitizedFilename}`;

  // 4. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, { upsert: false });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 5. Generate DB slug
  const slug = `${prefix}-${timestamp}`;

  // 6. Insert Database Record
  const { data, error: dbError } = await supabase
    .from("media")
    .insert({
      slug,
      label: meta.label,
      media_kind: "image",
      source_type: "storage",
      storage_bucket: BUCKET_NAME,
      storage_path: storagePath,
      mime_type: file.type,
      alt_text: meta.alt_text || meta.label,
      metadata: {},
    })
    .select("id, storage_path")
    .single();

  // 7. Handle DB failure with best-effort storage rollback
  if (dbError) {
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    throw new Error(`Database insert failed: ${dbError.message}`);
  }

  // 8. Resolve public URL
  const url = resolveMediaUrl({
    source_type: "storage",
    storage_bucket: BUCKET_NAME,
    storage_path: data.storage_path,
  });

  return { 
    id: data.id, 
    url, 
    storage_path: data.storage_path 
  };
}

/**
 * Deletes a media record from the database and its corresponding storage file.
 * 
 * @param {string} mediaId - UUID of the public.media record
 * @param {string} storagePath - Path in the storage bucket
 * @returns {Promise<void>}
 */
export async function deleteMedia(mediaId, storagePath) {
  // 1. Delete from DB first (if RLS prevents it, we shouldn't orphan storage)
  const { error: dbError } = await supabase
    .from("media")
    .delete()
    .eq("id", mediaId);

  if (dbError) {
    throw new Error(`Failed to delete media record: ${dbError.message}`);
  }

  // 2. Delete from Storage
  // If this fails, we have an orphan in storage, but DB state is clean.
  // Less critical than having a DB record pointing to a missing file.
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);
      
    if (storageError) {
      console.warn(`Failed to delete storage file ${storagePath}:`, storageError);
    }
  }
}

/**
 * Fetches existing media records for selection in the UI.
 * 
 * @returns {Promise<Array<{ id: string, label: string, url: string, storage_path: string, alt_text: string }>>}
 */
export async function listMedia() {
  const { data, error } = await supabase
    .from("media")
    .select("id, label, storage_path, alt_text, storage_bucket, source_type, external_url")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch media list: ${error.message}`);
  }

  return data.map((media) => {
    // We pass the full record context needed by resolveMediaUrl
    const url = resolveMediaUrl({
      source_type: media.source_type,
      storage_bucket: media.storage_bucket,
      storage_path: media.storage_path,
      external_url: media.external_url,
    });

    return {
      id: media.id,
      label: media.label,
      storage_path: media.storage_path,
      alt_text: media.alt_text,
      url,
    };
  });
}

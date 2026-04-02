import { supabase } from "../supabaseClient";

/**
 * Generates a URL-friendly slug from a string.
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Fetches all projects for the admin dashboard.
 * Explicitly requests only needed columns. No select("*").
 */
export async function fetchAdminProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id, slug, title, description, image_media_id, github_url, youtube_video_id, status, sort_order, created_at, updated_at,
      media:media (
        storage_path,
        storage_bucket,
        source_type
      )
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch admin projects: ${error.message}`);
  }

  return data || [];
}

/**
 * Inserts a new project.
 * Automatically generates a slug if one isn't provided.
 */
export async function createAdminProject(projectData) {
  const payload = {
    ...projectData,
    slug: generateSlug(projectData.title),
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return data;
}

/**
 * Updates an existing project by ID.
 */
export async function updateAdminProject(id, projectData) {
  // If title was changed significantly, we arguably might want to update the slug,
  // but changing slugs breaks existing public URLs. We only update provided fields.
  
  const { data, error } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  return data;
}

/**
 * Deletes a project by ID.
 */
export async function deleteAdminProject(id) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  return true;
}

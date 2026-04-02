import { supabase } from "../supabaseClient";

/**
 * Generates a URL-friendly slug from a string.
 */
function generateSlug(name, subtitle = "") {
  return `${name} ${subtitle}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 50); // Prevent overly long slugs from timeline concatenated org+role
}

export async function fetchAdminTimeline() {
  const { data, error } = await supabase
    .from("timeline_entries")
    .select("id, slug, organization_name, entry_type, role_title, tech_stack, summary, date_range, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch timeline: ${error.message}`);
  }

  return data || [];
}

export async function createAdminTimeline(timelineData) {
  const payload = {
    ...timelineData,
    slug: generateSlug(timelineData.organization_name, timelineData.role_title),
  };

  const { data, error } = await supabase
    .from("timeline_entries")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create timeline entry: ${error.message}`);
  }

  return data;
}

export async function updateAdminTimeline(id, timelineData) {
  const { data, error } = await supabase
    .from("timeline_entries")
    .update(timelineData)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to update timeline entry: ${error.message}`);
  }

  return data;
}

export async function deleteAdminTimeline(id) {
  const { error } = await supabase
    .from("timeline_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete timeline entry: ${error.message}`);
  }

  return true;
}

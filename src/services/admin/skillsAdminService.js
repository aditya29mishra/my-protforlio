import { supabase } from "../supabaseClient";

/**
 * Generates a URL-friendly slug from a string.
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function fetchAdminSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("id, slug, name, category, description, icon_key, sort_order, created_at, updated_at")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admin skills: ${error.message}`);
  }

  return data || [];
}

export async function createAdminSkill(skillData) {
  const payload = {
    ...skillData,
    slug: generateSlug(skillData.name),
  };

  const { data, error } = await supabase
    .from("skills")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create skill: ${error.message}`);
  }

  return data;
}

export async function updateAdminSkill(id, skillData) {
  const { data, error } = await supabase
    .from("skills")
    .update(skillData)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to update skill: ${error.message}`);
  }

  return data;
}

export async function deleteAdminSkill(id) {
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete skill: ${error.message}`);
  }

  return true;
}

import { supabase } from "./supabaseClient";

function mapSkillRecord(skill) {
  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    category: skill.category,
    description: skill.description,
    iconKey: skill.icon_key,
  };
}

export async function fetchSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("id, slug, name, category, description, icon_key")
    .eq("is_active", true)
    .order("category")
    .order("sort_order");

  if (error) {
    throw error;
  }

  return (data || []).map(mapSkillRecord);
}

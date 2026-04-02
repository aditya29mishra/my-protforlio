import { supabase } from "./supabaseClient";
import skillsData from "../pages/skillsData";

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

function shouldUseFallback(error) {
  return error?.code === "PGRST205";
}

export async function fetchSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("sort_order");

  if (error) {
    if (shouldUseFallback(error)) {
      return skillsData;
    }

    throw error;
  }

  return (data || []).map(mapSkillRecord);
}

import { supabase } from "./supabaseClient";

function mapTimelineRecord(entry) {
  return {
    id: entry.id,
    slug: entry.slug,
    name: entry.organization_name,
    timelineType: entry.entry_type,
    title: entry.role_title?.replace("Devloper", "Developer"),
    techStack: entry.tech_stack,
    summaryPoints: entry.summary,
    dateRange: entry.date_range,
  };
}

export async function fetchTimeline() {
  const { data, error } = await supabase
    .from("timeline_entries")
    .select(`
      id,
      slug,
      organization_name,
      entry_type,
      role_title,
      tech_stack,
      summary,
      date_range
    `)
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    throw error;
  }

  return (data || []).map(mapTimelineRecord);
}

import { supabase } from "./supabaseClient";
import { getTimeline } from "../pages/getTimeline";

function mapTimelineRecord(entry) {
  return {
    id: entry.id,
    slug: entry.slug,
    name: entry.organization_name,
    timelineType: entry.entry_type,
    title: entry.role_title,
    techStack: entry.tech_stack,
    summaryPoints: entry.summary,
    dateRange: entry.date_range,
  };
}

function shouldUseFallback(error) {
  return error?.code === "PGRST205";
}

export async function fetchTimeline() {
  const { data, error } = await supabase
    .from("timeline_entries")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    if (shouldUseFallback(error)) {
      return getTimeline();
    }

    throw error;
  }

  return (data || []).map(mapTimelineRecord);
}

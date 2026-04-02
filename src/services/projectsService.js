import { supabase } from "./supabaseClient";

function resolveMediaUrl(media) {
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

function mapProjectRecord(project) {
  const tags = [...(project.project_skill_tags || [])].sort(
    (left, right) => (left.sort_order || 0) - (right.sort_order || 0)
  );

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    techUsed: tags
      .map((tag) => tag.label || tag.skill?.name)
      .filter(Boolean)
      .join(", "),
    image: resolveMediaUrl(project.media),
    github: project.github_url,
    video: project.youtube_video_id,
  };
}

export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_skill_tags (
        id,
        label,
        sort_order,
        skill:skills!project_skill_tags_skill_id_fkey (*)
      ),
      media:media!projects_image_media_id_fkey (*)
    `)
    .eq("status", "published")
    .order("sort_order");

  if (error) throw error;

  return (data || []).map(mapProjectRecord);
}

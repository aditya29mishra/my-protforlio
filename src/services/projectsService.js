import { supabase } from "./supabaseClient";
import { resolveMediaUrl } from "./mediaUtils";

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
      id,
      slug,
      title,
      description,
      github_url,
      youtube_video_id,
      project_skill_tags (
        label,
        sort_order,
        skill:skills!project_skill_tags_skill_id_fkey (name)
      ),
      media:media!projects_image_media_id_fkey (
        source_type,
        storage_bucket,
        storage_path,
        external_url
      )
    `)
    .eq("status", "published")
    .order("sort_order");

  if (error) throw error;

  return (data || []).map(mapProjectRecord);
}

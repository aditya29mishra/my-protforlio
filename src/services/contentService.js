import { supabase } from "./supabaseClient";
import { normalizeStorageMedia, resolveMediaUrl } from "./mediaUtils";

function mapMusicItem(item) {
  if (item.item_type === "song") {
    return {
      slug: item.slug,
      embedUrl: item.embed_url,
    };
  }

  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    embedUrl: item.embed_url,
  };
}

export async function fetchMusicContent() {
  const { data, error } = await supabase
    .from("content_items")
    .select("slug, item_type, title, description, embed_url, sort_order")
    .eq("section", "music")
    .order("sort_order");

  if (error) {
    throw error;
  }

  const items = (data || []).map(mapMusicItem);

  return {
    songs: items.filter((item) => !item.title),
    collections: items.filter((item) => item.title),
  };
}

export async function fetchReadingContent() {
  const { data, error } = await supabase
    .from("content_items")
    .select(`
      slug,
      title,
      subtitle,
      description,
      media:media!content_items_media_id_fkey (
        source_type,
        storage_bucket,
        storage_path,
        external_url,
        alt_text
      )
    `)
    .eq("section", "reading")
    .eq("item_type", "book")
    .order("sort_order");

  if (error) {
    throw error;
  }

  return (data || []).map((item) => ({
    slug: item.slug,
    title: item.title,
    author: item.subtitle,
    description: item.description,
    image: resolveMediaUrl(normalizeStorageMedia(item.media)),
    alt: item.media?.alt_text || item.title,
  }));
}

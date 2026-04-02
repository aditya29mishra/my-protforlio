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

function mapMedia(media) {
  return {
    type: media?.source_type || null,
    url: resolveMediaUrl(media),
  };
}

function mapPersonas(personas, mediaById) {
  return personas.map((persona) => ({
    slug: persona.slug,
    label: persona.label,
    media: {
      avatar: mapMedia(mediaById.get(persona.avatar_media_id)),
      background: mapMedia(mediaById.get(persona.background_media_id)),
    },
    recommendationGroups: {
      topPicks: persona.top_picks_group_key,
      continueWatching: persona.continue_watching_group_key,
    },
  }));
}

function mapRecommendationGroups(recommendations, mediaById) {
  const groups = {
    topPicks: {},
    continueWatching: {},
  };

  recommendations.forEach((recommendation) => {
    const slotGroup =
      recommendation.slot_group === "top_picks"
        ? "topPicks"
        : "continueWatching";

    if (!groups[slotGroup][recommendation.recommendation_group_key]) {
      groups[slotGroup][recommendation.recommendation_group_key] = [];
    }

    groups[slotGroup][recommendation.recommendation_group_key].push({
      title: recommendation.title,
      route: recommendation.route,
      iconKey: recommendation.icon_key,
      media: mapMedia(mediaById.get(recommendation.media_id)),
    });
  });

  return groups;
}

export async function fetchPersonas() {
  const [personasResult, recommendationsResult, mediaResult] = await Promise.all(
    [
      supabase.from("personas").select("*").order("sort_order"),
      supabase
        .from("persona_recommendations")
        .select("*")
        .order("slot_group")
        .order("recommendation_group_key")
        .order("sort_order"),
      supabase.from("media").select("*"),
    ]
  );

  if (personasResult.error) {
    throw personasResult.error;
  }

  if (recommendationsResult.error) {
    throw recommendationsResult.error;
  }

  if (mediaResult.error) {
    throw mediaResult.error;
  }

  const mediaById = new Map(
    (mediaResult.data || []).map((media) => [media.id, media])
  );

  return {
    personas: mapPersonas(personasResult.data || [], mediaById),
    recommendationGroups: mapRecommendationGroups(
      recommendationsResult.data || [],
      mediaById
    ),
  };
}

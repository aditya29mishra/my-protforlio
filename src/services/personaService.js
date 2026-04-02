import { supabase } from "./supabaseClient";
import { resolveMediaUrl } from "./mediaUtils";

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
  const [personasResult, recommendationsResult] = await Promise.all([
    supabase
      .from("personas")
      .select(`
        slug,
        label,
        avatar_media_id,
        background_media_id,
        top_picks_group_key,
        continue_watching_group_key
      `)
      .order("sort_order"),
    supabase
      .from("persona_recommendations")
      .select(`
        slot_group,
        recommendation_group_key,
        title,
        route,
        icon_key,
        media_id
      `)
      .order("slot_group")
      .order("recommendation_group_key")
      .order("sort_order"),
  ]);

  if (personasResult.error) {
    throw personasResult.error;
  }

  if (recommendationsResult.error) {
    throw recommendationsResult.error;
  }

  const mediaIds = [
    ...new Set(
      [...(personasResult.data || []), ...(recommendationsResult.data || [])]
        .flatMap((item) => [
          item.avatar_media_id,
          item.background_media_id,
          item.media_id,
        ])
        .filter(Boolean)
    ),
  ];

  let mediaResult = { data: [], error: null };

  if (mediaIds.length > 0) {
    mediaResult = await supabase
      .from("media")
      .select("id, source_type, storage_bucket, storage_path, external_url")
      .in("id", mediaIds);
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

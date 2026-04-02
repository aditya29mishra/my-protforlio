import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES, THIRTY_MINUTES } from "../lib/queryClient";
import { fetchMusicContent } from "../services/contentService";

const musicQueryOptions = {
  queryKey: ["content", "music"],
  queryFn: fetchMusicContent,
  staleTime: TEN_MINUTES,
  gcTime: THIRTY_MINUTES,
};

export function useMusicContent() {
  const { data, isLoading, error } = useQuery(musicQueryOptions);

  return {
    songs: data?.songs || [],
    collections: data?.collections || [],
    loading: isLoading,
    error,
  };
}

import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES, THIRTY_MINUTES } from "../lib/queryClient";
import { fetchTimeline } from "../services/timelineService";

export const timelineQueryOptions = {
  queryKey: ["timeline"],
  queryFn: fetchTimeline,
  staleTime: TEN_MINUTES,
  gcTime: THIRTY_MINUTES,
};

export function useTimeline() {
  const { data, isLoading, error } = useQuery(timelineQueryOptions);

  return { timeline: data || [], loading: isLoading, error };
}

import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES, THIRTY_MINUTES } from "../lib/queryClient";
import { fetchReadingContent } from "../services/contentService";

const readingQueryOptions = {
  queryKey: ["content", "reading"],
  queryFn: fetchReadingContent,
  staleTime: TEN_MINUTES,
  gcTime: THIRTY_MINUTES,
};

export function useReadingContent() {
  const { data, isLoading, error } = useQuery(readingQueryOptions);

  return { books: data || [], loading: isLoading, error };
}

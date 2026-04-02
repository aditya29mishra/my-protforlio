import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES, THIRTY_MINUTES } from "../lib/queryClient";
import { fetchProjects } from "../services/projectsService";

export const projectsQueryOptions = {
  queryKey: ["projects"],
  queryFn: fetchProjects,
  staleTime: TEN_MINUTES,
  gcTime: THIRTY_MINUTES,
};

export function useProjects() {
  const { data, isLoading, error } = useQuery(projectsQueryOptions);

  return { projects: data || [], loading: isLoading, error };
}

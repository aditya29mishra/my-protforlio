import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES, THIRTY_MINUTES } from "../lib/queryClient";
import { fetchSkills } from "../services/skillsService";

export const skillsQueryOptions = {
  queryKey: ["skills"],
  queryFn: fetchSkills,
  staleTime: TEN_MINUTES,
  gcTime: THIRTY_MINUTES,
};

export function useSkills() {
  const { data, isLoading, error } = useQuery(skillsQueryOptions);

  return { skills: data || [], loading: isLoading, error };
}

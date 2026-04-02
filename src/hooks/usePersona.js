import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES, THIRTY_MINUTES } from "../lib/queryClient";
import { fetchPersonas } from "../services/personaService";

const EMPTY_PERSONA_DATA = {
  personas: [],
  recommendationGroups: {
    topPicks: {},
    continueWatching: {},
  },
};

const DEFAULT_PROFILE = "recruiter";

export const personasQueryOptions = {
  queryKey: ["personas"],
  queryFn: fetchPersonas,
  staleTime: TEN_MINUTES,
  gcTime: THIRTY_MINUTES,
};

export function usePersona(profileName) {
  const {
    data = EMPTY_PERSONA_DATA,
    isLoading,
    error,
  } = useQuery(personasQueryOptions);

  const personas = data.personas;
  const validProfiles = personas.map((persona) => persona.slug);
  const profile = validProfiles.includes(profileName)
    ? profileName
    : DEFAULT_PROFILE;
  const persona =
    personas.find((entry) => entry.slug === profile) || personas[0] || null;

  return {
    personasData: data,
    personas,
    persona,
    profile,
    loading: isLoading,
    error,
  };
}

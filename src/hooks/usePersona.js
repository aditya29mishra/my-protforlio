import { useEffect, useState } from "react";
import { fetchPersonas } from "../services/personaService";

const EMPTY_PERSONA_DATA = {
  personas: [],
  recommendationGroups: {
    topPicks: {},
    continueWatching: {},
  },
};

const DEFAULT_PROFILE = "recruiter";

export function usePersona(profileName) {
  const [personasData, setPersonasData] = useState(EMPTY_PERSONA_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchPersonas()
      .then((data) => {
        if (isActive) {
          setPersonasData(data);
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const personas = personasData.personas;
  const validProfiles = personas.map((persona) => persona.slug);
  const profile = validProfiles.includes(profileName)
    ? profileName
    : DEFAULT_PROFILE;
  const persona =
    personas.find((entry) => entry.slug === profile) || personas[0] || null;

  return { personasData, personas, persona, profile, loading, error };
}

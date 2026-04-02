import { useEffect, useState } from "react";
import { fetchMusicContent } from "../services/contentService";

export function useMusicContent() {
  const [songs, setSongs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchMusicContent()
      .then((data) => {
        if (isActive) {
          setSongs(data.songs);
          setCollections(data.collections);
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

  return { songs, collections, loading, error };
}

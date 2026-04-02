import { useEffect, useState } from "react";
import { fetchTimeline } from "../services/timelineService";

export function useTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchTimeline()
      .then((data) => {
        if (isActive) {
          setTimeline(data);
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

  return { timeline, loading, error };
}

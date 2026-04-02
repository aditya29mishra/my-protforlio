import { useEffect, useState } from "react";
import { fetchReadingContent } from "../services/contentService";

export function useReadingContent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchReadingContent()
      .then((data) => {
        if (isActive) {
          setBooks(data);
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

  return { books, loading, error };
}

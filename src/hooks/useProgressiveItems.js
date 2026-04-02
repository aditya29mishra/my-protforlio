import { useEffect, useState } from "react";

export function useProgressiveItems(items, initialCount = 6, batchSize = 6) {
  const safeItems = items || [];
  const [visibleCount, setVisibleCount] = useState(
    Math.min(initialCount, safeItems.length)
  );

  useEffect(() => {
    setVisibleCount(Math.min(initialCount, safeItems.length));

    if (safeItems.length <= initialCount) {
      return undefined;
    }

    let cancelled = false;
    let timeoutId = null;
    let idleId = null;

    const scheduleNextBatch = () => {
      const run = () => {
        if (cancelled) {
          return;
        }

        setVisibleCount((currentCount) => {
          const nextCount = Math.min(currentCount + batchSize, safeItems.length);

          if (nextCount < safeItems.length) {
            scheduleNextBatch();
          }

          return nextCount;
        });
      };

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(run, { timeout: 250 });
      } else {
        timeoutId = window.setTimeout(run, 120);
      }
    };

    scheduleNextBatch();

    return () => {
      cancelled = true;

      if (
        idleId &&
        typeof window !== "undefined" &&
        "cancelIdleCallback" in window
      ) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [safeItems.length, initialCount, batchSize]);

  return safeItems.slice(0, visibleCount);
}

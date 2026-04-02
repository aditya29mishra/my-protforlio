import { QueryClient } from "@tanstack/react-query";

export const TEN_MINUTES = 1000 * 60 * 10;
export const THIRTY_MINUTES = 1000 * 60 * 30;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TEN_MINUTES,
      gcTime: THIRTY_MINUTES,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export const queryClientFrequentRefetch = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000 * 30,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

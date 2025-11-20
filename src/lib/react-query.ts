import { QueryClient, QueryClientConfig } from "@tanstack/react-query";

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // Disable retry for mutations to prevent double submissions
    },
  },
};

const queryClient = new QueryClient(queryConfig);

export default queryClient;

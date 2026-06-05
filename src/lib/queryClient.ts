import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,                // always refetch on mount/window refresh
      gcTime: 5 * 60 * 1000,      // keep in-memory cache 5min for navigation
      retry: 1,
      refetchOnWindowFocus: false, // avoid refetch on tab focus
    },
  },
})

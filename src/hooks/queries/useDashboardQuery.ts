import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard.api'

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000, // auto-refresh every 5 min
  })
}

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard.api'

export const useTodayOverviewQuery = () =>
  useQuery({
    queryKey: ['dashboard', 'today-overview'],
    queryFn: () => dashboardApi.getTodayOverview(),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })

import { useQuery } from '@tanstack/react-query'
import { plansApi } from '../../api/plans.api'

export const usePlansQuery = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => plansApi.list(),
    staleTime: 5 * 60_000,
  })
}

export const usePlanQuery = (id: string) => {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => plansApi.getById(id),
    staleTime: 5 * 60_000,
    enabled: !!id,
  })
}

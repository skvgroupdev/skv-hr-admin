import { useQuery } from '@tanstack/react-query'
import { positionsApi } from '../../api/positions.api'

interface UsePositionsQueryParams {
  page?: number
  limit?: number
}

export const usePositionsQuery = (params: UsePositionsQueryParams = {}) => {
  return useQuery({
    queryKey: ['positions', params],
    queryFn: () => positionsApi.list(params),
    staleTime: 30_000,
  })
}

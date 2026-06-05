import { useQuery } from '@tanstack/react-query'
import { positionsApi } from '../../api/positions.api'

export const usePositionQuery = (id: string) => {
  return useQuery({
    queryKey: ['positions', id],
    queryFn: () => positionsApi.getById(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

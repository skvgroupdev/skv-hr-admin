import { useQuery } from '@tanstack/react-query'
import { outsideWorkApi } from '../../api/outside-work.api'

export const useOutsideWorkPendingQuery = () => {
  return useQuery({
    queryKey: ['outside-work', 'pending'],
    queryFn: () => outsideWorkApi.getPending(),
    staleTime: 30_000,
  })
}

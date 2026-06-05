import { useQuery } from '@tanstack/react-query'
import { leaveApi } from '../../api/leave.api'

export const useLeavePendingQuery = () => {
  return useQuery({
    queryKey: ['leave', 'pending'],
    queryFn: () => leaveApi.getPending(),
    staleTime: 30_000,
  })
}

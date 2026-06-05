import { useQuery } from '@tanstack/react-query'
import { leaveApi } from '../../api/leave.api'

export const useLeaveTypesQuery = () => {
  return useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveApi.listTypes(),
    staleTime: 60_000,
  })
}

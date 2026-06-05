import { useQuery } from '@tanstack/react-query'
import { employeeRequestsApi } from '../../api/employee-requests.api'

interface Params {
  page: number
  limit: number
}

export const useMyLeaveRequestsQuery = (params: Params) =>
  useQuery({
    queryKey: ['leave', 'my', params],
    queryFn: () => employeeRequestsApi.getMyLeaves(params),
    staleTime: 60_000,
  })

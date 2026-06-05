import { useQuery } from '@tanstack/react-query'
import { employeeRequestsApi } from '../../api/employee-requests.api'

interface Params {
  page: number
  limit: number
}

export const useMyOutsideWorkRequestsQuery = (params: Params) =>
  useQuery({
    queryKey: ['outside-work', 'my', params],
    queryFn: () => employeeRequestsApi.getMyOutsideWork(params),
    staleTime: 60_000,
  })

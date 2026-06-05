import { useQuery } from '@tanstack/react-query'
import { employeeRequestsApi } from '../../api/employee-requests.api'

interface Params {
  page: number
  limit: number
}

export const useMyOTRequestsQuery = (params: Params) =>
  useQuery({
    queryKey: ['ot', 'my', params],
    queryFn: () => employeeRequestsApi.getMyOTs(params),
    staleTime: 60_000,
  })

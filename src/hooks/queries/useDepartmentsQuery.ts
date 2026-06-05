import { useQuery } from '@tanstack/react-query'
import { departmentsApi } from '../../api/departments.api'

interface UseDepartmentsQueryParams {
  page?: number
  limit?: number
}

export const useDepartmentsQuery = (params: UseDepartmentsQueryParams = {}) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => departmentsApi.list(params),
    staleTime: 30_000,
  })
}

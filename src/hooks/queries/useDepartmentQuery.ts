import { useQuery } from '@tanstack/react-query'
import { departmentsApi } from '../../api/departments.api'

export const useDepartmentQuery = (id: string) => {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => departmentsApi.getById(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

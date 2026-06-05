import { useQuery } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'

export const useEmployeeQuery = (id: string) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeesApi.getById(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

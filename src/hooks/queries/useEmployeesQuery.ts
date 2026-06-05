import { useQuery } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'
import type { EmployeeStatus } from '../../types/employee'

interface UseEmployeesQueryParams {
  page?: number
  limit?: number
  branchId?: string
  departmentId?: string
  status?: EmployeeStatus
  search?: string
}

export const useEmployeesQuery = (params: UseEmployeesQueryParams = {}) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeesApi.list(params),
    staleTime: 30_000,
  })
}

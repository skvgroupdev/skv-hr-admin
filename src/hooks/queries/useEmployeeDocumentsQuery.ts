import { useQuery } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees.api'

export const useEmployeeDocumentsQuery = (employeeId: string) => {
  return useQuery({
    queryKey: ['employees', employeeId, 'documents'],
    queryFn: () => employeesApi.getDocuments(employeeId),
    staleTime: 30_000,
    enabled: !!employeeId,
  })
}

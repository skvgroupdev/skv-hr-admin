import { useQuery } from '@tanstack/react-query'
import { shiftsApi } from '../../api/shifts.api'

export const useEmployeeShiftHistoryQuery = (employeeId: string) =>
  useQuery({
    queryKey: ['employees', employeeId, 'shift', 'history'],
    queryFn: () => shiftsApi.getEmployeeShiftHistory(employeeId),
    enabled: !!employeeId,
  })

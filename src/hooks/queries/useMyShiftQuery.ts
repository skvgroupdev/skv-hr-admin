import { useQuery } from '@tanstack/react-query'
import { employeeAttendanceApi } from '../../api/employee-attendance.api'

export const useMyShiftQuery = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ['shifts', 'my', employeeId],
    queryFn: () => employeeAttendanceApi.getMyShift(employeeId!),
    staleTime: 5 * 60_000,
    enabled: !!employeeId,
  })
}

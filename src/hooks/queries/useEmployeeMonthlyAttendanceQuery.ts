import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '../../api/attendance.api'

export const useEmployeeMonthlyAttendanceQuery = (
  employeeId: string,
  year: number,
  month: number,
) =>
  useQuery({
    queryKey: ['attendance', 'employee-monthly', employeeId, year, month],
    queryFn: () => attendanceApi.getEmployeeMonthlyReport(employeeId, year, month),
    enabled: Boolean(employeeId),
  })

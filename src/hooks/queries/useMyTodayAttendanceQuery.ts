import { useQuery } from '@tanstack/react-query'
import { employeeAttendanceApi } from '../../api/employee-attendance.api'

export const useMyTodayAttendanceQuery = () =>
  useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: () => employeeAttendanceApi.getMyToday(),
    staleTime: 30_000,
  })

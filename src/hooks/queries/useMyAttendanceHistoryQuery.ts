import { useQuery } from '@tanstack/react-query'
import { employeeAttendanceApi } from '../../api/employee-attendance.api'

interface Params {
  page: number
  limit: number
}

export const useMyAttendanceHistoryQuery = (params: Params) =>
  useQuery({
    queryKey: ['attendance', 'history', params],
    queryFn: () => employeeAttendanceApi.getMyHistory(params),
    staleTime: 2 * 60_000,
  })

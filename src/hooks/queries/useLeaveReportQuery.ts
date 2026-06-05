import { useQuery } from '@tanstack/react-query'
import { leaveApi } from '../../api/leave.api'

interface LeaveReportParams {
  page?: number
  status?: string
  year?: number
}

export const useLeaveReportQuery = (params: LeaveReportParams = {}) => {
  return useQuery({
    queryKey: ['leave', 'report', params],
    queryFn: () => leaveApi.getReport(params),
    staleTime: 30_000,
  })
}

import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '../../api/attendance.api'
import type { AttendanceReportQuery } from '../../types/attendance'

interface SummaryQueryParams {
  date?: string
  branchId?: string
}

export const useAttendanceSummaryQuery = (params: SummaryQueryParams = {}) =>
  useQuery({
    queryKey: ['attendance', 'summary', params.date ?? 'today', params.branchId ?? ''],
    queryFn: () => attendanceApi.getSummary(params),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })

type ReportType = 'late' | 'absent'

export const useAttendanceReportQuery = (type: ReportType, query: AttendanceReportQuery) => {
  const fetchers: Record<ReportType, (q: AttendanceReportQuery) => Promise<unknown>> = {
    late: attendanceApi.getLateReport,
    absent: attendanceApi.getLateReport,
  }

  return useQuery({
    queryKey: ['attendance', 'report', type, query],
    queryFn: () => fetchers[type](query),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })
}

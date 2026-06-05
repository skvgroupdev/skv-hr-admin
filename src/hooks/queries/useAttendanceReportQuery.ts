import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '../../api/attendance.api'
import type { AttendanceReportQuery } from '../../types/attendance'

export const useAttendanceSummaryQuery = (date?: string) =>
  useQuery({
    queryKey: ['attendance', 'summary', date ?? 'today'],
    queryFn: () => attendanceApi.getSummary(date),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })

type ReportType = 'late' | 'absent'

export const useAttendanceReportQuery = (type: ReportType, query: AttendanceReportQuery) => {
  const fetchers: Record<ReportType, (q: AttendanceReportQuery) => Promise<unknown>> = {
    late: attendanceApi.getLateReport,
    absent: attendanceApi.getAbsentReport,
  }

  return useQuery({
    queryKey: ['attendance', 'report', type, query],
    queryFn: () => fetchers[type](query),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })
}

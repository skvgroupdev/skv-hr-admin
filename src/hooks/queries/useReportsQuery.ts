import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../../api/reports.api'
import type { ReportQuery } from '../../types/report'

export const useAttendanceDailyQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'attendance', 'daily', query],
    queryFn: () => reportsApi.getAttendanceDaily(query),
    staleTime: 60_000,
    enabled: !!query.date || !!query.startDate,
  })
}

export const useAttendanceMonthlyQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'attendance', 'monthly', query],
    queryFn: () => reportsApi.getAttendanceMonthly(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

export const useAttendanceLateQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'attendance', 'late', query],
    queryFn: () => reportsApi.getAttendanceLate(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

export const useAttendanceAbsentQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'attendance', 'absent', query],
    queryFn: () => reportsApi.getAttendanceAbsent(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

export const useAttendanceMissingCheckoutQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'attendance', 'missing-checkout', query],
    queryFn: () => reportsApi.getAttendanceMissingCheckout(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

export const useLeaveSummaryQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'leave', 'summary', query],
    queryFn: () => reportsApi.getLeaveSummary(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

export const useLeaveBalanceQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'leave', 'balance', query],
    queryFn: () => reportsApi.getLeaveBalance(query),
    staleTime: 60_000,
    enabled: !!query.year,
  })
}

export const useOTSummaryQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'ot', 'summary', query],
    queryFn: () => reportsApi.getOTSummary(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

export const useOTCostQuery = (query: ReportQuery) => {
  return useQuery({
    queryKey: ['reports', 'ot', 'cost', query],
    queryFn: () => reportsApi.getOTCost(query),
    staleTime: 60_000,
    enabled: !!(query.month && query.year),
  })
}

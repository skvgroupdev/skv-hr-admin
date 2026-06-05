import { apiClient } from './client'
import type {
  ReportQuery,
  AttendanceDailyRecord,
  AttendanceMonthlyRecord,
  AttendanceLateRecord,
  AttendanceAbsentRecord,
  AttendanceMissingCheckoutRecord,
  LeaveSummaryRecord,
  LeaveBalanceRecord,
  OTSummaryRecord,
  OTCostRecord,
} from '../types/report'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const reportsApi = {
  getAttendanceDaily: async (query: ReportQuery): Promise<AttendanceDailyRecord[]> => {
    const res = await apiClient.get('/reports/attendance/daily', { params: query })
    return unwrap<AttendanceDailyRecord[]>(res)
  },

  getAttendanceMonthly: async (query: ReportQuery): Promise<AttendanceMonthlyRecord[]> => {
    const res = await apiClient.get('/reports/attendance/monthly', { params: query })
    return unwrap<AttendanceMonthlyRecord[]>(res)
  },

  getAttendanceLate: async (query: ReportQuery): Promise<AttendanceLateRecord[]> => {
    const res = await apiClient.get('/reports/attendance/late', { params: query })
    return unwrap<AttendanceLateRecord[]>(res)
  },

  getAttendanceAbsent: async (query: ReportQuery): Promise<AttendanceAbsentRecord[]> => {
    const res = await apiClient.get('/reports/attendance/absent', { params: query })
    return unwrap<AttendanceAbsentRecord[]>(res)
  },

  getAttendanceMissingCheckout: async (query: ReportQuery): Promise<AttendanceMissingCheckoutRecord[]> => {
    const res = await apiClient.get('/reports/attendance/missing-checkout', { params: query })
    return unwrap<AttendanceMissingCheckoutRecord[]>(res)
  },

  getLeaveSummary: async (query: ReportQuery): Promise<LeaveSummaryRecord[]> => {
    const res = await apiClient.get('/reports/leave/summary', { params: query })
    return unwrap<LeaveSummaryRecord[]>(res)
  },

  getLeaveBalance: async (query: ReportQuery): Promise<LeaveBalanceRecord[]> => {
    const res = await apiClient.get('/reports/leave/balance', { params: query })
    return unwrap<LeaveBalanceRecord[]>(res)
  },

  getOTSummary: async (query: ReportQuery): Promise<OTSummaryRecord[]> => {
    const res = await apiClient.get('/reports/ot/summary', { params: query })
    return unwrap<OTSummaryRecord[]>(res)
  },

  getOTCost: async (query: ReportQuery): Promise<OTCostRecord[]> => {
    const res = await apiClient.get('/reports/ot/cost', { params: query })
    return unwrap<OTCostRecord[]>(res)
  },
}

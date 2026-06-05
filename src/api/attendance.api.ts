import { apiClient } from './client'
import type { AttendanceLog, AttendanceReportQuery, AttendanceSummary } from '../types/attendance'

export interface NotCheckedInEmployee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  position: { id: string; name: string } | null
  branch: { id: string; name: string } | null
  shiftStartTime: string | null
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const attendanceApi = {
  getDailyReport: async (query: AttendanceReportQuery): Promise<AttendanceLog[]> => {
    const res = await apiClient.get('/attendance/report/daily', { params: query })
    return unwrap<AttendanceLog[]>(res)
  },

  getMonthlyReport: async (query: AttendanceReportQuery): Promise<AttendanceLog[]> => {
    const res = await apiClient.get('/attendance/report/monthly', { params: query })
    return unwrap<AttendanceLog[]>(res)
  },

  getLateReport: async (query: AttendanceReportQuery): Promise<AttendanceLog[]> => {
    const res = await apiClient.get('/attendance/report/late', { params: query })
    return unwrap<AttendanceLog[]>(res)
  },

  getNotCheckedInReport: async (query: AttendanceReportQuery): Promise<NotCheckedInEmployee[]> => {
    const res = await apiClient.get('/attendance/report/not-checked-in', { params: query })
    return unwrap<NotCheckedInEmployee[]>(res)
  },

  getSummary: async (date?: string): Promise<AttendanceSummary> => {
    const res = await apiClient.get('/attendance/report/summary', {
      params: date ? { date } : {},
    })
    return (res.data as { data: AttendanceSummary }).data
  },

  adjust: async (id: string, note: string, adjustReason: string): Promise<AttendanceLog> => {
    const res = await apiClient.patch(`/attendance/${id}/adjust`, { note, adjustReason })
    return unwrap<AttendanceLog>(res)
  },
}

import { apiClient } from './client'
import type { Shift } from '../types/shift'

export interface ShiftAssignment {
  id: string
  employeeId: string
  shiftId: Shift
  effectiveDate: string
  endDate?: string
}

export interface CheckInOutData {
  lat: number
  lng: number
  gpsAccuracy: number
  note?: string
  earlyLeaveReason?: string
  isOffsite?: boolean
  selfieUrl?: string
}

export interface BlockedCheckInResponse {
  blocked: true
  distanceFromBranch: number
  message: string
}

// Raw log จาก backend
export interface AttendanceLog {
  id: string
  type: 'CHECK_IN' | 'CHECK_OUT'
  checkTime: string
  status: 'NORMAL' | 'LATE' | 'LATE_MINOR' | 'EARLY_LEAVE' | 'ABSENT' | 'HALF_DAY' | 'MISSING_CHECKOUT'
  lateMinutes?: number
  distanceFromBranch?: number
  isInsideGeofence?: boolean
  createdAt: string
}

// Derived record สำหรับ UI
export interface AttendanceRecord {
  checkIn: string | null
  checkOut: string | null
  status: AttendanceLog['status'] | null
  logs: AttendanceLog[]
}

function logsToRecord(logs: AttendanceLog[]): AttendanceRecord {
  const checkInLog = logs.find((l) => l.type === 'CHECK_IN')
  const checkOutLog = logs.find((l) => l.type === 'CHECK_OUT')
  return {
    checkIn: checkInLog?.checkTime ?? null,
    checkOut: checkOutLog?.checkTime ?? null,
    status: checkInLog?.status ?? null,
    logs,
  }
}

// Daily summary record จาก /attendance/my-history
export interface AttendanceDailyLog {
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'NORMAL' | 'LATE_MINOR' | 'LATE' | 'EARLY_LEAVE'
  lateMinutes: number
  workDuration: number | null
  isInsideGeofence: boolean
  distanceFromBranch: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export const employeeAttendanceApi = {
  checkIn: (data: CheckInOutData) =>
    apiClient
      .post<{ data: AttendanceRecord | BlockedCheckInResponse }>('/attendance/check-in', data)
      .then((r) => r.data.data),

  checkOut: (data: CheckInOutData) =>
    apiClient.post<{ data: AttendanceRecord }>('/attendance/check-out', data).then((r) => r.data.data),

  getMyToday: () =>
    apiClient
      .get<{ data: AttendanceLog[]; meta: unknown }>('/attendance/my-today')
      .then((r) => logsToRecord(r.data.data ?? [])),

  getMyHistory: (params: PaginationParams) =>
    apiClient
      .get<{ data: AttendanceDailyLog[]; meta: { total: number; page: number; limit: number } }>(
        '/attendance/my-history',
        { params },
      )
      .then((r) => r.data),

  getMyShift: (employeeId: string) =>
    apiClient
      .get<{ data: ShiftAssignment }>(`/employees/${employeeId}/shift`)
      .then((r) => r.data.data),
}

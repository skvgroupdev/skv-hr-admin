export type AttendanceType = 'CHECK_IN' | 'CHECK_OUT' | 'BREAK_IN' | 'BREAK_OUT' | 'MANUAL_ADJUSTMENT'

export type AttendanceStatus =
  | 'NORMAL'
  | 'LATE'
  | 'LATE_MINOR'
  | 'EARLY_LEAVE'
  | 'ABSENT'
  | 'MISSING_CHECKOUT'
  | 'OUTSIDE_PENDING'
  | 'OUTSIDE_APPROVED'
  | 'OUTSIDE_REJECTED'
  | 'MANUAL_ADJUSTED'

export interface AttendanceLog {
  id: string
  employeeId: string
  branchId?: string
  type: AttendanceType
  checkTime: string
  serverTime: string
  isInsideGeofence?: boolean
  distanceFromBranch?: number
  selfieUrl?: string
  status: AttendanceStatus
  lateMinutes?: number
  note?: string
  adjustReason?: string
  createdAt: string
}

export interface AttendanceSummary {
  date: string
  total: number
  checkedIn: number
  late: number
  notCheckedIn: number
}

export interface AttendanceReportQuery {
  date?: string
  month?: string | number
  year?: string | number
  branchId?: string
  employeeId?: string
  page?: number
  limit?: number
}

export type DayStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EARLY_LEAVE' | 'WEEKEND'

export interface DailyAttendanceRecord {
  date: string
  dayOfWeek: number
  isWorkDay: boolean
  checkIn: { time: string; status: string; lateMinutes: number } | null
  checkOut: { time: string; status: string } | null
  dayStatus: DayStatus
}

export interface MonthlyAttendanceSummary {
  totalWorkDays: number
  presentDays: number
  lateDays: number
  absentDays: number
  earlyLeaveDays: number
  onTimeRate: number
}

export interface EmployeeMonthlyAttendanceResponse {
  employeeId: string
  year: number
  month: number
  summary: MonthlyAttendanceSummary
  dailyRecords: DailyAttendanceRecord[]
}

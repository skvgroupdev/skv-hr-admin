export interface ReportQuery {
  date?: string
  startDate?: string
  endDate?: string
  month?: string
  year?: string
  branchId?: string
  departmentId?: string
  leaveTypeId?: string
}

export interface AttendanceDailyRecord {
  employeeId: string
  employeeName: string
  checkIn?: string
  checkOut?: string
  status: string
  lateMinutes?: number
  workHours?: number
  date: string
}

export interface AttendanceMonthlyRecord {
  employeeId: string
  employeeName: string
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  totalWorkHours: number
  month: number
  year: number
}

export interface AttendanceLateRecord {
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  lateMinutes: number
}

export interface AttendanceAbsentRecord {
  employeeId: string
  employeeName: string
  date: string
  reason?: string
}

export interface AttendanceMissingCheckoutRecord {
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
}

export interface LeaveSummaryRecord {
  employeeId: string
  employeeName: string
  leaveType: string
  totalDays: number
  status: string
}

export interface LeaveBalanceRecord {
  employeeId: string
  employeeName: string
  leaveType: string
  totalDays: number
  usedDays: number
  remainingDays: number
}

export interface OTSummaryRecord {
  employeeId: string
  employeeName: string
  totalHours: number
  approvedHours: number
  pendingHours: number
}

export interface OTCostRecord {
  employeeId: string
  employeeName: string
  totalHours: number
  hourlyRate: number
  totalCost: number
}

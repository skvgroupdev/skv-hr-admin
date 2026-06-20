export type AttendanceAdjustmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type AttendanceAdjustmentType = 'CHECK_IN' | 'CHECK_OUT'

export interface AttendanceAdjustmentEmployee {
  id: string
  firstName: string
  lastName: string
  nickname?: string
  employeeCode?: string
}

export interface AttendanceAdjustment {
  id: string
  employeeId: string | AttendanceAdjustmentEmployee
  branchId: string
  attendanceLogId?: string
  type: AttendanceAdjustmentType
  workDate: string
  originalCheckTime?: string
  requestedCheckTime: string
  reason: string
  evidenceUrl?: string
  status: AttendanceAdjustmentStatus
  reviewComment?: string
  createdAt: string
}

export interface CreateAttendanceAdjustmentRequest {
  type: AttendanceAdjustmentType
  workDate: string
  requestedCheckTime: string
  reason: string
  evidenceUrl?: string
}

export interface ReviewAttendanceAdjustmentRequest {
  reviewNote?: string
}

export interface LeaveType {
  id: string
  name: string
  code: string
  defaultDaysPerYear: number
  isPaid: boolean
  requireAttachment: boolean
  isActive: boolean
  createdAt: string
}

export interface CreateLeaveTypeDto {
  name: string
  code: string
  defaultDaysPerYear?: number
  isPaid?: boolean
  requireAttachment?: boolean
  isActive?: boolean
}

export interface LeaveApproval {
  approverId: string
  role: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  comment?: string
  approvedAt?: string
}

export interface LeaveRequestEmployee {
  id: string
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
}

export interface LeaveRequest {
  id: string
  employeeId: string | LeaveRequestEmployee
  employee?: LeaveRequestEmployee
  leaveTypeId: string | LeaveType
  leaveType?: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  isHalfDay: boolean
  halfDayPeriod?: 'AM' | 'PM'
  reason: string
  attachmentUrls: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  approvals: LeaveApproval[]
  createdAt: string
  updatedAt: string
}

export interface CreateLeaveRequestDto {
  leaveTypeId: string
  startDate: string
  endDate: string
  isHalfDay?: boolean
  halfDayPeriod?: 'AM' | 'PM'
  reason: string
}

export interface LeaveBalance {
  id: string
  employeeId: string
  leaveTypeId: string
  leaveType?: LeaveType
  year: number
  totalDays: number
  usedDays: number
  remainingDays: number
}

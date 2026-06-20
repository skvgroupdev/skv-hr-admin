export interface Shift {
  id: string
  name: string
  startTime?: string
  endTime?: string
  breakStartTime?: string
  breakEndTime?: string
  gracePeriodMinutes: number
  isOvernight: boolean
  isActive: boolean
  workDays?: number[]
  createdAt: string
  updatedAt: string
}

export interface CreateShiftDto {
  name: string
  startTime?: string
  endTime?: string
  breakStartTime?: string
  breakEndTime?: string
  gracePeriodMinutes?: number
  isOvernight?: boolean
  isActive?: boolean
  workDays?: number[]
}

export interface UpdateShiftDto extends Partial<CreateShiftDto> {}

export interface ShiftAssignment {
  id: string
  employeeId: string
  shiftId: Shift
  effectiveDate: string
  endDate?: string
  status?: string
  createdAt?: string
}

export interface BulkAssignShiftRequest {
  shiftId: string
  employeeIds: string[]
  effectiveDate: string
  endDate?: string
}

export interface BulkAssignResult {
  success: ShiftAssignment[]
  failed: { employeeId: string; reason: string }[]
}

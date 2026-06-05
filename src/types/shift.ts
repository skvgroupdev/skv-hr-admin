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

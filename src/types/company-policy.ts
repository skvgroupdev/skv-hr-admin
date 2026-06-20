export interface UniformSchedule {
  startTime: string
  endTime: string
  breakStartTime?: string
  breakEndTime?: string
  workDays: number[]
  gracePeriodMinutes: number
  isOvernight: boolean
}

export interface CompanyPolicy {
  id?: string
  effectiveFrom?: string | null
  workScheduleMode: 'UNIFORM' | 'SHIFT_BASED'
  uniformSchedule: UniformSchedule
  salaryCalculationMode: 'MONTHLY_FIXED' | 'ATTENDANCE_BASED'
  dailyRateMethod: 'CALENDAR_30' | 'SCHEDULED_WORKDAYS'
  restDayPolicyEnabled: boolean
  monthlyRestDays: number
  unusedRestDayCompensationEnabled: boolean
  unusedRestDaysCarryForward: boolean
  lateToleranceMinutes: number
  earlyLeaveToleranceMinutes: number
  absenceDeductionEnabled: boolean
}

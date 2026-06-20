import { apiClient } from './client'
import type { CompanyPolicy, UniformSchedule } from '../types/company-policy'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const companyPolicyApi = {
  get: async (): Promise<CompanyPolicy> => unwrap(await apiClient.get('/company-policy')),
  updateAttendance: async (body: {
    workScheduleMode: 'UNIFORM' | 'SHIFT_BASED'
    uniformSchedule?: UniformSchedule
    effectiveFrom?: string
  }): Promise<CompanyPolicy> => unwrap(await apiClient.patch('/company-policy/attendance', body)),
  updatePayroll: async (body: Pick<CompanyPolicy,
    | 'salaryCalculationMode'
    | 'dailyRateMethod'
    | 'restDayPolicyEnabled'
    | 'monthlyRestDays'
    | 'unusedRestDayCompensationEnabled'
    | 'unusedRestDaysCarryForward'
    | 'lateToleranceMinutes'
    | 'earlyLeaveToleranceMinutes'
    | 'absenceDeductionEnabled'
  > & { effectiveFrom?: string }): Promise<CompanyPolicy> =>
    unwrap(await apiClient.patch('/company-policy/payroll', body)),
}

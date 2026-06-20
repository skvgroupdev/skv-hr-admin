import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { companyPolicyApi } from '../../../api/company-policy.api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { PageLoader } from '../../../components/ui/LoadingSpinner'
import { useAuthStore } from '../../../stores/useAuthStore'
import type { CompanyPolicy } from '../../../types/company-policy'

export default function WorkPolicyPage() {
  const qc = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const { data, isLoading, isError } = useQuery({ queryKey: ['company-policy'], queryFn: companyPolicyApi.get })
  const [draft, setDraft] = useState<CompanyPolicy | null>(null)
  const policy = draft ?? data ?? null
  const setPolicy = setDraft

  const attendanceMutation = useMutation({
    mutationFn: companyPolicyApi.updateAttendance,
    onSuccess: (next) => { setPolicy(next); qc.invalidateQueries({ queryKey: ['company-policy'] }) },
  })
  const payrollMutation = useMutation({
    mutationFn: companyPolicyApi.updatePayroll,
    onSuccess: (next) => { setPolicy(next); qc.invalidateQueries({ queryKey: ['company-policy'] }) },
  })

  if (isLoading) return <PageLoader />
  if (isError || !policy) return <p className="p-6 text-sm text-red-600">ບໍ່ສາມາດໂຫຼດ policy ໄດ້</p>
  const canUseShifts = !!user?.features?.shiftManagement
  const canUseRestDays = !!user?.features?.restDayCompensation

  return (
    <div className="p-6 max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">ນະໂຍບາຍການເຮັດວຽກ ແລະ ນະໂຍບາຍເງິນເດືອນ</h1>
        <p className="text-sm text-gray-500">ການຕັ້ງຄ່າແຍກຕາມບໍລິສັດ ແລະ package</p>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">ຮູບແບບຕາຕະລາງວຽກ</h2>
        <div className="space-y-4">
          <select
            value={policy.workScheduleMode}
            onChange={(event) => setPolicy({ ...policy, workScheduleMode: event.target.value as CompanyPolicy['workScheduleMode'] })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="UNIFORM">ເວລາດຽວກັນທັງບໍລິສັດ</option>
            <option value="SHIFT_BASED" disabled={!canUseShifts}>ເຮັດວຽກເປັນກະ</option>
          </select>
          {!canUseShifts && <p className="text-xs text-amber-600">ແພັກເກດປັດຈຸບັນບໍ່ຮອງຮັບລະບົບກະ</p>}
          {policy.workScheduleMode === 'UNIFORM' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input label="ເວລາເຂົ້າ" type="time" value={policy.uniformSchedule.startTime} onChange={(e) => setPolicy({ ...policy, uniformSchedule: { ...policy.uniformSchedule, startTime: e.target.value } })} />
              <Input label="ເວລາອອກ" type="time" value={policy.uniformSchedule.endTime} onChange={(e) => setPolicy({ ...policy, uniformSchedule: { ...policy.uniformSchedule, endTime: e.target.value } })} />
              <Input label="ຊ່ວງຜ່ອນຜັນ (ນາທີ)" type="number" value={String(policy.uniformSchedule.gracePeriodMinutes)} onChange={(e) => setPolicy({ ...policy, uniformSchedule: { ...policy.uniformSchedule, gracePeriodMinutes: Number(e.target.value) } })} />
            </div>
          )}
          <Button loading={attendanceMutation.isPending} onClick={() => attendanceMutation.mutate({ workScheduleMode: policy.workScheduleMode, uniformSchedule: policy.workScheduleMode === 'UNIFORM' ? policy.uniformSchedule : undefined })}>ບັນທຶກເວລາ</Button>
        </div>
      </Card>

      {user?.features?.payroll && user.role === 'COMPANY_OWNER' && (
        <Card>
          <h2 className="font-semibold mb-4">ນະໂຍບາຍເງິນເດືອນ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={policy.salaryCalculationMode} onChange={(e) => setPolicy({ ...policy, salaryCalculationMode: e.target.value as CompanyPolicy['salaryCalculationMode'] })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="MONTHLY_FIXED">ເງິນເດືອນຄົງທີ່</option>
              <option value="ATTENDANCE_BASED">ຄິດຕາມວັນເຮັດວຽກ</option>
            </select>
            <select value={policy.dailyRateMethod} onChange={(e) => setPolicy({ ...policy, dailyRateMethod: e.target.value as CompanyPolicy['dailyRateMethod'] })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="CALENDAR_30">ຫານ 30 ວັນ</option>
              <option value="SCHEDULED_WORKDAYS">ໄລ່ຕາມເວລາເຮັດວຽກ</option>
            </select>
            <Input label="ຜ່ອນຜັນຊ້າ (ນາທີ)" type="number" value={String(policy.lateToleranceMinutes)} onChange={(e) => setPolicy({ ...policy, lateToleranceMinutes: Number(e.target.value) })} />
            <Input label="ຜ່ອນຜັນອອກກ່ອນ (ນາທີ)" type="number" value={String(policy.earlyLeaveToleranceMinutes)} onChange={(e) => setPolicy({ ...policy, earlyLeaveToleranceMinutes: Number(e.target.value) })} />
          </div>
          <label className="mt-4 flex gap-2 text-sm"><input type="checkbox" disabled={!canUseRestDays} checked={policy.restDayPolicyEnabled} onChange={(e) => setPolicy({ ...policy, restDayPolicyEnabled: e.target.checked, unusedRestDayCompensationEnabled: e.target.checked && policy.unusedRestDayCompensationEnabled })} /> ເປີດນະໂຍບາຍວັນພັກລາຍເດືອນ</label>
          {policy.restDayPolicyEnabled && <div className="mt-3 w-48"><Input label="ຈຳນວນວັນພັກ/ເດືອນ" type="number" value={String(policy.monthlyRestDays)} onChange={(e) => setPolicy({ ...policy, monthlyRestDays: Number(e.target.value) })} /></div>}
          <label className="mt-3 flex gap-2 text-sm"><input type="checkbox" disabled={!policy.restDayPolicyEnabled} checked={policy.unusedRestDayCompensationEnabled} onChange={(e) => setPolicy({ ...policy, unusedRestDayCompensationEnabled: e.target.checked })} /> ຈ່າຍຊົດເຊີຍວັນພັກທີ່ບໍ່ໄດ້ໃຊ້</label>
          <Button className="mt-4" loading={payrollMutation.isPending} onClick={() => payrollMutation.mutate({ salaryCalculationMode: policy.salaryCalculationMode, dailyRateMethod: policy.dailyRateMethod, restDayPolicyEnabled: policy.restDayPolicyEnabled, monthlyRestDays: policy.monthlyRestDays, unusedRestDayCompensationEnabled: policy.unusedRestDayCompensationEnabled, unusedRestDaysCarryForward: policy.unusedRestDaysCarryForward, lateToleranceMinutes: policy.lateToleranceMinutes, earlyLeaveToleranceMinutes: policy.earlyLeaveToleranceMinutes, absenceDeductionEnabled: policy.absenceDeductionEnabled })}>ບັນທຶກນະໂຍບາຍເງິນເດືອນ</Button>
        </Card>
      )}
    </div>
  )
}

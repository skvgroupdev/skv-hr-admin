import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { payrollApi } from '../../../api/payroll.api'
import { companyPolicyApi } from '../../../api/company-policy.api'
import { useAuthStore } from '../../../stores/useAuthStore'
import type { Payslip } from '../../../types/payroll'
import { getEmployeeName } from '../../../types/payroll'
import { formatLAK } from '../../../utils/currency'
import { formatDateOnly } from '../../../utils/date'

interface PayslipDetailModalProps {
  open: boolean
  onClose: () => void
  payslip: Payslip | null
}

function ItemRow({ label, amount, highlight }: { label: string; amount: number; highlight?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 text-sm ${highlight ? 'font-semibold text-primary' : 'text-gray-700'}`}>
      <span>{label}</span>
      <span>{formatLAK(amount)}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{children}</p>
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm text-gray-700">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function InfoGrid({ payslip }: { payslip: Payslip }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-gray-50 p-3 text-sm mb-3">
      <div>
        <p className="text-xs text-gray-400">ຊື່ພະນັກງານ</p>
        <p className="font-medium text-gray-800">{getEmployeeName(payslip)}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">ລະຫັດພະນັກງານ</p>
        <p className="font-medium text-gray-800">{payslip.employee?.employeeCode ?? '-'}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">ຕຳແໜ່ງ</p>
        <p className="font-medium text-gray-800">{payslip.employee?.positionId?.name ?? '-'}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">ງວດເງິນ</p>
        <p className="font-medium text-gray-800">{payslip.period?.name ?? '-'}</p>
      </div>
      <div className="col-span-2">
        <p className="text-xs text-gray-400">ໄລຍະເວລາ</p>
        <p className="font-medium text-gray-800">
          {formatDateOnly(payslip.period?.startDate)} — {formatDateOnly(payslip.period?.endDate)}
        </p>
      </div>
    </div>
  )
}

export function PayslipDetailModal({ open, onClose, payslip }: PayslipDetailModalProps) {
  const qc = useQueryClient()
  const role = useAuthStore((state) => state.user?.role)
  const { data: companyPolicy } = useQuery({ queryKey: ['company-policy'], queryFn: companyPolicyApi.get, staleTime: 5 * 60 * 1000 })
  const restDayPolicyEnabled = companyPolicy?.restDayPolicyEnabled ?? false
  const [current, setCurrent] = useState<Payslip | null>(payslip)
  const [kind, setKind] = useState<'ADDITION' | 'DEDUCTION'>('ADDITION')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const displayed = current?.id === payslip?.id ? current : payslip
  const mutation = useMutation({
    mutationFn: (adjustments: Array<{ kind: 'ADDITION' | 'DEDUCTION'; name: string; amount: number; reason: string }>) => payrollApi.updateAdjustments(displayed!.id, adjustments),
    onSuccess: (next) => { setCurrent(next); qc.invalidateQueries({ queryKey: ['payroll'] }); setName(''); setAmount(''); setReason('') },
  })
  if (!displayed) return null
  const editable = role === 'HR_ADMIN' && displayed.status === 'DRAFT'
  const manualAdjustments = displayed.adjustments?.filter((item) => item.source === 'MANUAL') ?? []
  const save = (items: typeof manualAdjustments) => mutation.mutate(items.map(({ kind, name, amount, reason }) => ({ kind, name, amount, reason })))

  return (
    <Modal open={open} title="ລາຍລະອຽດ Payslip" onClose={onClose}>
      <InfoGrid payslip={displayed} />

      <div className="divide-y divide-gray-100">
        <div className="pb-3">
          <SectionTitle>ເງິນເດືອນພື້ນຖານ</SectionTitle>
          <ItemRow label="ເງິນເດືອນພື້ນຖານ" amount={displayed.baseSalary} />
          {displayed.otHours > 0 && (
            <ItemRow label={`OT (${displayed.otHours} ຊົ່ວໂມງ)`} amount={displayed.otAmount} />
          )}
          {restDayPolicyEnabled && (displayed.approvedRestDays ?? 0) > 0 && (
            <div className="mt-1">
              <SectionTitle>ວັນພັກ</SectionTitle>
              <InfoRow label="ວັນພັກທີ່ໄດ້ຮັບອະນຸມັດ" value={`${displayed.approvedRestDays ?? 0} ວັນ`} />
              <InfoRow label="ວັນພັກທີ່ບໍ່ໄດ້ໃຊ້" value={`${displayed.unusedRestDays ?? 0} ວັນ`} />
              {(displayed.restDayCompensationAmount ?? 0) > 0 && (
                <ItemRow label={`ເງິນຊົດເຊີຍວັນພັກ (${displayed.unusedRestDays ?? 0} ວັນ)`} amount={displayed.restDayCompensationAmount ?? 0} />
              )}
            </div>
          )}
        </div>

        {displayed.allowances.length > 0 && (
          <div className="py-3">
            <SectionTitle>ເງິນເພີ່ມ</SectionTitle>
            {displayed.allowances.map((a) => (
              <ItemRow key={a.name} label={a.name} amount={a.amount} />
            ))}
          </div>
        )}

        <div className="py-3">
          <ItemRow label="Gross ທັງໝົດ" amount={displayed.grossSalary} highlight />
        </div>

        <div className="py-3">
          <SectionTitle>ການຫັກ</SectionTitle>
          <ItemRow label="ປະກັນສັງຄົມ (ພະນັກງານ)" amount={displayed.employeeSsAmount} />
          <ItemRow label="ພາສີລາຍໄດ້" amount={displayed.incomeTax} />
          {displayed.otherDeductions.map((d) => (
            <ItemRow key={d.name} label={d.name} amount={d.amount} />
          ))}
          <ItemRow label="ຫັກທັງໝົດ" amount={displayed.totalDeductions} />
        </div>

        {(manualAdjustments.length > 0 || editable) && <div className="py-3"><SectionTitle>ລາຍການປັບໂດຍ HR</SectionTitle>{manualAdjustments.map((item, index) => <div key={`${item.name}-${index}`} className="flex items-center justify-between py-1 text-sm"><span>{item.kind === 'ADDITION' ? '+' : '-'} {item.name} — {item.reason}</span><span>{formatLAK(item.amount)} {editable && <button className="ml-2 text-red-500" onClick={() => save(manualAdjustments.filter((_, i) => i !== index))}>×</button>}</span></div>)}{editable && <div className="mt-3 grid grid-cols-2 gap-2"><select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="ADDITION">ເພີ່ມ</option><option value="DEDUCTION">ຫັກ</option></select><Input placeholder="ຊື່ລາຍການ" value={name} onChange={(e) => setName(e.target.value)} /><Input type="number" placeholder="ຈຳນວນ" value={amount} onChange={(e) => setAmount(e.target.value)} /><Input placeholder="ເຫດຜົນ" value={reason} onChange={(e) => setReason(e.target.value)} /><Button size="sm" className="col-span-2" disabled={!name || Number(amount) <= 0 || reason.length < 3} loading={mutation.isPending} onClick={() => save([...manualAdjustments, { kind, name, amount: Number(amount), reason, source: 'MANUAL', createdAt: new Date().toISOString() }])}>ເພີ່ມລາຍການ</Button></div>}</div>}

        <div className="pt-3">
          <ItemRow label="Net ທີ່ໄດ້ຮັບ" amount={displayed.netSalary} highlight />
        </div>

        <div className="pt-3">
          <p className="text-xs text-gray-400 mt-2">
            ຄ່າ SS ຝ່າຍບໍລິສັດ (6%): {formatLAK(displayed.employerSsAmount)}{' '}
            <span className="text-gray-400">(ຄ່າໃຊ້ຈ່າຍຂອງບໍລິສັດ)</span>
          </p>
        </div>
      </div>
    </Modal>
  )
}

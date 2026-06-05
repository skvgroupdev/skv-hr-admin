import { Modal } from '../../../components/ui/Modal'
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
  if (!payslip) return null

  return (
    <Modal open={open} title="ລາຍລະອຽດ Payslip" onClose={onClose}>
      <InfoGrid payslip={payslip} />

      <div className="divide-y divide-gray-100">
        <div className="pb-3">
          <SectionTitle>ເງິນເດືອນພື້ນຖານ</SectionTitle>
          <ItemRow label="ເງິນເດືອນພື້ນຖານ" amount={payslip.baseSalary} />
          {payslip.otHours > 0 && (
            <ItemRow label={`OT (${payslip.otHours} ຊົ່ວໂມງ)`} amount={payslip.otAmount} />
          )}
        </div>

        {payslip.allowances.length > 0 && (
          <div className="py-3">
            <SectionTitle>ເງິນເພີ່ມ</SectionTitle>
            {payslip.allowances.map((a) => (
              <ItemRow key={a.name} label={a.name} amount={a.amount} />
            ))}
          </div>
        )}

        <div className="py-3">
          <ItemRow label="Gross ທັງໝົດ" amount={payslip.grossSalary} highlight />
        </div>

        <div className="py-3">
          <SectionTitle>ການຫັກ</SectionTitle>
          <ItemRow label="ປະກັນສັງຄົມ (ພະນັກງານ)" amount={payslip.employeeSsAmount} />
          <ItemRow label="ພາສີລາຍໄດ້" amount={payslip.incomeTax} />
          {payslip.otherDeductions.map((d) => (
            <ItemRow key={d.name} label={d.name} amount={d.amount} />
          ))}
          <ItemRow label="ຫັກທັງໝົດ" amount={payslip.totalDeductions} />
        </div>

        <div className="pt-3">
          <ItemRow label="Net ທີ່ໄດ້ຮັບ" amount={payslip.netSalary} highlight />
        </div>

        <div className="pt-3">
          <p className="text-xs text-gray-400 mt-2">
            ຄ່າ SS ຝ່າຍບໍລິສັດ (6%): {formatLAK(payslip.employerSsAmount)}{' '}
            <span className="text-gray-400">(ຄ່າໃຊ້ຈ່າຍຂອງບໍລິສັດ)</span>
          </p>
        </div>
      </div>
    </Modal>
  )
}

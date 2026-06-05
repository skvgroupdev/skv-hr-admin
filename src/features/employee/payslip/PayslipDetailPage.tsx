import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useMyPayslipDetailQuery } from '../../../hooks/queries/useMyPayslipsQuery'
import type { PayslipDetail } from '../../../api/employee-payslip.api'

const LAO_MONTHS = ['ເດືອນ 1', 'ເດືອນ 2', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ', 'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ']

function formatPeriod(month: number, year: number): string {
  return `${LAO_MONTHS[month - 1]} ${year}`
}

function Row({ label, amount, bold }: { label: string; amount: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-2 ${bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm">{amount.toLocaleString('lo-LA')} ₭</span>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-gray-100 my-1" />
}

function IncomeSection({ payslip }: { payslip: PayslipDetail }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">ລາຍຮັບ</p>
      <Row label="ເງິນເດືອນພື້ນຖານ" amount={payslip.baseSalary} />
      {payslip.otHours > 0 && (
        <Row label={`OT (${payslip.otHours} ຊມ)`} amount={payslip.otAmount} />
      )}
      {payslip.allowances.map((a) => (
        <Row key={a.name} label={a.name} amount={a.amount} />
      ))}
      <Divider />
      <Row label="ລວມລາຍຮັບ" amount={payslip.grossSalary} bold />
    </div>
  )
}

function DeductionSection({ payslip }: { payslip: PayslipDetail }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">ລາຍການຫັກ</p>
      <Row label={`ປະກັນສັງຄົມ (${(payslip.employeeSsAmount / payslip.grossSalary * 100).toFixed(1)}%)`} amount={payslip.employeeSsAmount} />
      <Row label="ພາສີລາຍໄດ້" amount={payslip.incomeTax} />
      {payslip.otherDeductions.map((d) => (
        <Row key={d.name} label={d.name} amount={d.amount} />
      ))}
      <Divider />
      <Row label="ລວມ" amount={payslip.totalDeductions} bold />
    </div>
  )
}

export default function PayslipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: payslip, isLoading } = useMyPayslipDetailQuery(id ?? '')

  if (isLoading) {
    return <div className="flex items-center justify-center h-40 text-gray-400 text-sm">ກຳລັງໂຫລດ...</div>
  }

  if (!payslip) {
    return <div className="flex items-center justify-center h-40 text-gray-400 text-sm">ບໍ່ພົບຂໍ້ມູນ</div>
  }

  return (
    <div>
      <div className="bg-[#0D2B6B] text-white px-4 pt-4 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-lg font-bold">ເງິນເດືອນ</p>
          <p className="text-xs text-blue-200 mt-0.5">{formatPeriod(payslip.month, payslip.year)}</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        <IncomeSection payslip={payslip} />
        <DeductionSection payslip={payslip} />

        <div className="bg-[#E8EDF7] rounded-2xl p-4 flex justify-between items-center">
          <p className="font-semibold text-gray-800">ສຸດທິ</p>
          <p className="text-xl font-bold text-[#0D2B6B]">{payslip.netSalary.toLocaleString('lo-LA')} ₭</p>
        </div>
      </div>
    </div>
  )
}

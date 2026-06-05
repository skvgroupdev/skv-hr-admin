import { useState } from 'react'
import { FileBarChart } from 'lucide-react'
import { usePayrollPeriodsQuery, usePayrollReportQuery, usePeriodPayslipsQuery } from '../../../hooks/queries/usePayrollQuery'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'
import { formatNumber, formatLAK } from '../../../utils/currency'
import { getEmployeeName } from '../../../types/payroll'
import type { PayrollReport, Payslip } from '../../../types/payroll'

// ---- Summary Cards ----

interface SummaryCardProps {
  label: string
  value: string
  note?: string
}

function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
    </div>
  )
}

function SummaryGrid({ report }: { report: PayrollReport }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <SummaryCard label="ລວມລາຍໄດ້ (Gross)" value={formatLAK(report.totalGrossSalary)} />
      <SummaryCard label="ເງິນເດືອນສຸດທິ (Net)" value={formatLAK(report.totalNetSalary)} />
      <SummaryCard label="OT ລວມ" value={formatLAK(report.totalOtAmount)} />

      <SummaryCard label="SS ພະນັກງານ (5.5%)" value={formatLAK(report.totalEmployeeSsAmount)} />
      <SummaryCard
        label="SS ບໍລິສັດ (6%)"
        value={formatLAK(report.totalEmployerSsAmount)}
        note="(ຄ່າໃຊ້ຈ່າຍບໍລິສັດ)"
      />
      <SummaryCard label="ພາສີລາຍໄດ້ລວມ" value={formatLAK(report.totalIncomeTax)} />

      <SummaryCard label="ຄ່າດຳລົງຊີວິດລວມ" value={formatLAK(report.totalAllowances)} />
      <SummaryCard label="ຫັກລາພັກລວມ" value={formatLAK(report.totalLeaveDeductions)} />
      <SummaryCard label="ຫັກອື່ນໆ" value={formatLAK(report.totalOtherDeductions)} />
    </div>
  )
}

// ---- Payslip Table ----

const TABLE_HEADERS = [
  'ລ/ດ',
  'ພະນັກງານ',
  'ລວມລາຍໄດ້ (ກີບ)',
  'OT (ກີບ)',
  'SS 5.5% (ກີບ)',
  'ພາສີ (ກີບ)',
  'ຫັກລວມ (ກີບ)',
  'ສຸດທິ (ກີບ)',
  'ສະຖານະ',
]

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'ຮ່າງ',
  APPROVED: 'ອະນຸມັດ',
  PAID: 'ຈ່າຍແລ້ວ',
}

function PayslipRow({ payslip, index }: { payslip: Payslip; index: number }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{getEmployeeName(payslip)}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(payslip.grossSalary)}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(payslip.otAmount)}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(payslip.employeeSsAmount)}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(payslip.incomeTax)}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatNumber(payslip.totalDeductions)}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatNumber(payslip.netSalary)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{STATUS_LABELS[payslip.status] ?? payslip.status}</td>
    </tr>
  )
}

function PayslipTotalRow({ payslips }: { payslips: Payslip[] }) {
  const sum = (fn: (p: Payslip) => number) => payslips.reduce((acc, p) => acc + fn(p), 0)

  return (
    <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
      <td className="px-4 py-3 text-sm" colSpan={2}>ລວມທັງໝົດ</td>
      <td className="px-4 py-3 text-sm text-right">{formatNumber(sum((p) => p.grossSalary))}</td>
      <td className="px-4 py-3 text-sm text-right">{formatNumber(sum((p) => p.otAmount))}</td>
      <td className="px-4 py-3 text-sm text-right">{formatNumber(sum((p) => p.employeeSsAmount))}</td>
      <td className="px-4 py-3 text-sm text-right">{formatNumber(sum((p) => p.incomeTax))}</td>
      <td className="px-4 py-3 text-sm text-right">{formatNumber(sum((p) => p.totalDeductions))}</td>
      <td className="px-4 py-3 text-sm text-right">{formatNumber(sum((p) => p.netSalary))}</td>
      <td className="px-4 py-3 text-sm text-gray-400">—</td>
    </tr>
  )
}

function PayslipTable({ periodId }: { periodId: string }) {
  // Fetch all payslips for the period (no pagination for report view, use large limit)
  const { data, isLoading, isError } = usePeriodPayslipsQuery(periodId, 1, 200)

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="px-6 py-8 text-center text-sm text-red-600">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</p>
    )
  }

  const payslips = data?.data ?? []

  if (payslips.length === 0) {
    return (
      <EmptyState
        icon={FileBarChart}
        title="ຍັງບໍ່ມີ Payslip ໃນງວດນີ້"
        description="ລໍຖ້າການສ້າງ Payroll ຫຼື ກວດສອບຂໍ້ມູນ"
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-primary text-white">
            {TABLE_HEADERS.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payslips.map((payslip, i) => (
            <PayslipRow key={payslip.id} payslip={payslip} index={i} />
          ))}
          <PayslipTotalRow payslips={payslips} />
        </tbody>
      </table>
    </div>
  )
}

// ---- Main Page ----

export default function PayrollReportPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState('')

  const { data: periodsData, isLoading: periodsLoading } = usePayrollPeriodsQuery(1, 100)
  const { data: report, isLoading: reportLoading } = usePayrollReportQuery(selectedPeriodId || undefined)

  const periods = periodsData?.data ?? []

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ລາຍງານການເງິນ Payroll</h1>
          <p className="text-sm text-gray-500 mt-0.5">ສະຫຼຸບຂໍ້ມູນການຈ່າຍເງິນເດືອນຕາມງວດ</p>
        </div>

        <select
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0D2B6B] focus:outline-none bg-white min-w-[220px]"
          value={selectedPeriodId}
          onChange={(e) => setSelectedPeriodId(e.target.value)}
          disabled={periodsLoading}
        >
          <option value="">-- ເລືອກງວດ --</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedPeriodId ? (
        <EmptyState
          icon={FileBarChart}
          title="ກະລຸນາເລືອກງວດເພື່ອເບິ່ງລາຍງານ"
          description="ເລືອກງວດຈາກ Dropdown ດ້ານເທິງ"
        />
      ) : reportLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : report ? (
        <>
          <SummaryGrid report={report} />

          <Card padding={false}>
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">
                ລາຍລະອຽດ Payslip ({report.payslipCount} ສະບັບ,{' '}
                <span className="text-green-600">{report.approvedCount} ອະນຸມັດ</span>)
              </p>
            </div>
            <PayslipTable periodId={selectedPeriodId} />
          </Card>
        </>
      ) : (
        <EmptyState
          icon={FileBarChart}
          title="ບໍ່ພົບຂໍ້ມູນລາຍງານ"
          description="ງວດທີ່ເລືອກອາດຈະຍັງບໍ່ໄດ້ສ້າງ Payroll"
        />
      )}
    </div>
  )
}

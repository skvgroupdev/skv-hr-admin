import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useEmployeeQuery } from '../../../hooks/queries/useEmployeeQuery'
import { useEmployeePayslipsQuery, useEmployeeFinanceSummaryQuery } from '../../../hooks/queries/usePayrollQuery'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { cn } from '../../../lib/cn'
import { PayslipDetailModal } from './PayslipDetailModal'
import { EmployeeFinanceDashboard } from './EmployeeFinanceDashboard'
import type { Payslip } from '../../../types/payroll'

type TabKey = 'history' | 'dashboard'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'history', label: 'ປະຫວັດ' },
  { key: 'dashboard', label: 'Dashboard' },
]

const PAYSLIP_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'ຮ່າງ', APPROVED: 'ອະນຸມັດ', PAID: 'ຈ່າຍແລ້ວ',
}

function SummaryCards({ employeeId }: { employeeId: string }) {
  const { data } = useEmployeeFinanceSummaryQuery(employeeId)
  if (!data) return null
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-gray-500">ຍອດລວມ Net</p>
        <p className="mt-1 text-lg font-semibold text-primary">{data.totalNetSalary.toLocaleString()} ກີບ</p>
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-gray-500">ເງິນເດືອນລ່າສຸດ</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {data.monthlyBreakdown.at(-1)?.netSalary.toLocaleString() ?? '-'} ກີບ
        </p>
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-gray-500">ຈຳນວນ Payslip ທັງໝົດ</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{data.totalPayslips} ສະບັບ</p>
      </div>
    </div>
  )
}

function HistoryRow({ payslip, onOpen }: { payslip: Payslip; onOpen: (ps: Payslip) => void }) {
  return (
    <tr
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onOpen(payslip)}
    >
      <td className="px-4 py-3 text-sm text-gray-600">
        {typeof payslip.payrollPeriodId === 'object' && payslip.payrollPeriodId
          ? payslip.payrollPeriodId.name
          : typeof payslip.payrollPeriodId === 'string'
            ? payslip.payrollPeriodId.slice(-6)
            : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-right">{payslip.grossSalary.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-right">{payslip.incomeTax.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-right">{payslip.employeeSsAmount.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-right font-medium text-primary">{payslip.netSalary.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{PAYSLIP_STATUS_LABELS[payslip.status] ?? payslip.status}</td>
    </tr>
  )
}

function HistoryTab({ employeeId }: { employeeId: string }) {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Payslip | null>(null)
  const { data, isLoading } = useEmployeePayslipsQuery(employeeId, { page, limit: 20 })
  const HEADERS = ['ງວດ', 'Gross (LAK)', 'ພາສີ (LAK)', 'SS (LAK)', 'Net (LAK)', 'ສະຖານະ']

  return (
    <>
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                {HEADERS.map((h) => (
                  <th key={h} className={`px-4 py-3 text-sm font-medium ${h.includes('LAK') ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {HEADERS.map((h) => <td key={h} className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse" /></td>)}
                  </tr>
                ))
                : data?.data.length === 0
                  ? <tr><td colSpan={HEADERS.length} className="py-12 text-center text-sm text-gray-500">ຍັງບໍ່ມີ payslip</td></tr>
                  : data?.data.map((ps) => <HistoryRow key={ps.id} payslip={ps} onOpen={setSelected} />)
              }
            </tbody>
          </table>
        </div>
        {data?.meta && (
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
        )}
      </Card>
      <PayslipDetailModal open={!!selected} onClose={() => setSelected(null)} payslip={selected} />
    </>
  )
}

export default function EmployeeSalaryDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('history')
  const { data: employee, isLoading } = useEmployeeQuery(id)

  const fullName = employee ? `${employee.firstName} ${employee.lastName}` : '...'
  const dept = employee?.department?.name ?? '-'
  const position = employee?.position?.name ?? '-'
  const code = employee?.employeeCode ?? '-'

  return (
    <div className="p-6 space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        ກັບຄືນ
      </button>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-5 w-48 rounded bg-gray-200 animate-pulse" />)}
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-900">{fullName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {code} · {dept} · {position}
            </p>
          </>
        )}
      </div>

      <SummaryCards employeeId={id} />

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'history' && <HistoryTab employeeId={id} />}
      {activeTab === 'dashboard' && <EmployeeFinanceDashboard employeeId={id} />}
    </div>
  )
}

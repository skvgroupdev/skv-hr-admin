import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllPayslipsQuery } from '../../../hooks/queries/usePayrollQuery'
import { usePayrollPeriodsQuery } from '../../../hooks/queries/usePayrollQuery'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { PayrollStatusBadge } from './PayrollStatusBadge'
import type { PayslipWithEmployee } from '../../../types/payroll'

const HEADERS = ['ພະນັກງານ', 'ງວດ', 'Gross (LAK)', 'ຫັກ (LAK)', 'Net (LAK)', 'ສະຖານະ', 'ລາພັກຍລະອຽດ']

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'ຮ່າງ',
  APPROVED: 'ອະນຸມັດ',
  PAID: 'ຈ່າຍແລ້ວ',
}

function FilterBar({
  search, onSearch,
  status, onStatus,
  periodId, onPeriod,
  startDate, onStartDate,
  endDate, onEndDate,
  periods,
}: {
  search: string; onSearch: (v: string) => void
  status: string; onStatus: (v: string) => void
  periodId: string; onPeriod: (v: string) => void
  startDate: string; onStartDate: (v: string) => void
  endDate: string; onEndDate: (v: string) => void
  periods: { id: string; name: string }[]
}) {
  const inputClass = 'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text" placeholder="ຄົ້ນຫາຊື່ພະນັກງານ..." value={search}
        onChange={(e) => onSearch(e.target.value)}
        className={`${inputClass} w-52`}
      />
      <select value={periodId} onChange={(e) => onPeriod(e.target.value)} className={inputClass}>
        <option value="">ທຸກງວດ</option>
        {periods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={status} onChange={(e) => onStatus(e.target.value)} className={inputClass}>
        <option value="">ທຸກສະຖານະ</option>
        {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <input type="date" value={startDate} onChange={(e) => onStartDate(e.target.value)} className={inputClass} />
      <input type="date" value={endDate} onChange={(e) => onEndDate(e.target.value)} className={inputClass} />
    </div>
  )
}

function PayslipRow({ payslip }: { payslip: PayslipWithEmployee }) {
  const navigate = useNavigate()
  const fullName = `${payslip.employee.firstName} ${payslip.employee.lastName}`
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <button
          onClick={() => navigate(`/hr/payroll/employees/${payslip.employeeId}`)}
          className="text-sm font-medium text-primary hover:underline text-left"
        >
          {fullName}
        </button>
        <div className="text-xs text-gray-400">{payslip.employee.employeeCode}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{payslip.payrollPeriodId.slice(-6)}</td>
      <td className="px-4 py-3 text-sm text-right text-gray-700">{payslip.grossSalary.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-right text-gray-700">{payslip.totalDeductions.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-right font-medium text-primary">{payslip.netSalary.toLocaleString()}</td>
      <td className="px-4 py-3"><PayrollStatusBadge status={payslip.status as 'DRAFT' | 'GENERATED' | 'APPROVED' | 'LOCKED'} /></td>
      <td className="px-4 py-3">
        <button
          onClick={() => navigate(`/hr/payroll/employees/${payslip.employeeId}`)}
          className="text-xs text-primary hover:underline"
        >
          ດູລາພັກຍລະອຽດ
        </button>
      </td>
    </tr>
  )
}

export default function PayrollPaymentListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [periodId, setPeriodId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: periodsData } = usePayrollPeriodsQuery(1, 100)
  const { data, isLoading, isError } = useAllPayslipsQuery({
    page, limit: 20,
    search: search || undefined,
    status: status || undefined,
    periodId: periodId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })

  const handleFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">ລາພັກຍການຈ່າຍທັງໝົດ</h1>
        <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data?.meta.total ?? 0} ລາພັກຍການ</p>
      </div>

      <FilterBar
        search={search} onSearch={handleFilter(setSearch)}
        status={status} onStatus={handleFilter(setStatus)}
        periodId={periodId} onPeriod={handleFilter(setPeriodId)}
        startDate={startDate} onStartDate={handleFilter(setStartDate)}
        endDate={endDate} onEndDate={handleFilter(setEndDate)}
        periods={periodsData?.data ?? []}
      />

      <Card padding={false}>
        {isError ? (
          <p className="px-6 py-12 text-center text-sm text-red-600">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</p>
        ) : (
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
                    ? <tr><td colSpan={HEADERS.length} className="py-12 text-center text-sm text-gray-500">ບໍ່ມີລາພັກຍການ</td></tr>
                    : data?.data.map((ps) => <PayslipRow key={ps.id} payslip={ps} />)
                }
              </tbody>
            </table>
          </div>
        )}
        {data?.meta && (
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
        )}
      </Card>
    </div>
  )
}

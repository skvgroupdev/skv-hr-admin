import { useState } from 'react'
import {
  useAttendanceMonthlyQuery,
  useAttendanceLateQuery,
  useAttendanceAbsentQuery,
  useAttendanceMissingCheckoutQuery,
} from '../../../hooks/queries/useReportsQuery'
import { ReportFilterBar } from './ReportFilterBar'
import { ReportTable } from './ReportTable'
import { cn } from '../../../lib/cn'
import type { ReportQuery } from '../../../types/report'
import { formatDate, formatDateOnly } from '../../../utils/date'

type SubTab = 'monthly' | 'late' | 'absent' | 'missing-checkout'

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'monthly', label: 'ລາພັກຍເດືອນ' },
  { key: 'late', label: 'ມາຊ້າ' },
  { key: 'absent', label: 'ຂາດວຽກ' },
  { key: 'missing-checkout', label: 'ລືມ Check-out' },
]

function MonthlyTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useAttendanceMonthlyQuery(query)
  const headers = ['ພະນັກງານ', 'ວັນທັງໝົດ', 'ມາເຮັດວຽກ', 'ຂາດ', 'ຊ້າ', 'ຊົ່ວໂມງລວມ']
  const rows = data.map((r) => (
    <tr key={r.employeeId} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.totalDays}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.presentDays}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.absentDays}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.lateDays}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.totalWorkHours?.toFixed(1)}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

function LateTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useAttendanceLateQuery(query)
  const headers = ['ພະນັກງານ', 'ວັນທີ', 'ເວລາພັກ Check-in', 'ຊ້າ (ນາທີ)']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDateOnly(r.date)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(r.checkIn)}</td>
      <td className="px-4 py-3 text-sm font-medium text-red-600">{r.lateMinutes}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

function AbsentTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useAttendanceAbsentQuery(query)
  const headers = ['ພະນັກງານ', 'ວັນທີ', 'ເຫດຜົນ']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDateOnly(r.date)}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{r.reason ?? '-'}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

function MissingCheckoutTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useAttendanceMissingCheckoutQuery(query)
  const headers = ['ພະນັກງານ', 'ວັນທີ', 'ເວລາພັກ Check-in']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDateOnly(r.date)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(r.checkIn)}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

export function AttendanceReports() {
  const [subTab, setSubTab] = useState<SubTab>('monthly')
  const now = new Date()
  const [query, setQuery] = useState<ReportQuery>({
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {SUB_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                subTab === t.key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ReportFilterBar query={query} onChange={setQuery} />
      </div>

      {subTab === 'monthly' && <MonthlyTab query={query} />}
      {subTab === 'late' && <LateTab query={query} />}
      {subTab === 'absent' && <AbsentTab query={query} />}
      {subTab === 'missing-checkout' && <MissingCheckoutTab query={query} />}
    </div>
  )
}

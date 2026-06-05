import { useState } from 'react'
import { useLeaveSummaryQuery, useLeaveBalanceQuery } from '../../../hooks/queries/useReportsQuery'
import { ReportFilterBar } from './ReportFilterBar'
import { ReportTable } from './ReportTable'
import { cn } from '../../../lib/cn'
import type { ReportQuery } from '../../../types/report'

type SubTab = 'summary' | 'balance'

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'summary', label: 'ສະຫຼຸບການລາພັກພັກ' },
  { key: 'balance', label: 'ຍອດວັນລາພັກ' },
]

function SummaryTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useLeaveSummaryQuery(query)
  const headers = ['ພະນັກງານ', 'ປະເພດລາພັກ', 'ຈຳນວນວັນ', 'ສະຖານະ']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.leaveType}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.totalDays}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.status}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

function BalanceTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useLeaveBalanceQuery(query)
  const headers = ['ພະນັກງານ', 'ປະເພດລາພັກ', 'ວັນທັງໝົດ', 'ໃຊ້ໄປ', 'ຄົງເຫຼືອ']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.leaveType}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.totalDays}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.usedDays}</td>
      <td className="px-4 py-3 text-sm font-medium text-green-700">{r.remainingDays}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

export function LeaveReports() {
  const [subTab, setSubTab] = useState<SubTab>('summary')
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

      {subTab === 'summary' && <SummaryTab query={query} />}
      {subTab === 'balance' && <BalanceTab query={query} />}
    </div>
  )
}

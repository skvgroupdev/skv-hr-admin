import { useState } from 'react'
import { useOTSummaryQuery, useOTCostQuery } from '../../../hooks/queries/useReportsQuery'
import { ReportFilterBar } from './ReportFilterBar'
import { ReportTable } from './ReportTable'
import { cn } from '../../../lib/cn'
import type { ReportQuery } from '../../../types/report'

type SubTab = 'summary' | 'cost'

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'summary', label: 'ສະຫຼຸບ OT' },
  { key: 'cost', label: 'ຄ່າໃຊ້ຈ່າຍ OT' },
]

function OTSummaryTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useOTSummaryQuery(query)
  const headers = ['ພະນັກງານ', 'ຊົ່ວໂມງລວມ', 'ອນຸມັດ', 'ລໍຖ້າ']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.totalHours?.toFixed(1)}</td>
      <td className="px-4 py-3 text-sm text-green-700 font-medium">{r.approvedHours?.toFixed(1)}</td>
      <td className="px-4 py-3 text-sm text-yellow-600">{r.pendingHours?.toFixed(1)}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

function OTCostTab({ query }: { query: ReportQuery }) {
  const { data = [], isLoading } = useOTCostQuery(query)
  const headers = ['ພະນັກງານ', 'ຊົ່ວໂມງ', 'ອັດຕາ/ຊົ່ວໂມງ', 'ລວມ']
  const rows = data.map((r, i) => (
    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{r.employeeName}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.totalHours?.toFixed(1)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{r.hourlyRate?.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm font-semibold text-primary">{r.totalCost?.toLocaleString()}</td>
    </tr>
  ))
  return <ReportTable headers={headers} rows={rows} isLoading={isLoading} />
}

export function OTReports() {
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

      {subTab === 'summary' && <OTSummaryTab query={query} />}
      {subTab === 'cost' && <OTCostTab query={query} />}
    </div>
  )
}

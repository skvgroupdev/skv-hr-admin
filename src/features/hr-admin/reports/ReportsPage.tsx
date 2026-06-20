import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { AttendanceReports } from './AttendanceReports'
import { LeaveReports } from './LeaveReports'
import { OTReports } from './OTReports'

type TabKey = 'attendance' | 'leave' | 'ot'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'attendance', label: 'ການເຂົ້າວຽກ' },
  { key: 'leave', label: 'ການລາພັກພັກ' },
  { key: 'ot', label: 'OT' },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('attendance')

  return (
    <div className="space-y-5 p-6">
      <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        ລາຍງານ
      </h1>

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

      {activeTab === 'attendance' && <AttendanceReports />}
      {activeTab === 'leave' && <LeaveReports />}
      {activeTab === 'ot' && <OTReports />}
    </div>
  )
}

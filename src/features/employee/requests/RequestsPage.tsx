import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LeaveTab } from './LeaveTab'
import { OTTab } from './OTTab'
import { OutsideWorkTab } from './OutsideWorkTab'
import { AttendanceAdjustmentTab } from './AttendanceAdjustmentTab'

type Tab = 'leave' | 'ot' | 'outside' | 'attendance'

const TABS: { key: Tab; label: string }[] = [
  { key: 'leave', label: 'ລາພັກ' },
  { key: 'ot', label: 'OT' },
  { key: 'outside', label: 'ອອກວຽກນອກ' },
  { key: 'attendance', label: 'ແກ້ເວລາ' },
]

const VALID_TABS = new Set<Tab>(['leave', 'ot', 'outside', 'attendance'])

function resolveInitialTab(state: unknown): Tab {
  const tab = (state as { tab?: string } | null)?.tab
  return tab && VALID_TABS.has(tab as Tab) ? (tab as Tab) : 'leave'
}

export default function RequestsPage() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<Tab>(() => resolveInitialTab(location.state))

  return (
    <div>
      <div className="bg-[#0D2B6B] text-white px-5 pt-4 pb-4">
        <p className="text-lg font-bold">ຄຳຮ້ອງ</p>
      </div>

      <div className="flex bg-white border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'text-[#0D2B6B] border-[#0D2B6B]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-1">
        {activeTab === 'leave' && <LeaveTab />}
        {activeTab === 'ot' && <OTTab />}
        {activeTab === 'outside' && <OutsideWorkTab />}
        {activeTab === 'attendance' && <AttendanceAdjustmentTab />}
      </div>
    </div>
  )
}

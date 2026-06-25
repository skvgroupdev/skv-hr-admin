import { useState } from 'react'
import { ChevronDown, ChevronUp, CalendarOff, MapPin, Clock } from 'lucide-react'
import { useTodayOverviewQuery } from '../../../hooks/queries/useTodayOverviewQuery'
import type { TodayLeaveItem, TodayOutsideWorkItem, TodayAdjustmentItem } from '../../../types/dashboard'

function EmployeeName({ item }: { item: TodayLeaveItem | TodayOutsideWorkItem | TodayAdjustmentItem }) {
  if (!item.employee) return <span className="text-gray-400">-</span>
  const { firstName, lastName, employeeCode } = item.employee
  return (
    <span>
      {employeeCode && <span className="text-gray-400 mr-1 text-xs">{employeeCode}</span>}
      {firstName} {lastName}
    </span>
  )
}

interface ExpandableSectionProps {
  title: string
  count: number
  icon: React.ReactNode
  badgeColor: string
  children: React.ReactNode
}

function ExpandableSection({ title, count, icon, badgeColor, children }: ExpandableSectionProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColor}`}>
            {count} ຄົນ
          </span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && count > 0 && (
        <div className="border-t border-gray-100 divide-y divide-gray-50">
          {children}
        </div>
      )}

      {open && count === 0 && (
        <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-400">ບໍ່ມີລາຍການ</div>
      )}
    </div>
  )
}

function LeaveList({ items }: { items: TodayLeaveItem[] }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.employeeId} className="flex items-center justify-between px-4 py-2.5 bg-yellow-50">
          <span className="text-sm text-gray-700"><EmployeeName item={item} /></span>
          <div className="flex items-center gap-2">
            {item.leaveTypeName && (
              <span className="text-xs text-gray-500">{item.leaveTypeName}</span>
            )}
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${
              item.status === 'APPROVED'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
              {item.status === 'APPROVED' ? 'ອະນຸມັດ' : 'ລໍຖ້າ'}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

function OutsideWorkList({ items }: { items: TodayOutsideWorkItem[] }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.employeeId} className="flex items-center justify-between px-4 py-2.5 bg-blue-50">
          <span className="text-sm text-gray-700"><EmployeeName item={item} /></span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{item.outsideType.replace(/_/g, ' ')}</span>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${
              item.status === 'APPROVED'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              {item.status === 'APPROVED' ? 'ອະນຸມັດ' : 'ລໍຖ້າ'}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

function AdjustmentList({ items }: { items: TodayAdjustmentItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={`${item.employeeId}-${i}`} className="flex items-center justify-between px-4 py-2.5 bg-violet-50">
          <span className="text-sm text-gray-700"><EmployeeName item={item} /></span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{item.type.replace(/_/g, ' ')}</span>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${
              item.status === 'APPROVED'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-violet-100 text-violet-800 border-violet-200'
            }`}>
              {item.status === 'APPROVED' ? 'ອະນຸມັດ' : 'ລໍຖ້າ'}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

export function TodayOverviewWidget() {
  const { data, isLoading } = useTodayOverviewQuery()

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-12 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-12 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    )
  }

  const leaveCount = data?.leave?.length ?? 0
  const outsideCount = data?.outsideWork?.length ?? 0
  const adjustmentCount = data?.adjustments?.length ?? 0

  return (
    <div className="space-y-2">
      <ExpandableSection
        title="ລາ"
        count={leaveCount}
        icon={<CalendarOff className="w-4 h-4 text-yellow-600" />}
        badgeColor="bg-yellow-100 text-yellow-800"
      >
        <LeaveList items={data?.leave ?? []} />
      </ExpandableSection>

      <ExpandableSection
        title="ນອກສະຖານທີ"
        count={outsideCount}
        icon={<MapPin className="w-4 h-4 text-blue-600" />}
        badgeColor="bg-blue-100 text-blue-800"
      >
        <OutsideWorkList items={data?.outsideWork ?? []} />
      </ExpandableSection>

      <ExpandableSection
        title="ຂໍແກ້ເວລາ"
        count={adjustmentCount}
        icon={<Clock className="w-4 h-4 text-violet-600" />}
        badgeColor="bg-violet-100 text-violet-800"
      >
        <AdjustmentList items={data?.adjustments ?? []} />
      </ExpandableSection>
    </div>
  )
}

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAttendanceSummaryQuery } from '../../../hooks/queries/useAttendanceReportQuery'
import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '../../../api/attendance.api'
import type { NotCheckedInEmployee } from '../../../api/attendance.api'
import { Card } from '../../../components/ui/Card'
import PhotoModal from '../../../components/ui/PhotoModal'
import { cn } from '../../../lib/cn'
import type { AttendanceLog, AttendanceStatus, AttendanceSummary } from '../../../types/attendance'
import { useAuthStore } from '../../../stores/useAuthStore'
import { useBranchesQuery } from '../../../hooks/queries/useBranchesQuery'
import { useTodayOverviewQuery } from '../../../hooks/queries/useTodayOverviewQuery'
import type { TodayOverview } from '../../../types/dashboard'
import LeavePage from '../leave/LeavePage'
import OutsideWorkPage from '../outside-work/OutsideWorkPage'

interface PopulatedEmployee {
  firstName: string
  lastName: string
  employeeCode?: string
  positionId?: { name: string }
}

interface AttendanceLogWithEmployee extends AttendanceLog {
  employee?: PopulatedEmployee
}

type TopTab = 'attendance' | 'leave' | 'outside-work'

const TOP_TABS: { key: TopTab; label: string }[] = [
  { key: 'attendance', label: 'ການເຂົ້າວຽກ' },
  { key: 'leave', label: 'ລາພັກ' },
  { key: 'outside-work', label: 'ນອກສະຖານທີ' },
]

type TabKey = 'checkin' | 'late' | 'absent'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'checkin', label: 'ເຊັກອິນ' },
  { key: 'late', label: 'ມາຊ້າ' },
  { key: 'absent', label: 'ຍັງບໍ່ທັນເຊັກອິນ' },
]

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  NORMAL: 'ປົກກະຕິ',
  LATE: 'ມາຊ້າ',
  LATE_MINOR: 'ມາຊ້າໜ້ອຍ',
  EARLY_LEAVE: 'ກັບກ່ອນ',
  ABSENT: 'ຂາດ',
  MISSING_CHECKOUT: 'ບໍ່ checkout',
  OUTSIDE_PENDING: 'ນອກສາຂາ (ລໍ)',
  OUTSIDE_APPROVED: 'ນອກສາຂາ (ອນຸ)',
  OUTSIDE_REJECTED: 'ນອກສາຂາ (ປະຕິ)',
  MANUAL_ADJUSTED: 'ປ່ຽນ manual',
}

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  NORMAL: 'bg-green-100 text-green-800 border-green-200',
  LATE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  LATE_MINOR: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  EARLY_LEAVE: 'bg-orange-100 text-orange-800 border-orange-200',
  ABSENT: 'bg-red-100 text-red-800 border-red-200',
  MISSING_CHECKOUT: 'bg-gray-100 text-gray-700 border-gray-200',
  OUTSIDE_PENDING: 'bg-blue-100 text-blue-700 border-blue-200',
  OUTSIDE_APPROVED: 'bg-teal-100 text-teal-700 border-teal-200',
  OUTSIDE_REJECTED: 'bg-red-100 text-red-700 border-red-200',
  MANUAL_ADJUSTED: 'bg-purple-100 text-purple-700 border-purple-200',
}


const todayStr = () => new Date().toISOString().split('T')[0]

// Summary card config
interface SummaryCardConfig {
  label: string
  value: number
  colorClass: string
}

function buildSummaryCards(summary: AttendanceSummary): SummaryCardConfig[] {
  return [
    { label: 'ທັງໝົດ', value: summary.total, colorClass: 'bg-gray-50 border-gray-200' },
    { label: 'ເຊັກອິນແລ້ວ', value: summary.checkedIn, colorClass: 'bg-green-50 border-green-200' },
    { label: 'ຊ້າ', value: summary.late, colorClass: 'bg-yellow-50 border-yellow-200' },
    { label: 'ຍັງບໍ່ເຊັກ', value: summary.notCheckedIn, colorClass: 'bg-red-50 border-red-200' },
  ]
}

const SUMMARY_VALUE_COLORS = ['text-gray-700', 'text-green-700', 'text-yellow-700', 'text-red-700']

function SummaryCards({ summary }: { summary: AttendanceSummary }) {
  const cards = buildSummaryCards(summary)
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <div key={card.label} className={`rounded-xl border p-4 ${card.colorClass}`}>
          <p className="text-xs text-gray-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-semibold ${SUMMARY_VALUE_COLORS[i]}`}>
            {card.value} <span className="text-sm font-normal">ຄົນ</span>
          </p>
        </div>
      ))}
    </div>
  )
}

interface Branch {
  id: string
  name: string
}

interface DailyFilterBarProps {
  date: string
  onDateChange: (d: string) => void
  showBranchFilter: boolean
  branches: Branch[]
  selectedBranchId: string
  onBranchChange: (id: string) => void
}

function DailyFilterBar({
  date,
  onDateChange,
  showBranchFilter,
  branches,
  selectedBranchId,
  onBranchChange,
}: DailyFilterBarProps) {
  const isToday = date === todayStr()
  return (
    <div className="flex items-center gap-2">
      {showBranchFilter && (
        <select
          value={selectedBranchId}
          onChange={(e) => onBranchChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">ທຸກສາຂາ</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={() => onDateChange(todayStr())}
        className={cn(
          'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isToday ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
        )}
      >
        ມື້ນີ້
      </button>
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}


function employeeDisplay(log: AttendanceLogWithEmployee) {
  const code = log.employee?.employeeCode ?? ''
  const name = log.employee
    ? `${log.employee.firstName} ${log.employee.lastName}`
    : log.employeeId.slice(-6)
  return { code, name, position: log.employee?.positionId?.name ?? '-' }
}

function formatCheckTime(checkTime: string): string {
  return new Date(checkTime).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  })
}

const HEADERS_CHECKIN = ['ລະຫັດ', 'ຊື່ພະນັກງານ', 'ຕຳແໜ່ງ', 'ເວລາເຊັກອິນ', 'ສະຖານະ', 'ຊ້າ (ນາທີ)', 'ຮູບ']
const HEADERS_NOT_CHECKED_IN = ['ລະຫັດ', 'ຊື່ພະນັກງານ', 'ຕຳແໜ່ງ', 'ສາຂາ', 'ເວລາເຂົ້າວຽກ', 'ສະຖານະ']

// Build lookup maps: employeeId → leave/outside-work info (only for today's date)
function buildOverviewMaps(overview: TodayOverview | undefined) {
  const leaveMap = new Map<string, { status: string; leaveTypeName: string | null }>()
  const outsideMap = new Map<string, { status: string; outsideType: string }>()
  if (!overview) return { leaveMap, outsideMap }
  for (const item of overview.leave) {
    leaveMap.set(item.employeeId, { status: item.status, leaveTypeName: item.leaveTypeName })
  }
  for (const item of overview.outsideWork) {
    outsideMap.set(item.employeeId, { status: item.status, outsideType: item.outsideType })
  }
  return { leaveMap, outsideMap }
}

interface EmployeeStatusBadgesProps {
  employeeId: string
  leaveMap: Map<string, { status: string; leaveTypeName: string | null }>
  outsideMap: Map<string, { status: string; outsideType: string }>
}

function EmployeeStatusBadges({ employeeId, leaveMap, outsideMap }: EmployeeStatusBadgesProps) {
  const leave = leaveMap.get(employeeId)
  const outside = outsideMap.get(employeeId)
  if (!leave && !outside) return null
  return (
    <span className="ml-1.5 inline-flex gap-1">
      {leave && (
        <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          ລາ
        </span>
      )}
      {outside && (
        <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          ນອກສະຖານທີ
        </span>
      )}
    </span>
  )
}

interface AttendanceRowCheckinProps {
  log: AttendanceLogWithEmployee
  onPhotoClick: (url: string) => void
  leaveMap: Map<string, { status: string; leaveTypeName: string | null }>
  outsideMap: Map<string, { status: string; outsideType: string }>
}

function AttendanceRowCheckin({ log, onPhotoClick, leaveMap, outsideMap }: AttendanceRowCheckinProps) {
  const emp = employeeDisplay(log)
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-500">{emp.code || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        <span className="inline-flex items-center flex-wrap gap-1">
          {emp.name}
          <EmployeeStatusBadges employeeId={log.employeeId} leaveMap={leaveMap} outsideMap={outsideMap} />
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{emp.position}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatCheckTime(log.checkTime)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_COLORS[log.status]}`}>
          {STATUS_LABELS[log.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {(log.status === 'LATE' || log.status === 'LATE_MINOR') && log.lateMinutes != null
          ? <span className={`font-medium ${log.status === 'LATE' ? 'text-red-600' : 'text-yellow-700'}`}>
              {log.lateMinutes} ນາທີ
            </span>
          : '-'}
      </td>
      <td className="px-4 py-3">
        {log.selfieUrl
          ? (
            <img
              src={log.selfieUrl}
              alt="selfie"
              className="h-8 w-8 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onPhotoClick(log.selfieUrl!)}
            />
          )
          : <span className="text-sm text-gray-400">-</span>
        }
      </td>
    </tr>
  )
}

interface AttendanceTableProps {
  logs: AttendanceLogWithEmployee[]
  onPhotoClick: (url: string) => void
  leaveMap: Map<string, { status: string; leaveTypeName: string | null }>
  outsideMap: Map<string, { status: string; outsideType: string }>
}

function AttendanceTable({ logs, onPhotoClick, leaveMap, outsideMap }: AttendanceTableProps) {
  if (logs.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-500">ບໍ່ມີຂໍ້ມູນ</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-primary text-white">
            {HEADERS_CHECKIN.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <AttendanceRowCheckin
              key={log.id}
              log={log}
              onPhotoClick={onPhotoClick}
              leaveMap={leaveMap}
              outsideMap={outsideMap}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface NotCheckedInTableProps {
  employees: NotCheckedInEmployee[]
  leaveMap: Map<string, { status: string; leaveTypeName: string | null }>
  outsideMap: Map<string, { status: string; outsideType: string }>
}

function NotCheckedInTable({ employees, leaveMap, outsideMap }: NotCheckedInTableProps) {
  if (employees.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-500">ບໍ່ມີຂໍ້ມູນ</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-primary text-white">
            {HEADERS_NOT_CHECKED_IN.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-500">{emp.employeeCode || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <span className="inline-flex items-center flex-wrap gap-1">
                  {emp.firstName} {emp.lastName}
                  <EmployeeStatusBadges employeeId={emp.id} leaveMap={leaveMap} outsideMap={outsideMap} />
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{emp.position?.name ?? '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{emp.branch?.name ?? '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{emp.shiftStartTime ?? '-'}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border bg-red-100 text-red-800 border-red-200">
                  ຍັງບໍ່ເຊັກອິນ
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function filterLogs(allLogs: AttendanceLogWithEmployee[], tab: TabKey) {
  if (tab === 'checkin') return allLogs.filter((l) => l.type === 'CHECK_IN')
  if (tab === 'late') return allLogs.filter(
    (l) => l.type === 'CHECK_IN' && (l.status === 'LATE' || l.status === 'LATE_MINOR'),
  )
  return allLogs
}

const BRANCH_FILTER_ROLES = ['COMPANY_OWNER', 'HR_ADMIN'] as const
type BranchFilterRole = (typeof BRANCH_FILTER_ROLES)[number]

function isBranchFilterRole(role: string | undefined): role is BranchFilterRole {
  return BRANCH_FILTER_ROLES.includes(role as BranchFilterRole)
}

function AttendanceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('checkin')
  const [date, setDate] = useState(todayStr)
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)
  const [selectedBranchId, setSelectedBranchId] = useState<string>('')

  const user = useAuthStore((s) => s.user)
  const showBranchFilter = isBranchFilterRole(user?.role)

  const { data: branchesData } = useBranchesQuery({ isActive: true, limit: 100 })
  const branches = branchesData?.data ?? []

  const branchIdParam = showBranchFilter && selectedBranchId ? { branchId: selectedBranchId } : {}

  const { data: dailyData, isLoading, isError, isFetching } = useQuery({
    queryKey: ['attendance', 'report', 'daily', date, selectedBranchId],
    queryFn: () => attendanceApi.getDailyReport({ date, ...branchIdParam }),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })

  const { data: notCheckedInData, isLoading: notCheckedInLoading } = useQuery({
    queryKey: ['attendance', 'report', 'not-checked-in', date, selectedBranchId],
    queryFn: () => attendanceApi.getNotCheckedInReport({ date, ...branchIdParam }),
    enabled: activeTab === 'absent',
    staleTime: 30_000,
    refetchInterval: 30_000,
  })

  const { data: summary } = useAttendanceSummaryQuery({ date, ...branchIdParam })

  const isToday = date === todayStr()
  const { data: todayOverview } = useTodayOverviewQuery()
  const { leaveMap, outsideMap } = buildOverviewMaps(isToday ? todayOverview : undefined)

  const allLogs = (dailyData as AttendanceLogWithEmployee[]) ?? []
  const displayLogs = filterLogs(allLogs, activeTab)
  const loading = activeTab === 'absent' ? notCheckedInLoading : isLoading

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <RefreshCw className={cn('w-3 h-3', isFetching && 'animate-spin')} />
          ອັບເດດທຸກ 30 ວິນາທີ
        </span>
        <DailyFilterBar
          date={date}
          onDateChange={setDate}
          showBranchFilter={showBranchFilter}
          branches={branches}
          selectedBranchId={selectedBranchId}
          onBranchChange={setSelectedBranchId}
        />
      </div>

      {summary && <SummaryCards summary={summary} />}

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

      <Card padding={false}>
        {isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</div>
        ) : loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">ກຳລັງໂຫລດ...</div>
        ) : activeTab === 'absent' ? (
          <NotCheckedInTable employees={notCheckedInData ?? []} leaveMap={leaveMap} outsideMap={outsideMap} />
        ) : (
          <AttendanceTable logs={displayLogs} onPhotoClick={setSelfieUrl} leaveMap={leaveMap} outsideMap={outsideMap} />
        )}
      </Card>

      {selfieUrl && <PhotoModal url={selfieUrl} onClose={() => setSelfieUrl(null)} />}
    </div>
  )
}

export default function AttendancePage() {
  const [topTab, setTopTab] = useState<TopTab>('attendance')

  return (
    <div>
      <div className="px-6 pt-6 pb-0 space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">ການເຂົ້າວຽກ & ການລາ</h1>
        <div className="border-b border-gray-200 mt-4">
          <nav className="-mb-px flex gap-6">
            {TOP_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTopTab(tab.key)}
                className={cn(
                  'pb-3 text-sm font-medium border-b-2 transition-colors',
                  topTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {topTab === 'attendance' && (
        <div className="p-6">
          <AttendanceContent />
        </div>
      )}
      {topTab === 'leave' && <LeavePage />}
      {topTab === 'outside-work' && <OutsideWorkPage />}
    </div>
  )
}

import { Calendar } from 'lucide-react'
import { useDashboardQuery } from '../../../hooks/queries/useDashboardQuery'
import { useTodayOverviewQuery } from '../../../hooks/queries/useTodayOverviewQuery'
import { SummaryCards } from './SummaryCards'
import { RecentEmployeesTable } from './RecentEmployeesTable'
import { MonthlyChart } from './MonthlyChart'
import { TodayOverviewWidget } from './TodayOverviewWidget'
import { AttendanceDonutChart } from './AttendanceDonutChart'
import { AttendanceTrendChart } from './AttendanceTrendChart'

function TodayBadge() {
  const now = new Date()
  const label = now.toLocaleDateString('lo-LA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
      <Calendar className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardQuery()
  const { data: todayOverview, isLoading: isTodayLoading } = useTodayOverviewQuery()

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500">ໂຫລດຂໍ້ມູນບໍ່ໄດ້ — ກະລຸນາລອງໃໝ່</p>
      </div>
    )
  }

  const todayLeaveCount = todayOverview?.leave?.length ?? 0
  const todayOutsideCount = todayOverview?.outsideWork?.length ?? 0
  const hasMonthlyData = (data?.monthlyStats?.length ?? 0) > 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ພາບລວມ</h1>
          <p className="mt-0.5 text-sm text-gray-500">ສະຫຼຸບຂໍ້ມູນທັງໝົດໃນລະບົບ</p>
        </div>
        <TodayBadge />
      </div>

      {/* Row 1 — Summary cards */}
      <SummaryCards data={data} isLoading={isLoading} />

      {/* Row 2 — Bar chart (2/3) + Donut (1/3) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyChart stats={data?.monthlyStats ?? []} isLoading={isLoading} />
        </div>
        <div>
          <AttendanceDonutChart
            dashboardData={data}
            todayLeaveCount={todayLeaveCount}
            todayOutsideCount={todayOutsideCount}
            isLoading={isLoading || isTodayLoading}
          />
        </div>
      </div>

      {/* Row 3 — Recent employees (2/3) + Today overview (1/3) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentEmployeesTable employees={data?.recentEmployees ?? []} isLoading={isLoading} />
        </div>
        <div>
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 h-full">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-gray-700">ສະຖານະພະນັກງານມື້ນີ້</h2>
              <p className="text-xs text-gray-400 mt-0.5">ລາ ແລະ ນອກສະຖານທີ</p>
            </div>
            <TodayOverviewWidget />
          </div>
        </div>
      </div>

      {/* Row 4 — Trend chart (full width) — only when data exists */}
      {hasMonthlyData && (
        <AttendanceTrendChart stats={data?.monthlyStats ?? []} isLoading={isLoading} />
      )}
    </div>
  )
}

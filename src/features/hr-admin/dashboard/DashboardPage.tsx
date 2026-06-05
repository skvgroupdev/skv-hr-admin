import { useDashboardQuery } from '../../../hooks/queries/useDashboardQuery'
import { SummaryCards } from './SummaryCards'
import { RecentEmployeesTable } from './RecentEmployeesTable'
import { MonthlyChart } from './MonthlyChart'

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardQuery()

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500">ໂຫລດຂໍ້ມູນບໍ່ໄດ້ — ກະລຸນາລອງໃໝ່</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">ພາບລວມ</h1>
        <p className="mt-0.5 text-sm text-gray-500">ສະຫຼຸບຂໍ້ມູນທັງໝົດໃນລະບົບ</p>
      </div>

      <SummaryCards data={data} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentEmployeesTable
          employees={data?.recentEmployees ?? []}
          isLoading={isLoading}
        />
        <MonthlyChart
          stats={data?.monthlyStats ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

import { Users, ClipboardCheck, Clock, GitBranch } from 'lucide-react'
import { StatCard } from './StatCard'
import type { DashboardData } from '../../../types/dashboard'

interface SummaryCardsProps {
  data: DashboardData | undefined
  isLoading: boolean
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="ພະນັກງານທັງໝົດ"
        value={data?.employees.total ?? 0}
        subtitle={`Active ${data?.employees.active ?? 0} / Probation ${data?.employees.probation ?? 0}`}
        icon={<Users className="h-6 w-6" />}
        colorClass="bg-primary"
        isLoading={isLoading}
      />
      <StatCard
        title="ເຂົ້າວຽກວັນນີ້"
        value={data?.todayAttendance ?? 0}
        subtitle="ຄົນ"
        icon={<ClipboardCheck className="h-6 w-6" />}
        colorClass="bg-emerald-500"
        isLoading={isLoading}
      />
      <StatCard
        title="ຄຳຂໍລໍຖ້າ"
        value={data?.pendingRequests.total ?? 0}
        subtitle={`ລາພັກ ${data?.pendingRequests.leave ?? 0} / OT ${data?.pendingRequests.ot ?? 0}`}
        icon={<Clock className="h-6 w-6" />}
        colorClass="bg-amber-500"
        isLoading={isLoading}
      />
      <StatCard
        title="ສາຂາ Active"
        value={data?.branches.active ?? 0}
        subtitle={`ທັງໝົດ ${data?.branches.total ?? 0} ສາຂາ`}
        icon={<GitBranch className="h-6 w-6" />}
        colorClass="bg-violet-500"
        isLoading={isLoading}
      />
    </div>
  )
}

import { AlertTriangle } from 'lucide-react'
import type { AttendanceRecord } from '../../../api/employee-attendance.api'
import { formatDate } from '../../../utils/date'

interface AttendanceStatusCardProps {
  record: AttendanceRecord | null | undefined
  isLoading: boolean
}

const STATUS_CONFIG = {
  CHECKED_OUT: { dot: 'bg-gray-400',                       label: 'ອອກວຽກແລ້ວເດີ',      color: 'text-gray-500',         icon: null },
  PRESENT:     { dot: 'bg-employee-success animate-pulse', label: 'ເຂົ້າວຽກແລ້ວເດີ',    color: 'text-employee-success', icon: null },
  LATE:        { dot: 'bg-employee-danger animate-pulse',  label: 'ເຂົ້າວຽກແລ້ວເດີ (ຊ້າ)', color: 'text-employee-danger', icon: null },
  LATE_MINOR:  { dot: 'bg-yellow-400 animate-pulse',       label: 'ເຂົ້າວຽກແລ້ວເດີ (ຊ້າໜ້ອຍ)', color: 'text-yellow-500', icon: AlertTriangle },
  ABSENT:      { dot: 'bg-employee-danger',                label: 'ຂາດວຽກ',              color: 'text-employee-danger',  icon: null },
  HALF_DAY:    { dot: 'bg-employee-accent',                label: 'ເຄິ່ງວັນ',             color: 'text-employee-accent',  icon: null },
  NOT_YET:     { dot: 'bg-gray-300',                       label: 'ຍັງບໍ່ໄດ້ເຂົ້າວຽກ',    color: 'text-gray-400',         icon: null },
}

function CardSkeleton() {
  return (
    <div className="-mt-6 mx-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-900/10 border border-white/20 p-5">
      <div className="h-4 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded-lg w-1/2 mb-3" />
      <div className="flex justify-between gap-3">
        <div className="h-7 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded-full w-28" />
        <div className="h-7 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded-full w-28" />
      </div>
    </div>
  )
}

function TimeBadge({ label, time }: { label: string; time: string }) {
  return (
    <span className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5 text-xs text-gray-600 font-medium">
      {label}: <span className="font-semibold text-gray-800">{time}</span>
    </span>
  )
}

export function AttendanceStatusCard({ record, isLoading }: AttendanceStatusCardProps) {
  if (isLoading) return <CardSkeleton />

  const statusKey = !record?.checkIn
    ? 'NOT_YET'
    : record.checkOut
    ? 'CHECKED_OUT'
    : (record.status as keyof typeof STATUS_CONFIG) ?? 'PRESENT'
  const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.NOT_YET

  return (
    <div className="-mt-6 mx-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-900/10 border border-white/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        {config.icon
          ? <config.icon className={`h-4 w-4 shrink-0 ${config.color}`} />
          : <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${config.dot}`} />
        }
        <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <TimeBadge label="ເຂົ້າ" time={formatDate(record?.checkIn)} />
        <TimeBadge label="ອອກ"  time={formatDate(record?.checkOut)} />
      </div>
    </div>
  )
}

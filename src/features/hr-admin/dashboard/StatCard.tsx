import { cn } from '../../../lib/cn'

export interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  colorClass?: string
  isLoading?: boolean
}

export function StatCard({ title, value, subtitle, icon, colorClass = 'bg-primary', isLoading }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className={cn('rounded-lg p-3', colorClass)}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  )
}

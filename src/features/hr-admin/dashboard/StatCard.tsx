import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../../lib/cn'

export interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  colorClass?: string
  /** Positive = growth, negative = decline. Shows arrow + % badge. */
  trend?: number
  isLoading?: boolean
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  colorClass = 'bg-primary',
  trend,
  isLoading,
}: StatCardProps) {
  const hasTrend = trend !== undefined && trend !== 0

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>

          {isLoading ? (
            <div className="mt-2 h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <div className="mt-1.5 flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
              {hasTrend && (
                <span
                  className={cn(
                    'mb-0.5 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                    trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
                  )}
                >
                  {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
          )}

          {subtitle && (
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className={cn('rounded-xl p-3 ml-3', colorClass)}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  )
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyStatItem } from '../../../types/dashboard'

const MONTH_LABELS = ['ມ.ກ', 'ກ.ພ', 'ມ.ນ', 'ມ.ສ', 'ພ.ຈ', 'ມ.ຖ', 'ກ.ລ', 'ສ.ຫ', 'ກ.ຍ', 'ຕ.ລ', 'ພ.ຈ', 'ທ.ວ']

function toChartData(stats: MonthlyStatItem[]) {
  return stats.map((s) => ({
    month: MONTH_LABELS[s.month - 1] ?? `M${s.month}`,
    ລາພັກ: s.leaveCount,
    OT: s.otCount,
  }))
}

interface MonthlyChartProps {
  stats: MonthlyStatItem[]
  isLoading: boolean
}

export function MonthlyChart({ stats, isLoading }: MonthlyChartProps) {
  const chartData = toChartData(stats)

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-800">ສະຫຼຸບການລາພັກພັກ / OT ລາພັກຍເດືອນ ({new Date().getFullYear()})</h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="h-56 animate-pulse rounded bg-gray-100" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="ລາພັກ" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="OT" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

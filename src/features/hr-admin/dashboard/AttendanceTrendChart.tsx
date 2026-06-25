import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { MonthlyStatItem } from '../../../types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const MONTH_LABELS = ['ມ.ກ', 'ກ.ພ', 'ມ.ນ', 'ມ.ສ', 'ພ.ຈ', 'ມ.ຖ', 'ກ.ລ', 'ສ.ຫ', 'ກ.ຍ', 'ຕ.ລ', 'ພ.ຈ', 'ທ.ວ']

interface AttendanceTrendChartProps {
  stats: MonthlyStatItem[]
  isLoading: boolean
}

export function AttendanceTrendChart({ stats, isLoading }: AttendanceTrendChartProps) {
  const labels = stats.map((s) => MONTH_LABELS[s.month - 1] ?? `M${s.month}`)

  // Use combined activity (leave + OT) as a proxy for "workforce engagement" trend
  const otData = stats.map((s) => s.otCount)
  const leaveData = stats.map((s) => s.leaveCount)

  const data = {
    labels,
    datasets: [
      {
        label: 'OT (ຊົ່ວໂມງ)',
        data: otData,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'ລາພັກ (ຄັ້ງ)',
        data: leaveData,
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.06)',
        borderWidth: 2.5,
        pointBackgroundColor: '#d97706',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12, family: 'inherit' },
          color: '#6b7280',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 10,
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        bodyFont: { size: 12, family: 'inherit' },
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 12, family: 'inherit' } },
        border: { display: false },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          color: '#9ca3af',
          font: { size: 12, family: 'inherit' },
          stepSize: 1,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="px-5 py-4 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-800">Trend OT ແລະ ລາພັກ ລາຍເດືອນ</h2>
        <p className="text-xs text-gray-400 mt-0.5">ແນວໂນ້ມການລາ ແລະ OT ຕະຫຼອດປີ {new Date().getFullYear()}</p>
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
        ) : (
          <div style={{ height: 200 }}>
            <Line data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  )
}

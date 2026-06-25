import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { DashboardData } from '../../../types/dashboard'

ChartJS.register(ArcElement, Tooltip, Legend)

interface AttendanceDonutChartProps {
  dashboardData: DashboardData | undefined
  todayLeaveCount: number
  todayOutsideCount: number
  isLoading: boolean
}

export function AttendanceDonutChart({
  dashboardData,
  todayLeaveCount,
  todayOutsideCount,
  isLoading,
}: AttendanceDonutChartProps) {
  const totalActive = dashboardData?.employees.active ?? 0
  const checkedIn = dashboardData?.todayAttendance ?? 0

  // derive absent: total active minus all accounted-for categories
  const absent = Math.max(0, totalActive - checkedIn - todayLeaveCount - todayOutsideCount)
  const attendancePct = totalActive > 0 ? Math.round((checkedIn / totalActive) * 100) : 0

  const data = {
    labels: ['ເຂົ້າວຽກ', 'ລາ', 'ນອກສະຖານທີ', 'ຂາດ'],
    datasets: [
      {
        data: [checkedIn, todayLeaveCount, todayOutsideCount, absent],
        backgroundColor: ['#059669', '#d97706', '#1d4ed8', '#ef4444'],
        hoverBackgroundColor: ['#047857', '#b45309', '#1e40af', '#dc2626'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 12,
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
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} ຄົນ`,
        },
      },
    },
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
      <div className="px-5 py-4 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-800">ການມາເຂົ້າວຽກ</h2>
        <p className="text-xs text-gray-400 mt-0.5">ສັດສ່ວນສະຖານະພະນັກງານມື້ນີ້</p>
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="h-56 animate-pulse rounded-full mx-auto w-56 bg-gray-100" />
        ) : (
          <div className="relative" style={{ height: 220 }}>
            <Doughnut data={data} options={options} />
            {/* center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{attendancePct}%</span>
              <span className="text-xs text-gray-400 mt-0.5">ເຂົ້າວຽກ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

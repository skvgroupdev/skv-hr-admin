import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useEmployeeMonthlyAttendanceQuery } from '../../../hooks/queries/useEmployeeMonthlyAttendanceQuery'
import { Card } from '../../../components/ui/Card'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'
import type { DayStatus, DailyAttendanceRecord } from '../../../types/attendance'

// ---- Constants ---------------------------------------------------------------

const DAY_STATUS_COLOR: Record<DayStatus, string> = {
  PRESENT: '#22c55e',
  LATE: '#eab308',
  ABSENT: '#ef4444',
  EARLY_LEAVE: '#f97316',
  WEEKEND: '#e5e7eb',
}

const DAY_STATUS_LABEL: Record<DayStatus, string> = {
  PRESENT: 'ມາຕາມເວລາ',
  LATE: 'ຊ້າ',
  ABSENT: 'ຂາດ',
  EARLY_LEAVE: 'ອອກກ່ອນ',
  WEEKEND: 'ວັນຫຍຸດ',
}

const DAY_STATUS_BADGE: Record<DayStatus, string> = {
  PRESENT: 'bg-green-100 text-green-700 border-green-200',
  LATE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ABSENT: 'bg-red-100 text-red-700 border-red-200',
  EARLY_LEAVE: 'bg-orange-100 text-orange-700 border-orange-200',
  WEEKEND: 'bg-gray-100 text-gray-500 border-gray-200',
}

const LAO_MONTHS = [
  '', 'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
  'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ',
]

const LAO_DAY_SHORT = ['ອາ', 'ຈ', 'ອ', 'ພ', 'ພຫ', 'ສ', 'ສ']

// ---- Month selector ----------------------------------------------------------

function MonthSelector({
  year,
  month,
  onPrev,
  onNext,
  canGoNext,
}: {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  canGoNext: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>
      <span className="min-w-[120px] text-center text-sm font-semibold text-gray-900">
        {LAO_MONTHS[month]} {year}
      </span>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  )
}

// ---- Summary cards -----------------------------------------------------------

function SummaryCards({
  presentDays,
  lateDays,
  absentDays,
  earlyLeaveDays,
  onTimeRate,
}: {
  presentDays: number
  lateDays: number
  absentDays: number
  earlyLeaveDays: number
  onTimeRate: number
}) {
  const cards = [
    { label: 'ມາວຽກ', value: `${presentDays} ວັນ`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'ຊ້າ', value: `${lateDays} ຄັ້ງ`, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'ຂາດ', value: `${absentDays} ວັນ`, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'ອອກກ່ອນ', value: `${earlyLeaveDays} ຄັ້ງ`, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'ຕ່ອງເວລາ', value: `${onTimeRate.toFixed(0)}%`, color: 'text-primary', bg: 'bg-blue-50' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl p-3 ${card.bg}`}>
          <p className="text-xs text-gray-500">{card.label}</p>
          <p className={`mt-1 text-lg font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}

// ---- Chart tooltip -----------------------------------------------------------

interface TooltipPayloadItem {
  payload: DailyAttendanceRecord & { dayLabel: string; barValue: number }
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null

  const record = payload[0].payload
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-900 mb-1">{record.date}</p>
      <p className="text-gray-600">
        {LAO_DAY_SHORT[record.dayOfWeek]} •{' '}
        <span
          style={{ color: DAY_STATUS_COLOR[record.dayStatus] }}
          className="font-medium"
        >
          {DAY_STATUS_LABEL[record.dayStatus]}
        </span>
      </p>
      {record.checkIn && (
        <p className="text-gray-600 mt-1">ເຂົ້າ: {record.checkIn.time}</p>
      )}
      {record.checkOut && (
        <p className="text-gray-600">ອອກ: {record.checkOut.time}</p>
      )}
      {(record.checkIn?.lateMinutes ?? 0) > 0 && (
        <p className="text-yellow-600 mt-1">ຊ້າ {record.checkIn?.lateMinutes} ນາທີ</p>
      )}
    </div>
  )
}

// ---- Bar chart ---------------------------------------------------------------

function AttendanceBarChart({ records }: { records: DailyAttendanceRecord[] }) {
  const chartData = records.map((r) => ({
    ...r,
    dayLabel: String(new Date(r.date).getDate()),
    // Weekend = 0.3 height just to show it exists, workday statuses = 1
    barValue: r.dayStatus === 'WEEKEND' ? 0.3 : 1,
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} barSize={14} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <XAxis
          dataKey="dayLabel"
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis hide domain={[0, 1]} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
        <Bar dataKey="barValue" radius={[3, 3, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={DAY_STATUS_COLOR[entry.dayStatus]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ---- Daily records table -----------------------------------------------------

function DailyRecordsTable({ records }: { records: DailyAttendanceRecord[] }) {
  const workDays = records.filter((r) => r.dayStatus !== 'WEEKEND')

  if (workDays.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">ບໍ່ມີຂໍ້ມູນ</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-3 py-2.5 text-left font-medium text-xs">ວັນທີ</th>
            <th className="px-3 py-2.5 text-left font-medium text-xs">ວັນ</th>
            <th className="px-3 py-2.5 text-left font-medium text-xs">ເຂົ້າວຽກ</th>
            <th className="px-3 py-2.5 text-left font-medium text-xs">ອອກວຽກ</th>
            <th className="px-3 py-2.5 text-left font-medium text-xs">ສະຖານະ</th>
            <th className="px-3 py-2.5 text-right font-medium text-xs">ຊ້າ (ນາທີ)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {workDays.map((record) => (
            <tr key={record.date} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2.5 text-gray-900 whitespace-nowrap">{record.date}</td>
              <td className="px-3 py-2.5 text-gray-500">{LAO_DAY_SHORT[record.dayOfWeek]}</td>
              <td className="px-3 py-2.5 text-gray-700">{record.checkIn?.time ?? '-'}</td>
              <td className="px-3 py-2.5 text-gray-700">{record.checkOut?.time ?? '-'}</td>
              <td className="px-3 py-2.5">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    DAY_STATUS_BADGE[record.dayStatus]
                  }`}
                >
                  {DAY_STATUS_LABEL[record.dayStatus]}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right text-gray-600">
                {(record.checkIn?.lateMinutes ?? 0) > 0 ? record.checkIn?.lateMinutes : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---- Legend ------------------------------------------------------------------

function ChartLegend() {
  const items: { status: DayStatus; label: string }[] = [
    { status: 'PRESENT', label: 'ຕ່ອງເວລາ' },
    { status: 'LATE', label: 'ຊ້າ' },
    { status: 'ABSENT', label: 'ຂາດ' },
    { status: 'EARLY_LEAVE', label: 'ອອກກ່ອນ' },
    { status: 'WEEKEND', label: 'ວັນຫຍຸດ' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div key={item.status} className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: DAY_STATUS_COLOR[item.status] }}
          />
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ---- Main component ----------------------------------------------------------

export function EmployeeAttendanceReport({ employeeId }: { employeeId: string }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const { data, isLoading, isError } = useEmployeeMonthlyAttendanceQuery(employeeId, year, month)

  const canGoNext =
    year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)

  function handlePrev() {
    if (month === 1) {
      setYear((y) => y - 1)
      setMonth(12)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function handleNext() {
    if (!canGoNext) return
    if (month === 12) {
      setYear((y) => y + 1)
      setMonth(1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">ການເຂົ້າ-ອອກວຽກ</h2>
        <MonthSelector
          year={year}
          month={month}
          onPrev={handlePrev}
          onNext={handleNext}
          canGoNext={canGoNext}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່
        </div>
      )}

      {data && (
        <>
          {/* Summary */}
          <SummaryCards
            presentDays={data.summary.presentDays}
            lateDays={data.summary.lateDays}
            absentDays={data.summary.absentDays}
            earlyLeaveDays={data.summary.earlyLeaveDays}
            onTimeRate={data.summary.onTimeRate}
          />

          {/* Chart */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">ກາຟລາຍວັນ</p>
              <ChartLegend />
            </div>
            <AttendanceBarChart records={data.dailyRecords} />
          </Card>

          {/* Table */}
          <Card padding={false}>
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">ລາຍລະອຽດລາຍວັນ</p>
            </div>
            <DailyRecordsTable records={data.dailyRecords} />
          </Card>
        </>
      )}
    </div>
  )
}

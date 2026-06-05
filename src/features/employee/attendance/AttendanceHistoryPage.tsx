import { useState } from 'react'
import { useMyAttendanceHistoryQuery } from '../../../hooks/queries/useMyAttendanceHistoryQuery'

// แปลง ISO datetime → HH:mm เวลา Bangkok (UTC+7)
function toLocalTime(iso: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  const offset = 7 * 60
  const totalMin = d.getUTCHours() * 60 + d.getUTCMinutes() + offset
  const hh = Math.floor((totalMin % (24 * 60)) / 60)
  const mm = totalMin % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

// แปลง "YYYY-MM-DD" → "DD/MM/YYYY" โดยไม่ผ่าน Date object (ป้องกัน timezone shift)
function formatDay(date: string): string {
  if (!date) return '-'
  const [yyyy, mm, dd] = date.split('-')
  if (!yyyy || !mm || !dd) return date
  return `${dd}/${mm}/${yyyy}`
}

function formatWorkDuration(minutes: number | null): string {
  if (!minutes) return '-'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const STATUS_COLORS: Record<string, string> = {
  NORMAL: 'bg-green-500',
  PRESENT: 'bg-green-500',
  LATE_MINOR: 'bg-yellow-400',
  LATE: 'bg-red-500',
  ABSENT: 'bg-red-500',
  HALF_DAY: 'bg-blue-500',
  EARLY_LEAVE: 'bg-orange-400',
  MISSING_CHECKOUT: 'bg-gray-400',
}

const STATUS_LABELS: Record<string, string> = {
  NORMAL: 'ມາວຽກ',
  PRESENT: 'ມາວຽກ',
  LATE_MINOR: 'ຊ້າໜ້ອຍ',
  LATE: 'ຊ້າ',
  ABSENT: 'ຂາດ',
  HALF_DAY: 'ເຄິ່ງວັນ',
  EARLY_LEAVE: 'ກັບກ່ອນ',
  MISSING_CHECKOUT: 'ບໍ່ checkout',
}

const LIMIT = 20

export default function AttendanceHistoryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMyAttendanceHistoryQuery({ page, limit: LIMIT })

  const records = data?.data ?? []
  const total = data?.meta?.total ?? 0
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-gray-800 mb-4">ປະຫວັດການເຂົ້າວຽກ</h1>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r.date} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_COLORS[r.status] ?? 'bg-gray-300'}`} />
              <span className="text-xs text-gray-500 w-20 shrink-0">{formatDay(r.date)}</span>
              <div className="flex-1 flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">{STATUS_LABELS[r.status] ?? r.status}</span>
                {r.lateMinutes > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      r.status === 'LATE' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    +{r.lateMinutes}ນ
                  </span>
                )}
                <span
                  className={`text-xs px-1 py-0.5 rounded ${
                    r.isInsideGeofence ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}
                  title={`${r.distanceFromBranch}m from branch`}
                >
                  {r.isInsideGeofence ? '📍' : '⚠️'}
                </span>
              </div>
              <span className="text-xs text-gray-500">{toLocalTime(r.checkIn)}</span>
              <span className="text-xs text-gray-400">→</span>
              <span className="text-xs text-gray-500">{toLocalTime(r.checkOut)}</span>
              <span className="text-xs text-gray-400 w-14 text-right">{formatWorkDuration(r.workDuration)}</span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-[#0D2B6B] disabled:text-gray-300 font-medium"
          >
            ← ກ່ອນ
          </button>
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm text-[#0D2B6B] disabled:text-gray-300 font-medium"
          >
            ຕໍ່ →
          </button>
        </div>
      )}
    </div>
  )
}

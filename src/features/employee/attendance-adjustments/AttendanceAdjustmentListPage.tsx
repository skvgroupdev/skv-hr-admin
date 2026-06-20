import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMyAdjustmentsQuery, useCancelAdjustmentMutation } from '../../../hooks/useAttendanceAdjustments'
import { AttendanceAdjustmentCreateModal } from './AttendanceAdjustmentCreateModal'
import { RequestStatusBadge } from '../requests/RequestStatusBadge'
import { formatDateOnly } from '../../../utils/date'
import type { AttendanceAdjustment } from '../../../types/attendance-adjustment'

const TYPE_LABELS: Record<string, string> = {
  CHECK_IN: 'ເວລາເຂົ້າ',
  CHECK_OUT: 'ເວລາອອກ',
}

function formatHHMM(iso: string): string {
  return new Date(iso).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })
}

function AdjustmentCard({ item, onCancel, isCancelling }: {
  item: AttendanceAdjustment
  onCancel: (id: string) => void
  isCancelling: boolean
}) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-800">{TYPE_LABELS[item.type] ?? item.type}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDateOnly(item.workDate)} &nbsp;•&nbsp; {formatHHMM(item.requestedCheckTime)}
          </p>
        </div>
        <RequestStatusBadge status={item.status} />
      </div>

      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{item.reason}</p>

      {item.reviewComment && (
        <p className="text-xs text-gray-500 mt-1 italic">ຄຳເຫັນ: {item.reviewComment}</p>
      )}

      {item.status === 'PENDING' && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => onCancel(item.id)}
            disabled={isCancelling}
            className="text-xs text-red-500 border border-red-300 rounded-lg px-3 py-1 active:scale-95 transition-transform disabled:opacity-50"
          >
            ຍົກເລີກ
          </button>
        </div>
      )}
    </div>
  )
}

export default function AttendanceAdjustmentListPage() {
  const [showModal, setShowModal] = useState(false)
  const { data = [], isLoading } = useMyAdjustmentsQuery()
  const cancelMutation = useCancelAdjustmentMutation()

  return (
    <div className="pb-24">
      <div className="bg-[#0D2B6B] text-white px-5 pt-4 pb-4">
        <p className="text-lg font-bold">ຄຳຂໍແກ້ເວລາ</p>
      </div>

      <div className="px-4 pt-4 space-y-2">
        {isLoading && (
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
            ກຳລັງໂຫຼດ...
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">ຍັງບໍ່ມີຄຳຂໍແກ້ເວລາ</p>
        )}

        {data.map((item) => (
          <AdjustmentCard
            key={item.id}
            item={item}
            onCancel={(id) => cancelMutation.mutate(id)}
            isCancelling={cancelMutation.isPending}
          />
        ))}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-[#0D2B6B] text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        aria-label="ສ້າງຄຳຂໍແກ້ເວລາ"
      >
        <Plus className="h-5 w-5" />
      </button>

      {showModal && <AttendanceAdjustmentCreateModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

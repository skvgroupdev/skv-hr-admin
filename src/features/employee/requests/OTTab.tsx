import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMyOTRequestsQuery } from '../../../hooks/queries/useMyOTRequestsQuery'
import { useCancelOTMutation } from '../../../hooks/mutations/useCancelOTMutation'
import { RequestStatusBadge } from './RequestStatusBadge'
import { formatDateOnly } from '../../../utils/date'
import { useNotificationSocketContext } from '../../../context/NotificationSocketContext'
import { toast } from '../../../components/ui/Toast'

interface OTItem {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  reason?: string
}

function formatHHMM(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function OTTab() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { lastOTUpdate } = useNotificationSocketContext()
  const prevOTUpdate = useRef(lastOTUpdate)

  const { data, isLoading } = useMyOTRequestsQuery({ page: 1, limit: 20 })
  const cancelMutation = useCancelOTMutation()
  const items: OTItem[] = (data?.data as OTItem[]) ?? []

  useEffect(() => {
    if (!lastOTUpdate || lastOTUpdate === prevOTUpdate.current) return
    prevOTUpdate.current = lastOTUpdate
    void queryClient.invalidateQueries({ queryKey: ['ot', 'my'] })
    if (lastOTUpdate.status === 'APPROVED') {
      toast.success('ຄຳຮ້ອງ OT ໄດ້ຮັບການອະນຸມັດ')
    } else {
      toast.error('ຄຳຮ້ອງ OT ຖືກປະຕິເສດ')
    }
  }, [lastOTUpdate, queryClient])

  return (
    <div className="pb-20">
      {isLoading && <div className="h-40 flex items-center justify-center text-gray-400 text-sm">ກຳລັງໂຫລດ...</div>}
      {!isLoading && items.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">ບໍ່ມີຄຳຮ້ອງ OT</p>
      )}
      <div className="space-y-2 px-4 pt-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-800">OT</p>
              <RequestStatusBadge status={item.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDateOnly(item.date)}&nbsp;&nbsp;•&nbsp;&nbsp;{formatHHMM(item.startTime)} – {formatHHMM(item.endTime)}
            </p>
            {item.reason && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.reason}</p>
            )}
            {item.status === 'PENDING' && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => cancelMutation.mutate(item.id)}
                  disabled={cancelMutation.isPending}
                  className="text-xs text-red-500 border border-red-300 rounded-lg px-3 py-1 active:scale-95 transition-transform disabled:opacity-50"
                >
                  ຍົກເລີກ
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/employee/requests/ot')}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-[#0D2B6B] text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        aria-label="ສ້າງຄຳຮ້ອງ OT"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

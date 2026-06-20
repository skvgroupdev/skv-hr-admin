import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMyLeaveRequestsQuery } from '../../../hooks/queries/useMyLeaveRequestsQuery'
import { useMyLeaveBalanceQuery } from '../../../hooks/queries/useMyLeaveBalanceQuery'
import { useCancelLeaveMutation } from '../../../hooks/mutations/useCancelLeaveMutation'
import { RequestStatusBadge } from './RequestStatusBadge'
import { formatDateOnly } from '../../../utils/date'
import { toast } from '../../../components/ui/Toast'
import { useNotificationSocketContext } from '../../../context/NotificationSocketContext'

interface LeaveItem {
  id: string
  leaveTypeName: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: string
}

function LeaveBalanceSection() {
  const { data: balances, isLoading } = useMyLeaveBalanceQuery()

  if (isLoading) return <div className="h-10 mx-4 mt-3 rounded-xl bg-gray-100 animate-pulse" />
  if (!balances?.length) return null

  return (
    <div className="mx-4 mt-3 mb-1 bg-blue-50 rounded-xl px-4 py-3 space-y-1">
      {balances.map((b) => (
        <div key={b.leaveTypeId} className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{b.leaveTypeName}</span>
          <span className="text-xs font-medium text-[#0D2B6B]">
            {b.remaining}/{b.total} ວັນ
          </span>
        </div>
      ))}
    </div>
  )
}

export function LeaveTab() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading } = useMyLeaveRequestsQuery({ page: 1, limit: 20 })
  const cancelMutation = useCancelLeaveMutation()
  const items: LeaveItem[] = (data?.data as LeaveItem[]) ?? []

  const { lastLeaveUpdate } = useNotificationSocketContext()
  const prevLeaveUpdateRef = useRef(lastLeaveUpdate)

  useEffect(() => {
    if (lastLeaveUpdate && lastLeaveUpdate !== prevLeaveUpdateRef.current) {
      prevLeaveUpdateRef.current = lastLeaveUpdate

      queryClient.invalidateQueries({ queryKey: ['leave', 'my'] })
      queryClient.invalidateQueries({ queryKey: ['leave', 'balance'] })

      if (lastLeaveUpdate.status === 'APPROVED') {
        toast.success('ຄຳຮ້ອງລາພັກໄດ້ຮັບການອນຸມັດ')
      } else {
        const reason = lastLeaveUpdate.reason ? `: ${lastLeaveUpdate.reason}` : ''
        toast.error(`ຄຳຮ້ອງລາພັກຖືກປະຕິເສດ${reason}`)
      }
    }
  }, [lastLeaveUpdate, queryClient])

  return (
    <div className="pb-20">
      <LeaveBalanceSection />

      {isLoading && <div className="h-40 flex items-center justify-center text-gray-400 text-sm">ກຳລັງໂຫລດ...</div>}
      {!isLoading && items.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">ບໍ່ມີຄຳຮ້ອງລາພັກ</p>
      )}

      <div className="space-y-2 px-4 pt-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-800">{item.leaveTypeName}</p>
              <RequestStatusBadge status={item.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDateOnly(item.startDate)} – {formatDateOnly(item.endDate)}
              {item.totalDays != null && (
                <span className="ml-1 text-gray-400">({item.totalDays} ວັນ)</span>
              )}
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
        onClick={() => navigate('/employee/requests/leave')}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-[#0D2B6B] text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        aria-label="ສ້າງຄຳຮ້ອງລາພັກ"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

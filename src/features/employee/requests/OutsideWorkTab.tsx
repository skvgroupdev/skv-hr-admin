import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useMyOutsideWorkRequestsQuery } from '../../../hooks/queries/useMyOutsideWorkRequestsQuery'
import { RequestStatusBadge } from './RequestStatusBadge'
import { formatDateOnly } from '../../../utils/date'

interface OutsideWorkItem {
  id: string
  outsideType: string
  locationName?: string
  reason: string
  status: string
  createdAt: string
}

const TYPE_LABELS: Record<string, string> = {
  OUTSIDE_WORK: 'ວຽກນອກ',
  CUSTOMER_VISIT: 'ໄປຫາລູກຄ້າ',
  DELIVERY: 'ສົ່ງຂອງ',
  WORK_FROM_HOME: 'ເຮັດວຽກທາງໄກ',
  BUSINESS_TRIP: 'ເດີນທາງທຸລະກິດ',
  EMERGENCY: 'ເຫດສຸກເສີນ',
  OTHER: 'ອື່ນໆ',
}

export function OutsideWorkTab() {
  const navigate = useNavigate()
  const { data, isLoading } = useMyOutsideWorkRequestsQuery({ page: 1, limit: 20 })
  const items: OutsideWorkItem[] = (data?.data as OutsideWorkItem[]) ?? []

  return (
    <div className="pb-20">
      {isLoading && <div className="h-40 flex items-center justify-center text-gray-400 text-sm">ກຳລັງໂຫລດ...</div>}
      {!isLoading && items.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">ບໍ່ມີຄຳຮ້ອງອອກວຽກນອກ</p>
      )}
      <div className="space-y-2 px-4 pt-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-800">
                {TYPE_LABELS[item.outsideType] ?? item.outsideType}
              </p>
              <RequestStatusBadge status={item.status} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {item.locationName
                ? `${item.locationName}  •  ${formatDateOnly(item.createdAt)}`
                : formatDateOnly(item.createdAt)}
            </p>
            {item.reason && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.reason}</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/employee/requests/outside-work')}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full bg-[#0D2B6B] text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
        aria-label="ສ້າງຄຳຮ້ອງອອກວຽກນອກ"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

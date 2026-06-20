import { AlertTriangle, XOctagon } from 'lucide-react'
import type { SubscriptionSummary } from '../../types/auth'

const DAYS_WARNING_THRESHOLD = 7

function daysUntil(isoDate: string): number {
  const now = new Date()
  const end = new Date(isoDate)
  const diffMs = end.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

interface Props {
  subscription: SubscriptionSummary
}

export function SubscriptionBanner({ subscription }: Props) {
  const { status, endDate } = subscription

  const isExpiredOrSuspended = status === 'EXPIRED' || status === 'SUSPENDED'

  if (isExpiredOrSuspended) {
    return (
      <div className="flex items-center gap-2 bg-red-600 px-4 py-2.5 text-sm text-white">
        <XOctagon className="h-4 w-4 shrink-0" />
        <span>ແພັກເກດຂອງທ່ານໝົດອາຍຸແລ້ວ ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ</span>
      </div>
    )
  }

  if (endDate) {
    const daysLeft = daysUntil(endDate)
    if (daysLeft <= DAYS_WARNING_THRESHOLD && daysLeft >= 0) {
      return (
        <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2.5 text-sm text-yellow-900">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>ແພັກເກດຈະໝົດອາຍຸໃນ {daysLeft} ວັນ</span>
        </div>
      )
    }
  }

  return null
}

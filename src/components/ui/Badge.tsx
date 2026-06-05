import type { CompanyStatus } from '../../types/company'
import { cn } from '../../lib/cn'

interface BadgeProps {
  status: CompanyStatus
}

const statusConfig: Record<CompanyStatus, { label: string; className: string }> = {
  TRIAL: { label: 'ທົດລອງ', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ACTIVE: { label: 'ເຄື່ອນໄຫວ', className: 'bg-green-100 text-green-800 border-green-200' },
  SUSPENDED: { label: 'ລະງັບ', className: 'bg-red-100 text-red-800 border-red-200' },
  EXPIRED: { label: 'ໝົດອາຍຸ', className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export function StatusBadge({ status }: BadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}

interface RoleBadgeProps {
  role: string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-light border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
      {role}
    </span>
  )
}

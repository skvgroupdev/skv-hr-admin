interface RequestStatusBadgeProps {
  status: string
}

const BADGE_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'ລໍຖ້າ', className: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'ອະນຸມັດ', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'ປະຕິເສດ', className: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'ຍົກເລີກ', className: 'bg-gray-100 text-gray-500' },
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const config = BADGE_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

import type { PayrollPeriodStatus } from '../../../types/payroll'

const STATUS_MAP: Record<PayrollPeriodStatus, { label: string; className: string }> = {
  DRAFT: { label: 'ຮ່າງ', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  GENERATED: { label: 'ສ້າງແລ້ວ', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  HR_REVIEWED: { label: 'HR ກວດແລ້ວ', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  PAID: { label: 'ຈ່າຍແລ້ວ', className: 'bg-green-100 text-green-800 border-green-200' },
  APPROVED: { label: 'ອະນຸມັດແລ້ວ', className: 'bg-green-100 text-green-800 border-green-200' },
  LOCKED: { label: 'ລັອກແລ້ວ', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
}

interface PayrollStatusBadgeProps {
  status: PayrollPeriodStatus
}

export function PayrollStatusBadge({ status }: PayrollStatusBadgeProps) {
  const { label, className } = STATUS_MAP[status]
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

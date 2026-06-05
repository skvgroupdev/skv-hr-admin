import type { TaxMode } from '../../../types/tax-config'
import { TAX_MODE_LABELS } from '../../../types/tax-config'
import { cn } from '../../../lib/cn'

const COLOR_MAP: Record<TaxMode, string> = {
  FULL_DEDUCTION: 'bg-blue-100 text-blue-800 border-blue-200',
  TAX_ON_COMPANY: 'bg-green-100 text-green-800 border-green-200',
  SS_ONLY: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  NO_DEDUCTION: 'bg-gray-100 text-gray-600 border-gray-200',
}

interface TaxModeBadgeProps {
  mode: TaxMode
}

export function TaxModeBadge({ mode }: TaxModeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        COLOR_MAP[mode],
      )}
    >
      {TAX_MODE_LABELS[mode]}
    </span>
  )
}

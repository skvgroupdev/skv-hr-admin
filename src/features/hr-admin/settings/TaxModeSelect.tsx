import type { TaxMode } from '../../../types/tax-config'
import { TAX_MODE_LABELS } from '../../../types/tax-config'
import { cn } from '../../../lib/cn'

const TAX_MODE_DESCRIPTIONS: Record<TaxMode, string> = {
  FULL_DEDUCTION: 'ຫັກ SS ແລະ ພາສີເງິນໄດ້ ຈາກເງິນເດືອນພະນັກງານ',
  TAX_ON_COMPANY: 'ບໍລິສັດເປັນຜູ້ຮັບຜິດຊອບພາສີເງິນໄດ້ແທນພະນັກງານ',
  SS_ONLY: 'ຫັກສະເພາະ SS ບໍ່ຫັກພາສີເງິນໄດ້',
  NO_DEDUCTION: 'ບໍ່ຫັກ SS ແລະ ພາສີໃດໆ',
}

const TAX_MODES: TaxMode[] = ['FULL_DEDUCTION', 'TAX_ON_COMPANY', 'SS_ONLY', 'NO_DEDUCTION']

interface TaxModeSelectProps {
  value: TaxMode
  onChange: (mode: TaxMode) => void
}

export function TaxModeSelect({ value, onChange }: TaxModeSelectProps) {
  return (
    <div className="space-y-2">
      {TAX_MODES.map((mode) => (
        <label
          key={mode}
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
            value === mode
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300',
          )}
        >
          <input
            type="radio"
            name="taxMode"
            value={mode}
            checked={value === mode}
            onChange={() => onChange(mode)}
            className="mt-0.5 accent-primary"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{TAX_MODE_LABELS[mode]}</p>
            <p className="text-xs text-gray-500 mt-0.5">{TAX_MODE_DESCRIPTIONS[mode]}</p>
          </div>
        </label>
      ))}
    </div>
  )
}

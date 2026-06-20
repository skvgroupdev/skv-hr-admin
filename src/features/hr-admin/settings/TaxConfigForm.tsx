import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { TaxMode, UpdateCompanyTaxConfigDto } from '../../../types/tax-config'

interface TaxConfigFormProps {
  values: UpdateCompanyTaxConfigDto
  onChange: (values: UpdateCompanyTaxConfigDto) => void
  onSubmit: () => void
  isPending: boolean
}

interface ModeOption {
  mode: TaxMode
  label: string
  description: string
  tags: string[]
}

const OPTIONS: ModeOption[] = [
  {
    mode: 'FULL_DEDUCTION',
    label: 'ຫັກພາສີ',
    description: 'ຫັກທັງ ປະກັນສັງຄົມ ແລະ ພາສີເງິນໄດ້ ຈາກເງິນເດືອນ',
    tags: ['SS 5.5%', 'ພາສີເງິນໄດ້'],
  },
  {
    mode: 'SS_ONLY',
    label: 'ຫັກປະກັນສັງຄົມ',
    description: 'ຫັກສະເພາະ ປະກັນສັງຄົມ ບໍ່ຫັກພາສີເງິນໄດ້',
    tags: ['SS 5.5%'],
  },
  {
    mode: 'NO_DEDUCTION',
    label: 'ບໍ່ຫັກຫຍັງເລີຍ',
    description: 'ບໍ່ຫັກ ປະກັນສັງຄົມ ແລະ ພາສີໃດໆ ທັງໝົດ',
    tags: [],
  },
]

const PRESET: Record<TaxMode, Partial<UpdateCompanyTaxConfigDto>> = {
  FULL_DEDUCTION: { enableEmployeeSs: true, enableEmployerSs: true, enableIncomeTax: true },
  SS_ONLY:        { enableEmployeeSs: true, enableEmployerSs: true, enableIncomeTax: false },
  NO_DEDUCTION:   { enableEmployeeSs: false, enableEmployerSs: true, enableIncomeTax: false },
  TAX_ON_COMPANY: { enableEmployeeSs: true, enableEmployerSs: true, enableIncomeTax: true },
}

export function TaxConfigForm({ values, onChange, onSubmit, isPending }: TaxConfigFormProps) {
  const activeMode = (['FULL_DEDUCTION', 'SS_ONLY', 'NO_DEDUCTION'] as TaxMode[]).includes(values.taxMode)
    ? values.taxMode
    : 'FULL_DEDUCTION'

  const select = (mode: TaxMode) => onChange({ ...values, taxMode: mode, ...PRESET[mode] })

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">ເລືອກຮູບແບບການຫັກ</p>

      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            type="button"
            onClick={() => select(opt.mode)}
            className={cn(
              'w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
              activeMode === opt.mode
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300 bg-white',
            )}
          >
            <span className={cn(
              'mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center',
              activeMode === opt.mode ? 'border-primary' : 'border-gray-300',
            )}>
              {activeMode === opt.mode && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
              {opt.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {opt.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onSubmit} loading={isPending}>ບັນທຶກ</Button>
      </div>
    </div>
  )
}

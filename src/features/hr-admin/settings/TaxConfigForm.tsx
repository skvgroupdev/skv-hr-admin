import { AlertTriangle } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch'
import { TaxModeSelect } from './TaxModeSelect'
import type { TaxMode, UpdateCompanyTaxConfigDto } from '../../../types/tax-config'

interface TaxConfigFormProps {
  values: UpdateCompanyTaxConfigDto
  onChange: (values: UpdateCompanyTaxConfigDto) => void
  onSubmit: () => void
  isPending: boolean
}

export function TaxConfigForm({ values, onChange, onSubmit, isPending }: TaxConfigFormProps) {
  const setField = <K extends keyof UpdateCompanyTaxConfigDto>(key: K, val: UpdateCompanyTaxConfigDto[K]) =>
    onChange({ ...values, [key]: val })

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">ຮູບແບບການຫັກພາສີ</p>
        <TaxModeSelect value={values.taxMode} onChange={(mode: TaxMode) => setField('taxMode', mode)} />
      </div>

      {values.taxMode === 'TAX_ON_COMPANY' && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>ບໍລິສັດຈະເປັນຜູ້ອອກພາສີໃຫ້ພະນັກງານ</span>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">ການຫັກເງິນ</p>
        <div className="space-y-2">
          <ToggleSwitch
            label="ປະກັນສັງຄົມ ພະນັກງານ (SS)"
            checked={values.enableEmployeeSs}
            onChange={(v) => setField('enableEmployeeSs', v)}
          />
          <ToggleSwitch
            label="ປະກັນສັງຄົມ ນາຍຈ້າງ (SS)"
            checked={values.enableEmployerSs}
            onChange={(v) => setField('enableEmployerSs', v)}
          />
          <ToggleSwitch
            label="ພາສີເງິນໄດ້ (Income Tax)"
            checked={values.enableIncomeTax}
            onChange={(v) => setField('enableIncomeTax', v)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onSubmit} loading={isPending}>ບັນທຶກ</Button>
      </div>
    </div>
  )
}

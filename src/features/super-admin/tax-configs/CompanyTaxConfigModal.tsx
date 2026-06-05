import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch'
import { TaxModeSelect } from '../../hr-admin/settings/TaxModeSelect'
import { useUpdateCompanyTaxConfigMutation } from '../../../hooks/mutations/useTaxConfigMutations'
import { AlertTriangle } from 'lucide-react'
import type { CompanyTaxConfig, UpdateCompanyTaxConfigDto, TaxMode } from '../../../types/tax-config'

interface CompanyTaxConfigModalProps {
  open: boolean
  onClose: () => void
  config: CompanyTaxConfig | null
  companyName?: string
}

export function CompanyTaxConfigModal({ open, onClose, config, companyName }: CompanyTaxConfigModalProps) {
  const mutation = useUpdateCompanyTaxConfigMutation()
  const [values, setValues] = useState<UpdateCompanyTaxConfigDto>({
    taxMode: 'FULL_DEDUCTION',
    enableEmployeeSs: true,
    enableEmployerSs: true,
    enableIncomeTax: true,
  })

  useEffect(() => {
    if (config) {
      setValues({
        taxMode: config.taxMode,
        enableEmployeeSs: config.enableEmployeeSs,
        enableEmployerSs: config.enableEmployerSs,
        enableIncomeTax: config.enableIncomeTax,
      })
    }
  }, [config, open])

  const setField = <K extends keyof UpdateCompanyTaxConfigDto>(key: K, val: UpdateCompanyTaxConfigDto[K]) =>
    setValues((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    if (!config) return
    mutation.mutate({ tenantId: config.tenantId, dto: values }, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      title={`ແກ້ໄຂພາສີ${companyName ? ` — ${companyName}` : ''}`}
      onClose={onClose}
    >
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

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button onClick={handleSubmit} loading={mutation.isPending}>ບັນທຶກ</Button>
        </div>
      </div>
    </Modal>
  )
}

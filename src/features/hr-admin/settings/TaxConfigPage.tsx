import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { TaxConfigForm } from './TaxConfigForm'
import { useMyTaxConfigQuery } from '../../../hooks/queries/useTaxConfigsQuery'
import { useUpdateMyTaxConfigMutation } from '../../../hooks/mutations/useTaxConfigMutations'
import { TAX_MODE_LABELS } from '../../../types/tax-config'
import type { UpdateCompanyTaxConfigDto } from '../../../types/tax-config'

const DEFAULT_VALUES: UpdateCompanyTaxConfigDto = {
  taxMode: 'FULL_DEDUCTION',
  enableEmployeeSs: true,
  enableEmployerSs: true,
  enableIncomeTax: true,
}

export default function TaxConfigPage() {
  const { data, isLoading, isError } = useMyTaxConfigQuery()
  const mutation = useUpdateMyTaxConfigMutation()
  const [values, setValues] = useState<UpdateCompanyTaxConfigDto>(DEFAULT_VALUES)

  useEffect(() => {
    if (data) {
      setValues({
        taxMode: data.taxMode,
        enableEmployeeSs: data.enableEmployeeSs,
        enableEmployerSs: data.enableEmployerSs,
        enableIncomeTax: data.enableIncomeTax,
      })
    }
  }, [data])

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ການຕັ້ງຄ່າພາສີ</h1>
          {data && (
            <p className="text-sm text-gray-500 mt-0.5">
              ປະຈຸບັນ: <span className="font-medium">{TAX_MODE_LABELS[data.taxMode]}</span>
            </p>
          )}
        </div>
      </div>

      {isError && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ
        </p>
      )}

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <TaxConfigForm
            values={values}
            onChange={setValues}
            onSubmit={() => mutation.mutate(values)}
            isPending={mutation.isPending}
          />
        )}
      </Card>
    </div>
  )
}

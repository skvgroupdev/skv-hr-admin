import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { useTaxConfigsQuery } from '../../../hooks/queries/useTaxConfigsQuery'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { TaxBracketTable } from './TaxBracketTable'
import { TaxConfigFormModal } from './TaxConfigFormModal'
import type { TaxConfig } from '../../../types/tax-config'
import { formatDateOnly } from '../../../utils/date'

function TaxConfigCard({ config, onEdit }: { config: TaxConfig; onEdit: (c: TaxConfig) => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{config.country} — {config.year}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            ມີຜົນ: {formatDateOnly(config.effectiveFrom)}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => onEdit(config)}>ແກ້ໄຂ</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="rounded-lg bg-blue-50 p-2.5">
          <p className="text-xs text-blue-600 mb-0.5">ປະກັນສັງຄົມ ພະນັກງານ</p>
          <p className="font-semibold text-blue-900">{(config.employeeSsRate * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-2.5">
          <p className="text-xs text-purple-600 mb-0.5">ປະກັນສັງຄົມ ນາຍຈ້າງ</p>
          <p className="font-semibold text-purple-900">{(config.employerSsRate * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 overflow-hidden">
        <TaxBracketTable brackets={config.brackets} />
      </div>
    </Card>
  )
}

export default function TaxConfigListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<TaxConfig | undefined>()
  const { data: configs, isLoading, isError } = useTaxConfigsQuery()

  const handleEdit = (config: TaxConfig) => {
    setEditingConfig(config)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingConfig(undefined)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ອັດຕາພາສີ</h1>
          <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {configs?.length ?? 0} ລາພັກຍການ</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          ສ້າງອັດຕາພາສີ
        </Button>
      </div>

      {isError && (
        <p className="text-sm text-red-600 text-center py-8">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : configs?.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="ຍັງບໍ່ມີອັດຕາພາສີ"
          description="ກົດ '+ ສ້າງອັດຕາພາສີ' ເພື່ອເພີ່ມຂໍ້ມູນ"
          action={
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              ສ້າງອັດຕາພາສີ
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {configs?.map((config) => (
            <TaxConfigCard key={config.id} config={config} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <TaxConfigFormModal open={modalOpen} onClose={() => setModalOpen(false)} taxConfig={editingConfig} />
    </div>
  )
}

import { useState } from 'react'
import { Pencil, ShieldCheck } from 'lucide-react'
import { useAllTaxConfigsQuery } from '../../../hooks/queries/useTaxConfigsQuery'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { TaxModeBadge } from './TaxModeBadge'
import { CompanyTaxConfigModal } from './CompanyTaxConfigModal'
import type { CompanyTaxConfig } from '../../../types/tax-config'
import { formatDateOnly } from '../../../utils/date'

const HEADERS = ['ບໍລິສັດ (Tenant)', 'ຮູບແບບພາສີ', 'SS ພນ.', 'SS ນຈ.', 'ພາສີ', 'ແກ້ໄຂລ່າສຸດ', 'ຈັດການ']

function BoolIcon({ value }: { value: boolean }) {
  return <span className={value ? 'text-green-600' : 'text-gray-400'}>{value ? '✓' : '—'}</span>
}

function ConfigRow({ config, onEdit }: { config: CompanyTaxConfig; onEdit: () => void }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-mono text-gray-700">{config.tenantId}</td>
      <td className="px-4 py-3"><TaxModeBadge mode={config.taxMode} /></td>
      <td className="px-4 py-3 text-center"><BoolIcon value={config.enableEmployeeSs} /></td>
      <td className="px-4 py-3 text-center"><BoolIcon value={config.enableEmployerSs} /></td>
      <td className="px-4 py-3 text-center"><BoolIcon value={config.enableIncomeTax} /></td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDateOnly(config.updatedAt)}</td>
      <td className="px-4 py-3">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="h-3 w-3" />
          ແກ້ໄຂ
        </Button>
      </td>
    </tr>
  )
}

export default function CompanyTaxConfigListPage() {
  const { data: configs, isLoading, isError } = useAllTaxConfigsQuery()
  const [editingConfig, setEditingConfig] = useState<CompanyTaxConfig | null>(null)

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">ການຕັ້ງຄ່າພາສີ ຕໍ່ບໍລິສັດ</h1>
        <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {configs?.length ?? 0} ບໍລິສັດ</p>
      </div>

      {isError && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ
        </p>
      )}

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                {HEADERS.map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {HEADERS.map((h) => (
                      <td key={h} className="px-4 py-3">
                        <div className="h-4 rounded bg-gray-200 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : configs?.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length}>
                    <EmptyState
                      icon={ShieldCheck}
                      title="ຍັງບໍ່ມີຂໍ້ມູນ"
                      description="ຂໍ້ມູນການຕັ້ງຄ່າພາສີຈະປາກົດທີ່ນີ້"
                    />
                  </td>
                </tr>
              ) : (
                configs?.map((config) => (
                  <ConfigRow
                    key={config.id}
                    config={config}
                    onEdit={() => setEditingConfig(config)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CompanyTaxConfigModal
        open={editingConfig !== null}
        onClose={() => setEditingConfig(null)}
        config={editingConfig}
      />
    </div>
  )
}

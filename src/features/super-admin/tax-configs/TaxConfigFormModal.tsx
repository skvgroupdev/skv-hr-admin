import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import {
  useCreateTaxConfigMutation,
  useUpdateTaxConfigMutation,
} from '../../../hooks/mutations/useTaxConfigMutations'
import type { TaxConfig, TaxBracket } from '../../../types/tax-config'

interface TaxConfigFormModalProps {
  open: boolean
  onClose: () => void
  taxConfig?: TaxConfig
}

const defaultBracket = (): TaxBracket => ({ from: 0, to: null, rate: 0 })

export function TaxConfigFormModal({ open, onClose, taxConfig }: TaxConfigFormModalProps) {
  const isEdit = !!taxConfig
  const createMutation = useCreateTaxConfigMutation()
  const updateMutation = useUpdateTaxConfigMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const [year, setYear] = useState('')
  const [employeeSsRate, setEmployeeSsRate] = useState('5.5')
  const [employerSsRate, setEmployerSsRate] = useState('6')
  const [effectiveFrom, setEffectiveFrom] = useState('')
  const [brackets, setBrackets] = useState<TaxBracket[]>([defaultBracket()])

  useEffect(() => {
    if (taxConfig) {
      setYear(String(taxConfig.year))
      setEmployeeSsRate(String(taxConfig.employeeSsRate * 100))
      setEmployerSsRate(String(taxConfig.employerSsRate * 100))
      setEffectiveFrom(taxConfig.effectiveFrom.slice(0, 10))
      setBrackets(taxConfig.brackets)
    } else {
      setYear('')
      setEmployeeSsRate('5.5')
      setEmployerSsRate('6')
      setEffectiveFrom('')
      setBrackets([defaultBracket()])
    }
  }, [taxConfig, open])

  const updateBracket = (index: number, field: keyof TaxBracket, value: string) => {
    setBrackets((prev) =>
      prev.map((b, i) =>
        i === index
          ? { ...b, [field]: field === 'to' && value === '' ? null : parseFloat(value) || 0 }
          : b,
      ),
    )
  }

  const removeBracket = (index: number) => {
    setBrackets((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      year: parseInt(year),
      employeeSsRate: parseFloat(employeeSsRate) / 100,
      employerSsRate: parseFloat(employerSsRate) / 100,
      effectiveFrom,
      brackets,
    }
    if (isEdit) {
      updateMutation.mutate({ id: taxConfig!.id, body }, { onSuccess: onClose })
    } else {
      createMutation.mutate(body, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'ແກ້ໄຂອັດຕາພາສີ' : 'ສ້າງອັດຕາພາສີໃໝ່'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="ປີ" type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
          <Input label="ວັນທີເລີ່ມ" type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="ອັດຕາປະກັນສັງຄົມ ພະນັກງານ (%)" type="number" step="0.1" value={employeeSsRate} onChange={(e) => setEmployeeSsRate(e.target.value)} required />
          <Input label="ອັດຕາປະກັນສັງຄົມ ນາຍຈ້າງ (%)" type="number" step="0.1" value={employerSsRate} onChange={(e) => setEmployerSsRate(e.target.value)} required />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">ຂັ້ນພາສີ</p>
            <Button type="button" size="sm" variant="outline" onClick={() => setBrackets((p) => [...p, defaultBracket()])}>
              <Plus className="h-3 w-3" /> ເພີ່ມ
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brackets.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input type="number" placeholder="ຈາກ" value={b.from} onChange={(e) => updateBracket(i, 'from', e.target.value)} />
                <Input type="number" placeholder="ຮອດ (ຫວ່າງ=∞)" value={b.to ?? ''} onChange={(e) => updateBracket(i, 'to', e.target.value)} />
                <Input type="number" step="0.01" placeholder="ອັດຕາ" value={b.rate} onChange={(e) => updateBracket(i, 'rate', e.target.value)} />
                <button type="button" className="text-red-500 hover:text-red-700 shrink-0" onClick={() => removeBracket(i)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button type="submit" loading={isPending}>{isEdit ? 'ບັນທຶກ' : 'ສ້າງ'}</Button>
        </div>
      </form>
    </Modal>
  )
}

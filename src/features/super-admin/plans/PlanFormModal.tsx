import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreatePlanMutation, useUpdatePlanMutation } from '../../../hooks/mutations/usePlanMutations'
import type { Plan, PlanFeatures } from '../../../types/plan'

interface PlanFormModalProps {
  open: boolean
  onClose: () => void
  plan?: Plan
}

const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
  attendance: 'ການເຂົ້າວຽກ',
  leave: 'ການລາພັກພັກ',
  ot: 'OT',
  payroll: 'ເງິນເດືອນ',
  advancedReport: 'ລາພັກຍງານຂັ້ນສູງ',
  announcement: 'ປະກາດ',
}

const defaultFeatures = (): PlanFeatures => ({
  attendance: true,
  leave: true,
  ot: true,
  payroll: false,
  advancedReport: false,
  announcement: true,
})

export function PlanFormModal({ open, onClose, plan }: PlanFormModalProps) {
  const isEdit = !!plan
  const createMutation = useCreatePlanMutation()
  const updateMutation = useUpdatePlanMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [maxEmployees, setMaxEmployees] = useState('50')
  const [maxBranches, setMaxBranches] = useState('3')
  const [maxStorageGB, setMaxStorageGB] = useState('5')
  const [trialDays, setTrialDays] = useState('30')
  const [features, setFeatures] = useState<PlanFeatures>(defaultFeatures())

  useEffect(() => {
    if (plan) {
      setName(plan.name)
      setDescription(plan.description ?? '')
      setPrice(String(plan.price))
      setMaxEmployees(String(plan.maxEmployees))
      setMaxBranches(String(plan.maxBranches))
      setMaxStorageGB(String(plan.maxStorageGB))
      setTrialDays(String(plan.trialDays))
      setFeatures(plan.features)
    } else {
      setName('')
      setDescription('')
      setPrice('0')
      setMaxEmployees('50')
      setMaxBranches('3')
      setMaxStorageGB('5')
      setTrialDays('30')
      setFeatures(defaultFeatures())
    }
  }, [plan, open])

  const toggleFeature = (key: keyof PlanFeatures) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      name,
      description: description || undefined,
      price: parseFloat(price),
      maxEmployees: parseInt(maxEmployees),
      maxBranches: parseInt(maxBranches),
      maxStorageGB: parseInt(maxStorageGB),
      trialDays: parseInt(trialDays),
      features,
    }
    if (isEdit) {
      updateMutation.mutate({ id: plan!.id, body }, { onSuccess: onClose })
    } else {
      createMutation.mutate(body, { onSuccess: onClose })
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂແພັກ' : 'ສ້າງແພັກໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="ຊື່ແພັກ" value={name} onChange={(e) => setName(e.target.value)} required />
        <div>
          <label className="text-sm font-medium text-gray-700">ຄຳອະທິບາຍ</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="ລາພັກຄາ (LAK)" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <Input label="ທົດລອງ (ວັນ)" type="number" min="0" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} required />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="ພະນັກງານ (ສູງສຸດ)" type="number" min="1" value={maxEmployees} onChange={(e) => setMaxEmployees(e.target.value)} required />
          <Input label="ສາຂາ (ສູງສຸດ)" type="number" min="1" value={maxBranches} onChange={(e) => setMaxBranches(e.target.value)} required />
          <Input label="Storage (GB)" type="number" min="1" value={maxStorageGB} onChange={(e) => setMaxStorageGB(e.target.value)} required />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">ຟີເຈີ</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(FEATURE_LABELS) as Array<keyof PlanFeatures>).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features[key]}
                  onChange={() => toggleFeature(key)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{FEATURE_LABELS[key]}</span>
              </label>
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

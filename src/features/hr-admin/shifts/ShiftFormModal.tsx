import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreateShiftMutation, useUpdateShiftMutation } from '../../../hooks/mutations/useShiftMutations'
import type { Shift } from '../../../types/shift'
import { cn } from '../../../lib/cn'

const DAY_LABELS = [
  { value: 1, label: 'ຈ' },
  { value: 2, label: 'ອ' },
  { value: 3, label: 'ພ' },
  { value: 4, label: 'ພຫ' },
  { value: 5, label: 'ສ' },
  { value: 6, label: 'ເສ' },
  { value: 0, label: 'ອທ' },
]

interface ShiftFormModalProps {
  open: boolean
  onClose: () => void
  shift?: Shift
}

interface FormState {
  name: string
  startTime: string
  endTime: string
  breakStartTime: string
  breakEndTime: string
  gracePeriodMinutes: string
  isOvernight: boolean
  isActive: boolean
  workDays: number[]
}

function getInitialForm(shift?: Shift): FormState {
  return {
    name: shift?.name ?? '',
    startTime: shift?.startTime ?? '',
    endTime: shift?.endTime ?? '',
    breakStartTime: shift?.breakStartTime ?? '',
    breakEndTime: shift?.breakEndTime ?? '',
    gracePeriodMinutes: shift?.gracePeriodMinutes?.toString() ?? '15',
    isOvernight: shift?.isOvernight ?? false,
    isActive: shift?.isActive ?? true,
    workDays: shift?.workDays ?? [1, 2, 3, 4, 5],
  }
}

export function ShiftFormModal({ open, onClose, shift }: ShiftFormModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(shift))
  const [error, setError] = useState('')

  const createMutation = useCreateShiftMutation()
  const updateMutation = useUpdateShiftMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending
  const isEdit = !!shift

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(shift))
      setError('')
    }
  }, [open, shift])

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  const toggleDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day].sort((a, b) => a - b),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('ກະລຸນາໃສ່ຊື່ໂມງເຂົ້າວຽກ')
      return
    }
    try {
      const body = {
        name: form.name.trim(),
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        breakStartTime: form.breakStartTime || undefined,
        breakEndTime: form.breakEndTime || undefined,
        gracePeriodMinutes: Number(form.gracePeriodMinutes) || 15,
        isOvernight: form.isOvernight,
        isActive: form.isActive,
        workDays: form.workDays,
      }
      if (isEdit) {
        await updateMutation.mutateAsync({ id: shift.id, body })
      } else {
        await createMutation.mutateAsync(body)
      }
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂໂມງເຂົ້າວຽກ' : 'ສ້າງໂມງເຂົ້າວຽກໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="ຊື່ກະ *" value={form.name} onChange={setField('name')} placeholder="ກະເຊົ້າ" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="ເວລາພັກເລີ່ມ" type="time" value={form.startTime} onChange={setField('startTime')} />
          <Input label="ເວລາພັກສິ້ນສຸດ" type="time" value={form.endTime} onChange={setField('endTime')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="ພັກເຊົາ (ເລີ່ມ)" type="time" value={form.breakStartTime} onChange={setField('breakStartTime')} />
          <Input label="ພັກເຊົາ (ສິ້ນສຸດ)" type="time" value={form.breakEndTime} onChange={setField('breakEndTime')} />
        </div>
        <Input
          label="ເວລາພັກຜ່ອນຜັນ (ນາທີ)"
          type="number"
          value={form.gracePeriodMinutes}
          onChange={setField('gracePeriodMinutes')}
          placeholder="15"
        />
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">ວັນທຳງານ</p>
          <div className="flex gap-1.5">
            {DAY_LABELS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleDay(value)}
                className={cn(
                  'w-9 h-9 rounded-lg text-xs font-medium border transition-colors',
                  form.workDays.includes(value)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isOvernight} onChange={setField('isOvernight')} className="rounded" />
            ກະຂ້າມຄືນ
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={setField('isActive')} className="rounded" />
            ເປີດໃຊ້ງານ
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button type="submit" loading={isLoading}>{isEdit ? 'ບັນທຶກ' : 'ສ້າງກະ'}</Button>
        </div>
      </form>
    </Modal>
  )
}

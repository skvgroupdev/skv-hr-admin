import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreateHolidayMutation, useUpdateHolidayMutation } from '../../../hooks/mutations/useHolidayMutations'
import type { Holiday } from '../../../types/holiday'

interface HolidayFormModalProps {
  open: boolean
  onClose: () => void
  holiday?: Holiday
}

interface FormState {
  name: string
  date: string
  type: 'PUBLIC' | 'COMPANY'
  isActive: boolean
}

function getInitialForm(holiday?: Holiday): FormState {
  return {
    name: holiday?.name ?? '',
    date: holiday?.date ? holiday.date.substring(0, 10) : '',
    type: holiday?.type ?? 'PUBLIC',
    isActive: holiday?.isActive ?? true,
  }
}

export function HolidayFormModal({ open, onClose, holiday }: HolidayFormModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(holiday))
  const [error, setError] = useState('')

  const createMutation = useCreateHolidayMutation()
  const updateMutation = useUpdateHolidayMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending
  const isEdit = !!holiday

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(holiday))
      setError('')
    }
  }, [open, holiday])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.date) {
      setError('ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບ')
      return
    }
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: holiday.id, body: form })
      } else {
        await createMutation.mutateAsync(form)
      }
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂວັນຫຍຸດ' : 'ເພີ່ມວັນຫຍຸດໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ຊື່ວັນຫຍຸດ *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="ວັນຊາດ"
        />
        <Input
          label="ວັນທີ *"
          type="date"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ປະເພດ</label>
          <select
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as 'PUBLIC' | 'COMPANY' }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="PUBLIC">ວັນຫຍຸດລັດ</option>
            <option value="COMPANY">ວັນຫຍຸດບໍລິສັດ</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            className="rounded"
          />
          ເປີດໃຊ້ງານ
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button type="submit" loading={isLoading}>{isEdit ? 'ບັນທຶກ' : 'ເພີ່ມວັນຫຍຸດ'}</Button>
        </div>
      </form>
    </Modal>
  )
}

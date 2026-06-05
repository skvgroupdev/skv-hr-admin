import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import {
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
} from '../../../hooks/mutations/useLeaveTypeMutations'
import type { LeaveType } from '../../../types/leave'

interface LeaveTypeFormModalProps {
  open: boolean
  onClose: () => void
  leaveType?: LeaveType
}

interface FormState {
  name: string
  code: string
  defaultDaysPerYear: string
  isPaid: boolean
  requireAttachment: boolean
  isActive: boolean
}

function getInitialForm(leaveType?: LeaveType): FormState {
  return {
    name: leaveType?.name ?? '',
    code: leaveType?.code ?? '',
    defaultDaysPerYear: leaveType?.defaultDaysPerYear?.toString() ?? '0',
    isPaid: leaveType?.isPaid ?? true,
    requireAttachment: leaveType?.requireAttachment ?? false,
    isActive: leaveType?.isActive ?? true,
  }
}

export function LeaveTypeFormModal({ open, onClose, leaveType }: LeaveTypeFormModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(leaveType))
  const [error, setError] = useState('')

  const createMutation = useCreateLeaveTypeMutation()
  const updateMutation = useUpdateLeaveTypeMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending
  const isEdit = !!leaveType

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(leaveType))
      setError('')
    }
  }, [open, leaveType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.code.trim()) {
      setError('ກະລຸນາໃສ່ຊື່ ແລະ ລະຫັດ')
      return
    }
    try {
      const body = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        defaultDaysPerYear: Number(form.defaultDaysPerYear) || 0,
        isPaid: form.isPaid,
        requireAttachment: form.requireAttachment,
        isActive: form.isActive,
      }
      if (isEdit) {
        await updateMutation.mutateAsync({ id: leaveType.id, body })
      } else {
        await createMutation.mutateAsync(body)
      }
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂປະເພດລາພັກ' : 'ສ້າງປະເພດລາພັກໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ຊື່ປະເພດລາພັກ *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="ລາພັກປ່ວຍ"
        />
        <Input
          label="ລະຫັດ *"
          value={form.code}
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          placeholder="SICK"
        />
        <Input
          label="ຈຳນວນວັນ/ປີ"
          type="number"
          value={form.defaultDaysPerYear}
          onChange={(e) => setForm((p) => ({ ...p, defaultDaysPerYear: e.target.value }))}
          placeholder="0"
        />
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPaid}
              onChange={(e) => setForm((p) => ({ ...p, isPaid: e.target.checked }))}
              className="rounded"
            />
            ລາພັກໄດ້ຮັບເງິນ
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.requireAttachment}
              onChange={(e) => setForm((p) => ({ ...p, requireAttachment: e.target.checked }))}
              className="rounded"
            />
            ຕ້ອງການເອກະສານ
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="rounded"
            />
            ເປີດໃຊ້ງານ
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button type="submit" loading={isLoading}>{isEdit ? 'ບັນທຶກ' : 'ສ້າງ'}</Button>
        </div>
      </form>
    </Modal>
  )
}

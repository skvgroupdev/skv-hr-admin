import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreateDepartmentMutation } from '../../../hooks/mutations/useCreateDepartmentMutation'
import { useUpdateDepartmentMutation } from '../../../hooks/mutations/useUpdateDepartmentMutation'
import type { Department } from '../../../types/department'

interface DepartmentFormModalProps {
  open: boolean
  onClose: () => void
  department?: Department
}

interface FormState {
  name: string
  description: string
}

function getInitialForm(department?: Department): FormState {
  return {
    name: department?.name ?? '',
    description: department?.description ?? '',
  }
}

export function DepartmentFormModal({ open, onClose, department }: DepartmentFormModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(department))
  const [error, setError] = useState('')

  const createMutation = useCreateDepartmentMutation()
  const updateMutation = useUpdateDepartmentMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending
  const isEdit = !!department

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(department))
      setError('')
    }
  }, [open, department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('ກະລຸນາໃສ່ຊື່ພະແນກ')
      return
    }

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: department.id, body })
      } else {
        await createMutation.mutateAsync(body)
      }
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂພະແນກ' : 'ສ້າງພະແນກໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ຊື່ພະແນກ *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="ຊື່ພະແນກ"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ຄຳອະທິບາຍ</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="ຄຳອະທິບາຍກ່ຽວກັບພະແນກ"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            ຍົກເລີກ
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEdit ? 'ບັນທຶກ' : 'ສ້າງພະແນກ'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

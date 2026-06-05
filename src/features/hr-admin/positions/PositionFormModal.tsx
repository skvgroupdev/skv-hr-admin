import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreatePositionMutation } from '../../../hooks/mutations/useCreatePositionMutation'
import { useUpdatePositionMutation } from '../../../hooks/mutations/useUpdatePositionMutation'
import type { Position } from '../../../types/position'

interface PositionFormModalProps {
  open: boolean
  onClose: () => void
  position?: Position
}

interface FormState {
  name: string
  level: string
  description: string
}

function getInitialForm(position?: Position): FormState {
  return {
    name: position?.name ?? '',
    level: position?.level?.toString() ?? '',
    description: position?.description ?? '',
  }
}

export function PositionFormModal({ open, onClose, position }: PositionFormModalProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(position))
  const [error, setError] = useState('')

  const createMutation = useCreatePositionMutation()
  const updateMutation = useUpdatePositionMutation()
  const isLoading = createMutation.isPending || updateMutation.isPending
  const isEdit = !!position

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(position))
      setError('')
    }
  }, [open, position])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('ກະລຸນາໃສ່ຊື່ຕໍາແໜ່ງ')
      return
    }

    const body = {
      name: form.name.trim(),
      level: form.level ? Number(form.level) : undefined,
      description: form.description.trim() || undefined,
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: position.id, body })
      } else {
        await createMutation.mutateAsync(body)
      }
      onClose()
    } catch {
      setError('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <Modal open={open} title={isEdit ? 'ແກ້ໄຂຕໍາແໜ່ງ' : 'ສ້າງຕໍາແໜ່ງໃໝ່'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ຊື່ຕໍາແໜ່ງ *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="ຊື່ຕໍາແໜ່ງ"
        />
        <Input
          label="ລະດັບ"
          type="number"
          value={form.level}
          onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
          placeholder="1"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ຄຳອະທິບາຍ</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="ຄຳອະທິບາຍກ່ຽວກັບຕໍາແໜ່ງ"
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
            {isEdit ? 'ບັນທຶກ' : 'ສ້າງຕໍາແໜ່ງ'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

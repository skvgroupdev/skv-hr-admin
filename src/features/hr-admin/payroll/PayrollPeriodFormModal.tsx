import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreatePayrollPeriodMutation } from '../../../hooks/mutations/usePayrollMutations'

interface PayrollPeriodFormModalProps {
  open: boolean
  onClose: () => void
}

export function PayrollPeriodFormModal({ open, onClose }: PayrollPeriodFormModalProps) {
  const createMutation = useCreatePayrollPeriodMutation()
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { name, startDate, endDate },
      {
        onSuccess: () => {
          onClose()
          setName('')
          setStartDate('')
          setEndDate('')
        },
      },
    )
  }

  return (
    <Modal open={open} title="ສ້າງງວດເງິນເດືອນ" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="ຊື່ງວດ" placeholder="ເຊັ່ນ: ເດືອນ 5 ປີ 2026" value={name} onChange={(e) => setName(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="ວັນທີເລີ່ມ" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="ວັນທີສິ້ນສຸດ" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button type="submit" loading={createMutation.isPending}>ສ້າງ</Button>
        </div>
      </form>
    </Modal>
  )
}

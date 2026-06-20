import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'

interface ApprovalActionModalProps {
  open: boolean
  action: 'approve' | 'reject'
  onClose: () => void
  onConfirm: (comment: string) => void
  isLoading: boolean
}

export function ApprovalActionModal({
  open,
  action,
  onClose,
  onConfirm,
  isLoading,
}: ApprovalActionModalProps) {
  const [comment, setComment] = useState('')

  const isApprove = action === 'approve'
  const title = isApprove ? 'ອະນຸມັດຄຳຂໍ' : 'ປະຕິເສດຄຳຂໍ'

  const handleConfirm = () => {
    if (!isApprove && !comment.trim()) return
    onConfirm(comment)
    setComment('')
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isApprove ? 'ໝາຍເຫດ ()' : 'ເຫດຜົນທີ່ປະຕິເສດ *'}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {!isApprove && !comment.trim() && (
          <p className="text-xs text-red-500">ກະລຸນາໃສ່ເຫດຜົນ</p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button
            variant={isApprove ? 'primary' : 'danger'}
            loading={isLoading}
            onClick={handleConfirm}
            disabled={!isApprove && !comment.trim()}
          >
            {isApprove ? 'ອະນຸມັດ' : 'ປະຕິເສດ'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

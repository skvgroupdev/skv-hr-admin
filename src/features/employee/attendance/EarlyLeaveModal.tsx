import { useState } from 'react'
import { X } from 'lucide-react'

const EARLY_LEAVE_REASONS = [
  'ທຸລະສ່ວນຕົວ',
  'ລາເຈັບ',
  'ລາພັກຮ້ອນ',
  'ເຫດສຸກເສີນຄອບຄົວ',
  'ນັດແພດ',
  'ອື່ນໆ',
] as const

type EarlyLeaveReason = (typeof EARLY_LEAVE_REASONS)[number]

interface EarlyLeaveModalProps {
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function EarlyLeaveModal({ onConfirm, onCancel }: EarlyLeaveModalProps) {
  const [selectedReason, setSelectedReason] = useState<EarlyLeaveReason | ''>('')
  const [customDetail, setCustomDetail] = useState('')

  const isOther = selectedReason === 'ອື່ນໆ'
  const isConfirmDisabled =
    selectedReason === '' || (isOther && customDetail.trim() === '')

  const handleConfirm = () => {
    if (isConfirmDisabled) return
    const reason = isOther ? `ອື່ນໆ: ${customDetail.trim()}` : selectedReason
    onConfirm(reason)
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
      onClick={onCancel}
    >
      {/* Sheet */}
      <div
        className="w-full max-w-md bg-white rounded-t-2xl px-5 pt-5 pb-24 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-bold text-gray-800">ອອກວຽກກ່ອນເວລາ</p>
          <button
            onClick={onCancel}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">ກະລຸນາເລືອກເຫດຜົນທີ່ອອກວຽກກ່ອນເວລາ</p>

        {/* Reason dropdown */}
        <select
          value={selectedReason}
          onChange={(e) => {
            setSelectedReason(e.target.value as EarlyLeaveReason | '')
            setCustomDetail('')
          }}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]/30 focus:border-[#1A3A6B] transition"
        >
          <option value="">-- ເລືອກເຫດຜົນ --</option>
          {EARLY_LEAVE_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>

        {/* Custom detail — shown only when "ອື່ນໆ" is selected */}
        {isOther && (
          <textarea
            value={customDetail}
            onChange={(e) => setCustomDetail(e.target.value)}
            placeholder="ກະລຸນາລະບຸລາຍລະອຽດ..."
            rows={3}
            className="mt-3 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]/30 focus:border-[#1A3A6B] transition"
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-transform"
          >
            ຍົກເລີກ
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white text-sm font-semibold shadow-md shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            ຢືນຢັນອອກວຽກ
          </button>
        </div>
      </div>
    </div>
  )
}

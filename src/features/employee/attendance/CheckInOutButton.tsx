import { Loader2, Fingerprint, MapPin, CheckCircle2, X } from 'lucide-react'
import type { AttendanceRecord } from '../../../api/employee-attendance.api'

interface CheckInOutButtonProps {
  record: AttendanceRecord | null | undefined
  isLoading: boolean
  isBeforeWindow?: boolean
  accuracy: number | null
  confirming?: boolean
  onPress: () => void
  onCancelConfirm?: () => void
}

function CheckedOutButton() {
  return (
    <button
      disabled
      className="w-full h-16 rounded-2xl bg-gray-100 text-gray-400 font-bold text-lg cursor-not-allowed"
    >
      ອອກວຽກແລ້ວ
    </button>
  )
}

function AccuracyIndicator({ accuracy }: { accuracy: number | null }) {
  if (accuracy === null) return null

  // Green ≤ 30m, yellow ≤ 100m, red > 100m
  const colorClass =
    accuracy <= 30 ? 'text-green-400' : accuracy <= 100 ? 'text-yellow-400' : 'text-red-400'

  return (
    <span className={`flex items-center gap-1 text-xs font-normal ${colorClass}`}>
      <MapPin className="h-3.5 w-3.5" />
      {Math.round(accuracy)}m
    </span>
  )
}

function CheckOutButton({
  isLoading,
  accuracy,
  onPress,
}: {
  isLoading: boolean
  accuracy: number | null
  onPress: () => void
}) {
  return (
    <button
      onClick={onPress}
      disabled={isLoading}
      className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white font-bold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70"
    >
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Fingerprint className="h-6 w-6" />}
      ອອກວຽກ
      <AccuracyIndicator accuracy={accuracy} />
    </button>
  )
}

function CheckInButton({
  isLoading,
  accuracy,
  onPress,
}: {
  isLoading: boolean
  accuracy: number | null
  onPress: () => void
}) {
  return (
    <button
      onClick={onPress}
      disabled={isLoading}
      className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#1A3A6B] to-[#2563EB] text-white font-bold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70"
    >
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Fingerprint className="h-6 w-6" />}
      ເຂົ້າວຽກ
      <AccuracyIndicator accuracy={accuracy} />
    </button>
  )
}

function ConfirmButton({
  isCheckedIn,
  isLoading,
  onPress,
  onCancel,
}: {
  isCheckedIn: boolean
  isLoading: boolean
  onPress: () => void
  onCancel: () => void
}) {
  const label = isCheckedIn ? 'ຢືນຢັນອອກວຽກ' : 'ຢືນຢັນເຂົ້າວຽກ'
  const color = isCheckedIn
    ? 'from-[#DC2626] to-[#EF4444] shadow-red-500/30'
    : 'from-[#1A3A6B] to-[#2563EB] shadow-blue-500/30'
  return (
    <div className="space-y-2">
      <button
        onClick={onPress}
        disabled={isLoading}
        className={`w-full h-16 rounded-2xl bg-gradient-to-r ${color} text-white font-bold text-lg flex items-center justify-center gap-2.5 shadow-lg animate-pulse hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70`}
      >
        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}
        {label}
      </button>
      <button
        onClick={onCancel}
        className="w-full flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" /> ຍົກເລີກ
      </button>
    </div>
  )
}

export function CheckInOutButton({
  record,
  isLoading,
  isBeforeWindow = false,
  accuracy,
  confirming = false,
  onPress,
  onCancelConfirm,
}: CheckInOutButtonProps) {
  const isCheckedOut = !!record?.checkOut
  const isCheckedIn = !!record?.checkIn && !isCheckedOut

  if (isCheckedOut) return <CheckedOutButton />

  if (confirming) {
    return (
      <ConfirmButton
        isCheckedIn={isCheckedIn}
        isLoading={isLoading}
        onPress={onPress}
        onCancel={onCancelConfirm ?? (() => {})}
      />
    )
  }

  if (isCheckedIn) return <CheckOutButton isLoading={isLoading} accuracy={accuracy} onPress={onPress} />
  return <CheckInButton isLoading={isLoading || isBeforeWindow} accuracy={accuracy} onPress={onPress} />
}

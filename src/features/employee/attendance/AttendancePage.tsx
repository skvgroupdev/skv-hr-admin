import { useState, useRef } from 'react'
import { EarlyLeaveModal } from './EarlyLeaveModal'
import { SelfieModal } from './SelfieModal'
import { uploadApi } from '../../../api/upload.api'
import { useMyTodayAttendanceQuery } from '../../../hooks/queries/useMyTodayAttendanceQuery'
import { useMyAttendanceHistoryQuery } from '../../../hooks/queries/useMyAttendanceHistoryQuery'
import { useCheckInMutation } from '../../../hooks/mutations/useCheckInMutation'
import { useCheckOutMutation } from '../../../hooks/mutations/useCheckOutMutation'
import { useAuthStore } from '../../../stores/useAuthStore'
import { useLocationStore } from '../../../stores/useLocationStore'
import { AttendanceStatusCard } from '../home/AttendanceStatusCard'
import { GpsStatusBadge } from './GpsStatusBadge'
import { CheckInOutButton } from './CheckInOutButton'
import { formatDateOnly } from '../../../utils/date'
import type { AttendanceRecord } from '../../../api/employee-attendance.api'

const LATE_STATUS_COLORS = {
  LATE_MINOR: 'bg-yellow-100 text-yellow-700',
  LATE: 'bg-red-100 text-red-600',
} as const

const CHECK_IN_WINDOW_MINUTES = 120

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// Bangkok time = UTC+7
function nowBangkokMinutes(): number {
  const now = new Date()
  return ((now.getUTCHours() + 7) % 24) * 60 + now.getUTCMinutes()
}

// If endTime is unknown, treat as early checkout so modal always prompts for a reason.
// Backend validates server-side; skipping the modal causes a 400 with no earlyLeaveReason.
function isEarlyCheckout(endTime: string | undefined): boolean {
  if (!endTime) return true
  return nowBangkokMinutes() < toMinutes(endTime)
}

// ISO → HH:mm Bangkok (UTC+7)
function formatDate7(iso: string | null | undefined): string {
  if (!iso || iso === '-') return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  const offset = 7 * 60
  const total = d.getUTCHours() * 60 + d.getUTCMinutes() + offset
  const hh = Math.floor((total % 1440) / 60)
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function formatTime(totalMinutes: number): string {
  const h = Math.floor(((totalMinutes % 1440) + 1440) % 1440 / 60)
  const m = ((totalMinutes % 1440) + 1440) % 1440 % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}


function PageHeader() {
  return (
    <div className="relative bg-gradient-to-br from-[#1A3A6B] to-[#0F2347] text-white px-5 pt-5 pb-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10 pointer-events-none" />
      <p className="relative text-xl font-bold tracking-tight">ເຂົ້າ-ອອກວຽກ</p>
    </div>
  )
}

type StatusBadgeProps = {
  status: AttendanceRecord['status']
  hasCheckout: boolean
  lateMinutes?: number
}

function StatusBadge({ status, hasCheckout, lateMinutes }: StatusBadgeProps) {
  if (status === 'NORMAL' && hasCheckout) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">ອອກວຽກແລ້ວ</span>
  }
  if (status === 'NORMAL') {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">ເຂົ້າວຽກແລ້ວ</span>
  }
  if (status === 'LATE_MINOR' || status === 'LATE') {
    const colorClass = LATE_STATUS_COLORS[status]
    const label = status === 'LATE_MINOR' ? 'ຊ້າໜ້ອຍ' : 'ຊ້າ'
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
        {label}{lateMinutes != null && lateMinutes > 0 ? `, ${lateMinutes} ນາທີ` : ''}
      </span>
    )
  }
  return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">ຂາດ</span>
}

function HistoryRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="space-y-1.5">
        <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
    </div>
  )
}

function AttendanceHistoryList() {
  const { data, isLoading } = useMyAttendanceHistoryQuery({ page: 1, limit: 20 })

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <HistoryRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  const records = data?.data ?? []

  if (records.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">ຍັງບໍ່ມີປະຫວັດ</p>
  }

  return (
    <div>
      {records.map((log) => (
        <div
          key={log.date}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-800">{formatDateOnly(log.date)}</p>
            <p className="text-xs text-gray-400">
              {formatDate7(log.checkIn ?? '-')} &rarr; {formatDate7(log.checkOut ?? '-') }
            </p>
          </div>
          <StatusBadge status={log.status} hasCheckout={!!log.checkOut} lateMinutes={log.lateMinutes} />
        </div>
      ))}
    </div>
  )
}

export default function AttendancePage() {
  const [flashSuccess, setFlashSuccess] = useState(false)
  const [showEarlyLeaveModal, setShowEarlyLeaveModal] = useState(false)
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [outsideWorkPrompt, setOutsideWorkPrompt] = useState<{
    coords: { lat: number; lng: number; accuracy: number }
  } | null>(null)
  const [outsideChecked, setOutsideChecked] = useState(false)
  // Selfie flow state
  const [showSelfieModal, setShowSelfieModal] = useState(false)
  const [pendingSelfieCoords, setPendingSelfieCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [pendingIsCheckout, setPendingIsCheckout] = useState(false)
  const [uploading, setUploading] = useState(false)
  // stores the in-flight location promise started on first click
  const locationPromiseRef = useRef<Promise<{ lat: number; lng: number; accuracy: number }> | null>(null)

  const workSchedule = useAuthStore((s) => s.user?.workSchedule)
  const { data: todayRecord, isLoading: queryLoading } = useMyTodayAttendanceQuery()
  const checkIn  = useCheckInMutation()
  const checkOut = useCheckOutMutation()
  const lat = useLocationStore((s) => s.lat)
  const lng = useLocationStore((s) => s.lng)
  const accuracy = useLocationStore((s) => s.accuracy)
  const gpsError = useLocationStore((s) => s.error)
  const isTracking = useLocationStore((s) => s.isTracking)

  // gpsLoading: no location yet and no error — still acquiring on first mount
  const gpsLoading = !isTracking && lat === null && gpsError === null

  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut
  const isMutating  = checkIn.isPending || checkOut.isPending || uploading

  const shiftStartTime = workSchedule?.startTime
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
  const windowOpenMinutes = shiftStartTime
    ? toMinutes(shiftStartTime) - CHECK_IN_WINDOW_MINUTES
    : null
  const isBeforeWindow = windowOpenMinutes != null && nowMinutes < windowOpenMinutes
  const windowOpenTimeStr = windowOpenMinutes != null ? formatTime(windowOpenMinutes) : null

  const mutationErrorMessage =
    (checkIn.error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ??
    (checkOut.error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message

  const setLocation = useLocationStore((s) => s.setLocation)
  const setGpsError = useLocationStore((s) => s.setError)

  const getLocationForCheckIn = (): Promise<{ lat: number; lng: number; accuracy: number }> => {
    // Use already-tracked location if available
    if (lat !== null && lng !== null && accuracy !== null) {
      return Promise.resolve({ lat, lng, accuracy })
    }
    // Fallback: request once (first load before interval fires)
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy)
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
        },
        (err) => {
          const msg =
            err.code === GeolocationPositionError.PERMISSION_DENIED
              ? 'ກະລຸນາເປີດ Location ໃນ browser settings'
              : err.code === GeolocationPositionError.POSITION_UNAVAILABLE
                ? 'ບໍ່ສາມາດຫາຕຳແໜ່ງໄດ້'
                : 'ໝົດເວລາພັກຫາຕຳແໜ່ງ'
          setGpsError(msg)
          reject(new Error(msg))
        },
        { timeout: 10_000, maximumAge: 0, enableHighAccuracy: true },
      )
    })
  }

  const triggerFlash = () => {
    setFlashSuccess(true)
    setTimeout(() => setFlashSuccess(false), 200)
  }

  type Coords = { lat: number; lng: number; accuracy: number }

  const proceedWithCheckInOut = (coords: Coords, isCheckout: boolean, selfieUrl?: string) => {
    const basePayload = { lat: coords.lat, lng: coords.lng, gpsAccuracy: coords.accuracy, selfieUrl }

    if (!isCheckout) {
      checkIn.mutate(basePayload, {
        onSuccess: (data) => {
          if ('blocked' in data && data.blocked) {
            setOutsideWorkPrompt({ coords })
            return
          }
          triggerFlash()
        },
      })
      return
    }

    if (isEarlyCheckout(workSchedule?.endTime)) {
      setPendingCoords(coords)
      setShowEarlyLeaveModal(true)
    } else {
      checkOut.mutate(basePayload, { onSuccess: triggerFlash })
    }
  }

  const handlePress = async () => {
    if (!confirming) {
      // First click: start fetching location silently, show confirm state
      locationPromiseRef.current = getLocationForCheckIn()
      setConfirming(true)
      return
    }

    // Second click: location should be ready (or nearly ready)
    setConfirming(false)
    let coords: Coords
    try {
      coords = await (locationPromiseRef.current ?? getLocationForCheckIn())
    } catch {
      locationPromiseRef.current = null
      return
    }
    locationPromiseRef.current = null

    // Open selfie prompt before proceeding
    setPendingSelfieCoords(coords)
    setPendingIsCheckout(isCheckedIn)
    setShowSelfieModal(true)
  }

  const handleSelfieCapture = async (file: File) => {
    setShowSelfieModal(false)
    setUploading(true)
    try {
      const { url } = await uploadApi.uploadFile(file, 'selfie')
      proceedWithCheckInOut(pendingSelfieCoords!, pendingIsCheckout, url)
    } catch {
      // Upload failed — proceed without selfie url
      proceedWithCheckInOut(pendingSelfieCoords!, pendingIsCheckout)
    } finally {
      setUploading(false)
      setPendingSelfieCoords(null)
    }
  }

  const handleSelfieSkip = () => {
    setShowSelfieModal(false)
    proceedWithCheckInOut(pendingSelfieCoords!, pendingIsCheckout)
    setPendingSelfieCoords(null)
  }

  const handleSelfieClose = () => {
    setShowSelfieModal(false)
    setPendingSelfieCoords(null)
    setConfirming(false)
  }

  const handleCancelConfirm = () => {
    setConfirming(false)
    locationPromiseRef.current = null
  }

  const handleEarlyLeaveConfirm = (earlyLeaveReason: string) => {
    if (!pendingCoords) return
    setShowEarlyLeaveModal(false)
    checkOut.mutate(
      {
        lat: pendingCoords.lat,
        lng: pendingCoords.lng,
        gpsAccuracy: pendingCoords.accuracy,
        earlyLeaveReason,
      },
      { onSuccess: triggerFlash },
    )
    setPendingCoords(null)
  }

  const handleEarlyLeaveCancel = () => {
    setShowEarlyLeaveModal(false)
    setPendingCoords(null)
  }

  const handleOutsideWorkConfirm = () => {
    if (!outsideWorkPrompt) return
    const { coords } = outsideWorkPrompt
    setOutsideWorkPrompt(null)
    setOutsideChecked(false)

    if (!isCheckedIn) {
      checkIn.mutate(
        { lat: coords.lat, lng: coords.lng, gpsAccuracy: coords.accuracy, isOffsite: true },
        { onSuccess: triggerFlash },
      )
    } else {
      checkOut.mutate(
        { lat: coords.lat, lng: coords.lng, gpsAccuracy: coords.accuracy, isOffsite: true },
        { onSuccess: triggerFlash },
      )
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top fixed section */}
      <div className="flex-none">
        <PageHeader />

        <div className={`transition-colors duration-200 ${flashSuccess ? 'bg-green-50' : ''}`}>
          <AttendanceStatusCard record={todayRecord} isLoading={queryLoading} />
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* <div className="flex items-center justify-center min-h-8">
            <GpsStatusBadge loading={gpsLoading} lat={lat} error={gpsError} checkedIn={isCheckedIn} />
          </div> */}

          {uploading && (
            <p className="text-sm text-gray-500 text-center animate-pulse">ກຳລັງອັບໂຫລດຮູບ...</p>
          )}

          {(checkIn.isError || checkOut.isError) && (
            <p className="text-sm text-employee-danger text-center">
              {mutationErrorMessage ?? 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່'}
            </p>
          )}

          <CheckInOutButton
            record={todayRecord}
            isLoading={isMutating}
            isBeforeWindow={isBeforeWindow}
            accuracy={accuracy}
            confirming={confirming}
            onPress={handlePress}
            onCancelConfirm={handleCancelConfirm}
          />

          {outsideWorkPrompt && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 space-y-3">
              <p className="text-sm font-medium text-orange-800">ທ່ານຢູ່ນອກພື້ນທີ່ເຮັດວຽກ</p>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={outsideChecked}
                  onChange={(e) => setOutsideChecked(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">ອອກວຽກນອກເດີ</span>
              </label>
              <div className="flex gap-2">
                <button
                  disabled={!outsideChecked || isMutating}
                  onClick={handleOutsideWorkConfirm}
                  className="flex-1 h-10 rounded-lg bg-orange-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-orange-600 transition-colors"
                >
                  ຢືນຢັນ
                </button>
                <button
                  onClick={() => { setOutsideWorkPrompt(null); setOutsideChecked(false) }}
                  className="flex-1 h-10 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                >
                  ຍົກເລີກ
                </button>
              </div>
            </div>
          )}

          {isBeforeWindow && windowOpenTimeStr && (
            <p className="text-sm text-gray-500 text-center mt-2">
              ສາມາດ Check-in ໄດ້ຕັ້ງແຕ່{' '}
              <span className="font-semibold text-[#1A3A6B]">{windowOpenTimeStr}</span>
            </p>
          )}
        </div>
      </div>

      {/* Scrollable history */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">ປະຫວັດການເຂົ້າ-ອອກ</h2>
        <AttendanceHistoryList />
      </div>

      {showEarlyLeaveModal && (
        <EarlyLeaveModal
          onConfirm={handleEarlyLeaveConfirm}
          onCancel={handleEarlyLeaveCancel}
        />
      )}

      {showSelfieModal && (
        <SelfieModal
          onCapture={handleSelfieCapture}
          onSkip={handleSelfieSkip}
          onClose={handleSelfieClose}
        />
      )}
    </div>
  )
}

import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, X } from 'lucide-react'
import { attendanceAdjustmentsApi } from '../../../api/attendance-adjustments.api'
import { uploadApi } from '../../../api/upload.api'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { toast } from '../../../components/ui/Toast'
import { formatDateOnly } from '../../../utils/date'

const STATUS_LABELS: Record<string, string> = {
  PENDING:   'ລໍຖ້າ',
  APPROVED:  'ອະນຸມັດ',
  REJECTED:  'ປະຕິເສດ',
  CANCELLED: 'ຍົກເລີກ',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'text-yellow-700',
  APPROVED:  'text-green-700',
  REJECTED:  'text-red-600',
  CANCELLED: 'text-gray-500',
}

export function AttendanceAdjustmentTab() {
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN')
  const [reason, setReason] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data = [], isLoading } = useQuery({
    queryKey: ['attendance-adjustments', 'my'],
    queryFn: attendanceAdjustmentsApi.mine,
  })

  const createMutation = useMutation({
    mutationFn: attendanceAdjustmentsApi.create,
    onSuccess: () => {
      setDate(''); setTime(''); setReason('')
      setImageFile(null); setImagePreview(null)
      toast.success('ສົ່ງຄຳຂໍແກ້ເວລາສຳເລັດ')
      void qc.invalidateQueries({ queryKey: ['attendance-adjustments'] })
    },
    onError: () => toast.error('ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່'),
  })

  const cancelMutation = useMutation({
    mutationFn: attendanceAdjustmentsApi.cancel,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['attendance-adjustments'] }),
  })

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    let evidenceUrl: string | undefined
    if (imageFile) {
      setIsUploading(true)
      try {
        const result = await uploadApi.uploadFile(imageFile, 'evidence')
        evidenceUrl = result.url
      } catch {
        toast.error('ອັບໂຫຼດຮູບບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }
    createMutation.mutate({
      type,
      workDate: date,
      requestedCheckTime: new Date(`${date}T${time}:00+07:00`).toISOString(),
      reason: reason.trim(),
      evidenceUrl,
    })
  }

  const isSubmitting = isUploading || createMutation.isPending
  const canSubmit = date && time && reason.trim().length >= 3 && !isSubmitting

  return (
    <div className="p-4 space-y-4">
      {/* Form */}
      <div className="rounded-xl bg-white border border-gray-100 p-4 space-y-3">
        <p className="font-semibold text-gray-900">ຂໍແກ້ເວລາເຂົ້າ-ອອກ</p>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="CHECK_IN">ເວລາເຂົ້າ</option>
          <option value="CHECK_OUT">ເວລາອອກ</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <Input label="ວັນທີ" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="ເວລາທີ່ຂໍແກ້" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <Input label="ເຫດຜົນ" value={reason} onChange={(e) => setReason(e.target.value)} />

        {/* Image upload */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1.5">ຫຼັກຖານ (ຮູບພາບ)</p>
          {imagePreview ? (
            <div className="relative w-full max-w-xs">
              <img src={imagePreview} alt="evidence" className="w-full rounded-lg border border-gray-200 object-cover max-h-40" />
              <button
                onClick={removeImage}
                className="absolute top-1.5 right-1.5 rounded-full bg-white/90 p-0.5 shadow"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors w-full"
            >
              <ImagePlus className="h-4 w-4" />
              ເພີ່ມຮູບຫຼັກຖານ
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
        </div>

        <Button
          className="w-full"
          disabled={!canSubmit}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {isUploading ? 'ກຳລັງອັບໂຫຼດ...' : 'ສົ່ງຄຳຂໍ'}
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading && <p className="text-sm text-gray-500">ກຳລັງໂຫຼດ...</p>}
        {data.map((item) => (
          <div key={item.id} className="rounded-xl bg-white border border-gray-100 p-3 text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {item.type === 'CHECK_IN' ? 'ເວລາເຂົ້າ' : 'ເວລາອອກ'} · {formatDateOnly(item.workDate)}
              </span>
              <span className={`text-xs font-medium ${STATUS_COLORS[item.status] ?? ''}`}>
                {STATUS_LABELS[item.status] ?? item.status}
              </span>
            </div>
            <p className="text-gray-500">
              {new Date(item.requestedCheckTime).toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })}
              {' — '}{item.reason}
            </p>
            {item.evidenceUrl && (
              <a href={item.evidenceUrl} target="_blank" rel="noreferrer">
                <img src={item.evidenceUrl} alt="evidence" className="mt-1.5 max-h-24 rounded-lg border border-gray-200 object-cover" />
              </a>
            )}
            {item.status === 'PENDING' && (
              <button
                className="mt-1 text-xs text-red-600"
                onClick={() => cancelMutation.mutate(item.id)}
              >
                ຍົກເລີກ
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

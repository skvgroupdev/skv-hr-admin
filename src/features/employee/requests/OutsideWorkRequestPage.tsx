import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOutsideWorkMutation } from '../../../hooks/mutations/useOutsideWorkMutation'
import { useLocationStore } from '../../../stores/useLocationStore'
import type { SubmitOutsideWorkDto } from '../../../api/employee-requests.api'

const OUTSIDE_WORK_TYPES: { value: SubmitOutsideWorkDto['outsideType']; label: string }[] = [
  { value: 'OUTSIDE_WORK', label: 'ວຽກນອກ' },
  { value: 'CUSTOMER_VISIT', label: 'ໄປຫາລູກຄ້າ' },
  { value: 'DELIVERY', label: 'ສົ່ງຂອງ' },
  { value: 'WORK_FROM_HOME', label: 'ເຮັດວຽກທາງໄກ' },
  { value: 'BUSINESS_TRIP', label: 'ເດີນທາງທຸລະກິດ' },
  { value: 'EMERGENCY', label: 'ເຫດສຸກເສີນ' },
  { value: 'OTHER', label: 'ອື່ນໆ' },
]

const schema = z.object({
  outsideType: z.enum(['OUTSIDE_WORK', 'CUSTOMER_VISIT', 'DELIVERY', 'WORK_FROM_HOME', 'BUSINESS_TRIP', 'EMERGENCY', 'OTHER']),
  reason: z.string().min(1, 'ກະລຸນາໃສ່ເຫດຜົນ'),
  locationName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function OutsideWorkRequestPage() {
  const navigate = useNavigate()
  const mutation = useOutsideWorkMutation()
  const lat = useLocationStore((s) => s.lat)
  const lng = useLocationStore((s) => s.lng)
  const accuracy = useLocationStore((s) => s.accuracy)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    const payload: SubmitOutsideWorkDto = {
      ...data,
      ...(lat !== null && lng !== null ? { lat, lng, gpsAccuracy: accuracy ?? undefined } : {}),
    }
    mutation.mutate(payload, {
      onSuccess: () => navigate('/employee/requests', { state: { tab: 'outside' } }),
    })
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-gray-800 mb-4">ຄຳຮ້ອງອອກວຽກນອກ</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ປະເພດ</label>
          <select {...register('outsideType')} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]">
            <option value="">ເລືອກປະເພດ</option>
            {OUTSIDE_WORK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {errors.outsideType && <p className="mt-1 text-xs text-red-600">{errors.outsideType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ສະຖານທີ່</label>
          <input type="text" {...register('locationName')} placeholder="ຊື່ສະຖານທີ່..." className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]" />
          {errors.locationName && <p className="mt-1 text-xs text-red-600">{errors.locationName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ເຫດຜົນ</label>
          <textarea {...register('reason')} rows={3} placeholder="ໃສ່ເຫດຜົນ..." className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B] resize-none" />
          {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>}
        </div>

{mutation.isError && <p className="text-sm text-red-600">ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່</p>}

        <button type="submit" disabled={mutation.isPending} className="w-full min-h-12 rounded-2xl bg-[#0D2B6B] text-white font-semibold text-sm disabled:opacity-50">
          {mutation.isPending ? 'ກຳລັງສົ່ງ...' : 'ສົ່ງຄຳຮ້ອງ'}
        </button>
      </form>
    </div>
  )
}

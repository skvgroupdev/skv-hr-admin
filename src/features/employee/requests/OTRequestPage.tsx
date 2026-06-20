import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOTRequestMutation } from '../../../hooks/mutations/useOTRequestMutation'
import { toast } from '../../../components/ui/Toast'

const otSchema = z.object({
  date: z.string().min(1, 'ກະລຸນາເລືອກວັນທີ'),
  startTime: z.string().min(1, 'ກະລຸນາໃສ່ເວລາ OT ເລີ່ມ'),
  endTime: z.string().min(1, 'ກະລຸນາໃສ່ເວລາ OT ສິ້ນສຸດ'),
  reason: z.string().min(1, 'ກະລຸນາໃສ່ເຫດຜົນ'),
})

type OTFormData = z.infer<typeof otSchema>

export default function OTRequestPage() {
  const navigate = useNavigate()
  const mutation = useOTRequestMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<OTFormData>({
    resolver: zodResolver(otSchema),
  })

  const onSubmit = (data: OTFormData) => {
    const startDatetime = new Date(`${data.date}T${data.startTime}:00`).toISOString()
    const endDatetime = new Date(`${data.date}T${data.endTime}:00`).toISOString()

    mutation.mutate(
      { ...data, startTime: startDatetime, endTime: endDatetime },
      {
        onSuccess: () => {
          toast.success('ສົ່ງຄຳຮ້ອງ OT ສຳເລັດ')
          navigate('/employee/requests', { state: { tab: 'ot' } })
        },
        onError: (error: unknown) => {
          const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
          toast.error(msg ?? 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່')
        },
      },
    )
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-gray-800 mb-4">ຄຳຮ້ອງ OT</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ວັນທີ</label>
          <input type="date" {...register('date')} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]" />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ເວລາ OT ເລີ່ມ</label>
            <input type="time" {...register('startTime')} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]" />
            {errors.startTime && <p className="mt-1 text-xs text-red-600">{errors.startTime.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ເວລາ OT ສິ້ນສຸດ</label>
            <input type="time" {...register('endTime')} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]" />
            {errors.endTime && <p className="mt-1 text-xs text-red-600">{errors.endTime.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ເຫດຜົນ</label>
          <textarea
            {...register('reason')}
            rows={3}
            placeholder="ໃສ່ເຫດຜົນ..."
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B] resize-none"
          />
          {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>}
        </div>



        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full min-h-12 rounded-2xl bg-[#0D2B6B] text-white font-semibold text-sm disabled:opacity-50"
        >
          {mutation.isPending ? 'ກຳລັງສົ່ງ...' : 'ສົ່ງຄຳຮ້ອງ'}
        </button>
      </form>
    </div>
  )
}

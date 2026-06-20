import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useCreateAdjustmentMutation } from '../../../hooks/useAttendanceAdjustments'
import type { AttendanceAdjustmentType } from '../../../types/attendance-adjustment'

const schema = z.object({
  type: z.enum(['CHECK_IN', 'CHECK_OUT']),
  workDate: z.string().min(1, 'ກະລຸນາເລືອກວັນທີ'),
  requestedTime: z.string().min(1, 'ກະລຸນາໃສ່ເວລາ'),
  reason: z.string().min(3, 'ກະລຸນາໃສ່ເຫດຜົນຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ'),
})

type FormData = z.infer<typeof schema>

interface Props {
  onClose: () => void
}

export function AttendanceAdjustmentCreateModal({ onClose }: Props) {
  const mutation = useCreateAdjustmentMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'CHECK_IN' },
  })

  function onSubmit(data: FormData) {
    const requestedCheckTime = new Date(
      `${data.workDate}T${data.requestedTime}:00+07:00`,
    ).toISOString()

    mutation.mutate(
      {
        type: data.type as AttendanceAdjustmentType,
        workDate: data.workDate,
        requestedCheckTime,
        reason: data.reason.trim(),
      },
      { onSuccess: onClose },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-0 sm:items-center sm:px-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <p className="font-semibold text-gray-900">ຂໍແກ້ເວລາເຂົ້າ-ອອກ</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ປະເພດ</label>
            <select
              {...register('type')}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]"
            >
              <option value="CHECK_IN">ເວລາເຂົ້າ (Check-in)</option>
              <option value="CHECK_OUT">ເວລາອອກ (Check-out)</option>
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ວັນທີ</label>
              <input
                type="date"
                {...register('workDate')}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]"
              />
              {errors.workDate && (
                <p className="mt-1 text-xs text-red-600">{errors.workDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ເວລາທີ່ຂໍແກ້</label>
              <input
                type="time"
                {...register('requestedTime')}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]"
              />
              {errors.requestedTime && (
                <p className="mt-1 text-xs text-red-600">{errors.requestedTime.message}</p>
              )}
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
            {errors.reason && (
              <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-600">
              {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data
                ?.message ?? 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່'}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              ຍົກເລີກ
            </Button>
            <Button type="submit" className="flex-1" loading={mutation.isPending}>
              ສົ່ງຄຳຂໍ
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

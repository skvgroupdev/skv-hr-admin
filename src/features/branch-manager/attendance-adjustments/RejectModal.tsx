import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { useRejectAdjustmentMutation } from '../../../hooks/useAttendanceAdjustments'

const schema = z.object({
  reason: z.string().min(3, 'ກະລຸນາໃສ່ເຫດຜົນຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ'),
})

type FormData = z.infer<typeof schema>

interface Props {
  adjustmentId: string
  onClose: () => void
}

export function RejectModal({ adjustmentId, onClose }: Props) {
  const mutation = useRejectAdjustmentMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormData) {
    mutation.mutate(
      { id: adjustmentId, reason: data.reason.trim() },
      { onSuccess: onClose },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <p className="font-semibold text-gray-900">ເຫດຜົນປະຕິເສດ</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ເຫດຜົນ
            </label>
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

          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              ຍົກເລີກ
            </Button>
            <Button type="submit" variant="danger" className="flex-1" loading={mutation.isPending}>
              ປະຕິເສດ
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

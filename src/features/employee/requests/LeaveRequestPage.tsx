import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLeaveRequestMutation } from '../../../hooks/mutations/useLeaveRequestMutation'

const LEAVE_TYPES = [
  { value: 'SICK',      label: 'ລາເຈັບ' },
  { value: 'PATERNITY', label: 'ເມຍເກີດລູກ' },
  { value: 'WEDDING',   label: 'ງານແຕ່ງ' },
  { value: 'ANNUAL',    label: 'ລາພັກຮ້ອນ' },
  { value: 'OTHER',     label: 'ອື່ນໆ' },
] as const

const leaveSchema = z.object({
  leaveType: z.enum(['SICK', 'PATERNITY', 'WEDDING', 'ANNUAL', 'OTHER'], {
    required_error: 'ກະລຸນາເລືອກປະເພດການລາພັກ',
  }),
  startDate: z.string().min(1, 'ກະລຸນາເລືອກວັນທີ'),
  endDate: z.string().optional(),
  period: z.enum(['FULL_DAY', 'AM', 'PM']).default('FULL_DAY'),
  reason: z.string().min(1, 'ກະລຸນາໃສ່ເຫດຜົນ'),
}).refine(
  (d) => d.period !== 'FULL_DAY' || (!!d.endDate && d.endDate.length > 0),
  { message: 'ກະລຸນາເລືອກວັນທີສິ້ນສຸດ', path: ['endDate'] },
)

type LeaveFormData = z.infer<typeof leaveSchema>

const inputClass =
  'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]'

const PERIOD_OPTIONS: { value: LeaveFormData['period']; label: string }[] = [
  { value: 'FULL_DAY', label: 'ເຕັມວັນ' },
  { value: 'AM',       label: 'ຊ່ວງເຊົ້າ' },
  { value: 'PM',       label: 'ຊ່ວງບ່າຍ' },
]

export default function LeaveRequestPage() {
  const navigate = useNavigate()
  const mutation = useLeaveRequestMutation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: { period: 'FULL_DAY' },
  })

  const selectedPeriod = watch('period')
  const isHalfDay = selectedPeriod !== 'FULL_DAY'

  const onSubmit = (formData: LeaveFormData) => {
    const leaveTypeName = LEAVE_TYPES.find((t) => t.value === formData.leaveType)?.label ?? formData.leaveType

    mutation.mutate(
      {
        leaveTypeName,
        startDate: formData.startDate,
        endDate: isHalfDay ? formData.startDate : formData.endDate,
        isHalfDay,
        halfDayPeriod: isHalfDay ? (formData.period as 'AM' | 'PM') : undefined,
        reason: formData.reason,
      },
      {
        onSuccess: () => navigate('/employee/requests', { state: { tab: 'leave' } }),
      },
    )
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-bold text-gray-800 mb-4">ຄຳຮ້ອງລາພັກ</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Leave type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ປະເພດການລາພັກ</label>
          <select {...register('leaveType')} className={inputClass}>
            <option value="">ເລືອກປະເພດການລາພັກ</option>
            {LEAVE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.leaveType && (
            <p className="mt-1 text-xs text-red-600">{errors.leaveType.message}</p>
          )}
        </div>

        {/* Period selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ຊ່ວງເວລາ</label>
          <div className="flex gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  selectedPeriod === opt.value
                    ? 'border-[#0D2B6B] bg-[#0D2B6B] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-[#0D2B6B]'
                }`}
              >
                <input
                  type="radio"
                  {...register('period')}
                  value={opt.value}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Date fields — endDate hidden when half day */}
        <div className={isHalfDay ? '' : 'grid grid-cols-2 gap-3'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ວັນທີ</label>
            <input type="date" {...register('startDate')} className={inputClass} />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          {!isHalfDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ວັນສິ້ນສຸດ</label>
              <input type="date" {...register('endDate')} className={inputClass} />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ເຫດຜົນ</label>
          <textarea
            {...register('reason')}
            rows={3}
            placeholder="ໃສ່ເຫດຜົນ..."
            className={`${inputClass} resize-none`}
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>
          )}
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່</p>
        )}

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

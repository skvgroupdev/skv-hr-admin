import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateMyProfileMutation } from '../../../hooks/mutations/useUpdateMyProfileMutation'
import { toast } from '../../../components/ui/Toast'
import type { User } from '../../../types/auth'

const BANK_OPTIONS = ['BCEL', 'LDB', 'JDB', 'ACLIDA'] as const

const schema = z.object({
  bankName: z.enum(['BCEL', 'LDB', 'JDB', 'ACLIDA'], { required_error: 'ກະລຸນາເລືອກທະນາຄານ' }),
  bankAccount: z.string().min(1, 'ກະລຸນາໃສ່ເລກບັນຊີ'),
})
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0D2B6B] focus:outline-none bg-white'

interface Props {
  user: User
}

export function BankInfoTab({ user }: Props) {
  const mutation = useUpdateMyProfileMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: user.bankName ?? '',
      bankAccount: user.bankAccount ?? '',
    },
  })

  // Sync form when freshUser data arrives after initial login
  useEffect(() => {
    reset({
      bankName: user.bankName ?? '',
      bankAccount: user.bankAccount ?? '',
    })
  }, [user.bankName, user.bankAccount, reset])

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: () => toast.success('ບັນທຶກສຳເລັດ'),
      onError: () => toast.error('ບັນທຶກລົ້ມເຫລວ'),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs text-gray-500">ຊື່ທະນາຄານ</label>
        <select {...register('bankName')} className={inputClass}>
          <option value="" disabled>ເລືອກທະນາຄານ</option>
          {BANK_OPTIONS.map((bank) => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
        {errors.bankName && <p className="text-xs text-red-500">{errors.bankName.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">ເລກບັນຊີ</label>
        <input {...register('bankAccount')} className={inputClass} placeholder="xxxxxxxxxx" />
        {errors.bankAccount && <p className="text-xs text-red-500">{errors.bankAccount.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-[#0D2B6B] text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {mutation.isPending && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        ບັນທຶກ
      </button>
    </form>
  )
}

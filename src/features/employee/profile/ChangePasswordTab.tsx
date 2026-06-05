import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useChangePasswordMutation } from '../../../hooks/mutations/useChangePasswordMutation'

const schema = z
  .object({
    oldPassword: z.string().min(1, 'ກະລຸນາໃສ່ລະຫັດຜ່ານເກົ່າ'),
    newPassword: z.string().min(8, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ'),
    confirmPassword: z.string().min(1, 'ກະລຸນາຢືນຢັນລະຫັດຜ່ານ'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'ລະຫັດຜ່ານບໍ່ຕົງກັນ',
    path: ['confirmPassword'],
  })
type FormData = z.infer<typeof schema>

const inputClass =
  'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0D2B6B] focus:outline-none'

function PasswordField({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input {...props} type={show ? 'text' : 'password'} className={inputClass + ' pr-10'} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function ChangePasswordTab() {
  const mutation = useChangePasswordMutation()
  const [successMsg, setSuccessMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    setSuccessMsg('')
    mutation.mutate(
      { oldPassword: data.oldPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          reset()
          setSuccessMsg('ປ່ຽນລະຫັດຜ່ານສຳເລັດ')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PasswordField
        label="ລະຫັດຜ່ານເກົ່າ"
        placeholder="••••••••"
        error={errors.oldPassword?.message}
        {...register('oldPassword')}
      />
      <PasswordField
        label="ລະຫັດຜ່ານໃໝ່"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <PasswordField
        label="ຢືນຢັນລະຫັດຜ່ານໃໝ່"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {mutation.isError && (
        <p className="text-xs text-red-500 text-center">
          ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ ຫຼື ເກີດຂໍ້ຜິດພາດ
        </p>
      )}
      {successMsg && <p className="text-xs text-green-600 text-center">{successMsg}</p>}

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
        ປ່ຽນລະຫັດຜ່ານ
      </button>
    </form>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useLoginMutation } from './useAuth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Footer } from '../../components/layout/Footer'

const loginSchema = z.object({
  phone: z.string().min(7, 'ກະລຸນາໃສ່ເບີໂທລະສັບ').regex(/^\d+$/, 'ກະລຸນາໃສ່ສະເພາະຕົວເລກ'),
  password: z.string().min(1, 'ກະລຸນາໃສ່ລະຫັດຜ່ານ'),
  companyCode: z.string().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showCompanyCode, setShowCompanyCode] = useState(false)
  const loginMutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('multiple') || msg.includes('company')) {
        setShowCompanyCode(true)
        return 'ກະລຸນາໃສ່ລະຫັດບໍລິສັດ'
      }
      if (msg.includes('unauthorized') || msg.includes('invalid')) {
        return 'ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'
      }
    }
    return 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່'
  }

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      ...data,
      phone: `+856${data.phone.replace(/^0/, '')}`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <img src="/skv-hr-logo.png" alt="SKV HR" className="h-16 w-auto object-contain mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">ເຂົ້າສູ່ລະບົບ</h1>
            <p className="mt-1 text-sm text-gray-500">SKV HR - ລະບົບຈັດການບຸກຄະລາພັກກອນ</p>
          </div>

          {/* Card */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ເບີໂທລະສັບ</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">
                    +856
                  </span>
                  <input
                    type="tel"
                    placeholder="20 XXXX XXXX"
                    className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="relative">
                <Input
                  label="ລະຫັດຜ່ານ"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {showCompanyCode && (
                <Input
                  label="ລະຫັດບໍລິສັດ"
                  placeholder="ໃສ່ລະຫັດບໍລິສັດ"
                  error={errors.companyCode?.message}
                  {...register('companyCode')}
                />
              )}

              {loginMutation.isError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-700">{getErrorMessage(loginMutation.error)}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loginMutation.isPending}
              >
                ເຂົ້າສູ່ລະບົບ
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

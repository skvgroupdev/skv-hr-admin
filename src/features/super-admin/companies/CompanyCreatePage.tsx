import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useCreateCompanyMutation } from '../../../hooks/mutations/useCreateCompanyMutation'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { toast } from '../../../components/ui/Toast'

const schema = z.object({
  name: z.string().min(1, 'ກະລຸນາໃສ່ຊື່ບໍລິສັດ'),
  email: z.string().email('ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ').or(z.literal('')).optional(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  defaultTimezone: z.string().min(1),
  defaultLanguage: z.string().min(1),
})

type FormData = z.infer<typeof schema>

const TIMEZONES = [
  { value: 'Asia/Vientiane', label: 'Asia/Vientiane (ICT +07:00)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (ICT +07:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT +08:00)' },
  { value: 'UTC', label: 'UTC +00:00' },
]

const LANGUAGES = [
  { value: 'lo', label: 'ລາພັກວ' },
  { value: 'th', label: 'ໄທ' },
  { value: 'en', label: 'ອັງກິດ' },
]

export default function CompanyCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateCompanyMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      defaultTimezone: 'Asia/Vientiane',
      defaultLanguage: 'lo',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        taxId: data.taxId || undefined,
        address: data.address || undefined,
        defaultTimezone: data.defaultTimezone,
        defaultLanguage: data.defaultLanguage,
      })
      toast.success('ສ້າງບໍລິສັດສຳເລັດ')
      navigate('/super/companies')
    } catch {
      toast.error('ບໍ່ສາມາດສ້າງບໍລິສັດໄດ້ ກະລຸນາລອງໃໝ່')
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">ສ້າງບໍລິສັດໃໝ່</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="ຊື່ບໍລິສັດ *"
            placeholder="ໃສ່ຊື່ບໍລິສັດ"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ອີເມວ"
              type="email"
              placeholder="example@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="ເບີໂທ"
              type="tel"
              placeholder="+856 20 XXXX XXXX"
              {...register('phone')}
            />
          </div>

          <Input
            label="ເລກທະບຽນພາສີ"
            placeholder="ໃສ່ເລກທະບຽນພາສີ"
            {...register('taxId')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">ທີ່ຢູ່</label>
            <textarea
              rows={3}
              placeholder="ໃສ່ທີ່ຢູ່ບໍລິສັດ"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
              {...register('address')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ໂຕນ</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                {...register('defaultTimezone')}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">ພາສາ</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                {...register('defaultLanguage')}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={createMutation.isPending}>
              ບັນທຶກ
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/super/companies')}
            >
              ຍົກເລີກ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

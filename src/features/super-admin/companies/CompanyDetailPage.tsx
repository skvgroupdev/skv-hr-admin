import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Building2, Edit2 } from 'lucide-react'
import { useCompanyQuery } from '../../../hooks/queries/useCompanyQuery'
import {
  useActivateCompanyMutation,
  useSuspendCompanyMutation,
} from '../../../hooks/mutations/useCompanyStatusMutation'
import { useCreateOwnerMutation } from '../../../hooks/mutations/useCreateOwnerMutation'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { StatusBadge } from '../../../components/ui/Badge'
import { PageLoader } from '../../../components/ui/LoadingSpinner'
import { toast } from '../../../components/ui/Toast'
import { formatDateOnly } from '../../../utils/date'

const ownerSchema = z.object({
  phone: z.string().min(1, 'ກະລຸນາໃສ່ເບີໂທ'),
  name: z.string().min(1, 'ກະລຸນາໃສ່ຊື່'),
  password: z.string().min(8, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ'),
})
type OwnerFormData = z.infer<typeof ownerSchema>

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="w-40 shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value ?? '—'}</span>
    </div>
  )
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showOwnerForm, setShowOwnerForm] = useState(false)

  const { data: company, isLoading, isError } = useCompanyQuery(id ?? '')
  const activateMutation = useActivateCompanyMutation()
  const suspendMutation = useSuspendCompanyMutation()
  const createOwnerMutation = useCreateOwnerMutation(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OwnerFormData>({ resolver: zodResolver(ownerSchema) })

  const handleActivate = async () => {
    try {
      await activateMutation.mutateAsync(id ?? '')
      toast.success('ເປີດໃຊ້ບໍລິສັດສຳເລັດ')
    } catch {
      toast.error('ບໍ່ສາມາດດຳເນີນການໄດ້')
    }
  }

  const handleSuspend = async () => {
    try {
      await suspendMutation.mutateAsync(id ?? '')
      toast.success('ລະງັບບໍລິສັດສຳເລັດ')
    } catch {
      toast.error('ບໍ່ສາມາດດຳເນີນການໄດ້')
    }
  }

  const handleCreateOwner = async (data: OwnerFormData) => {
    try {
      await createOwnerMutation.mutateAsync(data)
      toast.success('ສ້າງບັນຊີເຈົ້າຂອງສຳເລັດ')
      reset()
      setShowOwnerForm(false)
    } catch {
      toast.error('ບໍ່ສາມາດສ້າງບັນຊີໄດ້ ກະລຸນາລອງໃໝ່')
    }
  }

  if (isLoading) return <PageLoader />

  if (isError || !company) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">ບໍ່ພົບຂໍ້ມູນບໍລິສັດ</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          ກັບຄືນ
        </Button>
      </div>
    )
  }

  const isCanActivate = company.status === 'SUSPENDED' || company.status === 'EXPIRED'
  const isCanSuspend = company.status === 'ACTIVE' || company.status === 'TRIAL'

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">{company.name}</h1>
              <StatusBadge status={company.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{company.email ?? ''}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4" />
            ແກ້ໄຂ
          </Button>
          {isCanActivate && (
            <Button
              size="sm"
              loading={activateMutation.isPending}
              onClick={handleActivate}
            >
              ເປີດໃຊ້
            </Button>
          )}
          {isCanSuspend && (
            <Button
              variant="danger"
              size="sm"
              loading={suspendMutation.isPending}
              onClick={handleSuspend}
            >
              ລະງັບ
            </Button>
          )}
        </div>
      </div>

      {/* Info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="font-medium text-gray-900">ຂໍ້ມູນບໍລິສັດ</h2>
        </div>

        <DetailRow label="ຊື່ບໍລິສັດ" value={company.name} />
        <DetailRow label="ອີເມວ" value={company.email} />
        <DetailRow label="ເບີໂທ" value={company.phone} />
        <DetailRow label="ເລກທະບຽນພາສີ" value={company.taxId} />
        <DetailRow label="ທີ່ຢູ່" value={company.address} />
        <DetailRow label="ໂຕນ" value={company.defaultTimezone} />
        <DetailRow label="ພາສາ" value={company.defaultLanguage} />
        <DetailRow
          label="ວັນທີສ້າງ"
          value={formatDateOnly(company.createdAt)}
        />
      </Card>

      {/* Create Owner */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">ສ້າງບັນຊີເຈົ້າຂອງ</h2>
          {!showOwnerForm && (
            <Button size="sm" onClick={() => setShowOwnerForm(true)}>
              + ສ້າງບັນຊີ
            </Button>
          )}
        </div>

        {showOwnerForm ? (
          <form onSubmit={handleSubmit(handleCreateOwner)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ເບີໂທ *"
                type="tel"
                placeholder="+856 20 XXXX XXXX"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="ຊື່ *"
                placeholder="ໃສ່ຊື່ເຕັມ"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>
            <Input
              label="ລະຫັດຜ່ານ *"
              type="password"
              placeholder="ຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={createOwnerMutation.isPending}>
                ບັນທຶກ
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowOwnerForm(false)
                  reset()
                }}
              >
                ຍົກເລີກ
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            ຍັງບໍ່ທັນສ້າງບັນຊີເຈົ້າຂອງ ກົດ '+ ສ້າງບັນຊີ' ເພື່ອດຳເນີນການ
          </p>
        )}
      </Card>
    </div>
  )
}

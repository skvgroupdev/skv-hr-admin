import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Building2, Edit2, Package } from 'lucide-react'
import { useCompanyQuery } from '../../../hooks/queries/useCompanyQuery'
import { useCompanyUsageQuery } from '../../../hooks/queries/useCompanyUsageQuery'
import { usePlansQuery } from '../../../hooks/queries/usePlansQuery'
import {
  useActivateCompanyMutation,
  useAssignCompanyPlanMutation,
  useExtendCompanySubscriptionMutation,
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
import type { Plan } from '../../../types/plan'

const ownerSchema = z.object({
  phone: z.string().min(1, 'ກະລຸນາໃສ່ເບີໂທ'),
  name: z.string().min(1, 'ກະລຸນາໃສ່ຊື່'),
  password: z.string().min(8, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ'),
})
type OwnerFormData = z.infer<typeof ownerSchema>

const planSchema = z.object({
  planId: z.string().min(1, 'ກະລຸນາເລືອກ package'),
  startDate: z.string().min(1, 'ກະລຸນາເລືອກວັນເລີ່ມ'),
  endDate: z.string().min(1, 'ກະລຸນາເລືອກວັນໝົດອາຍຸ'),
  isPaid: z.boolean().optional(),
})
type PlanFormData = z.infer<typeof planSchema>

const extendSchema = z.object({
  endDate: z.string().min(1, 'ກະລຸນາເລືອກວັນໝົດອາຍຸໃໝ່'),
  isPaid: z.boolean().optional(),
})
type ExtendFormData = z.infer<typeof extendSchema>

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="w-40 shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value ?? '—'}</span>
    </div>
  )
}

function asInputDate(value?: string) {
  if (!value) return ''
  return value.slice(0, 10)
}

function getPlanId(planId: string | Plan | null | undefined) {
  if (!planId) return ''
  return typeof planId === 'string' ? planId : planId.id
}

function getPlanName(planId: string | Plan | null | undefined, plans?: Plan[]) {
  if (!planId) return 'ຍັງບໍ່ໄດ້ຜູກ package'
  if (typeof planId !== 'string') return planId.name
  return plans?.find((plan) => plan.id === planId)?.name ?? planId
}

function UsageLine({
  label,
  value,
  limit,
}: {
  label: string
  value: number
  limit?: number
}) {
  const percentage = limit ? Math.min(100, Math.round((value / limit) * 100)) : 0
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {value}{limit ? ` / ${limit}` : ''}
        </span>
      </div>
      {limit && (
        <div className="mt-1 h-2 rounded-full bg-gray-100">
          <div
            className={`h-2 rounded-full ${percentage >= 100 ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showOwnerForm, setShowOwnerForm] = useState(false)

  const { data: company, isLoading, isError } = useCompanyQuery(id ?? '')
  const { data: plans, isLoading: plansLoading } = usePlansQuery()
  const { data: usage } = useCompanyUsageQuery(id ?? '')
  const activateMutation = useActivateCompanyMutation()
  const suspendMutation = useSuspendCompanyMutation()
  const assignPlanMutation = useAssignCompanyPlanMutation()
  const extendSubscriptionMutation = useExtendCompanySubscriptionMutation()
  const createOwnerMutation = useCreateOwnerMutation(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OwnerFormData>({ resolver: zodResolver(ownerSchema) })

  const planForm = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planId: '',
      startDate: '',
      endDate: '',
      isPaid: false,
    },
  })

  const extendForm = useForm<ExtendFormData>({
    resolver: zodResolver(extendSchema),
    defaultValues: { endDate: '', isPaid: false },
  })
  const resetPlanForm = planForm.reset
  const resetExtendForm = extendForm.reset

  useEffect(() => {
    if (!company) return
    resetPlanForm({
      planId: getPlanId(company.planId),
      startDate: asInputDate(company.subscription?.startDate),
      endDate: asInputDate(company.subscription?.endDate),
      isPaid: company.subscription?.isPaid ?? false,
    })
    resetExtendForm({
      endDate: asInputDate(company.subscription?.endDate),
      isPaid: company.subscription?.isPaid ?? false,
    })
  }, [company, resetExtendForm, resetPlanForm])

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

  const handleAssignPlan = async (data: PlanFormData) => {
    try {
      await assignPlanMutation.mutateAsync({
        id: id ?? '',
        body: {
          planId: data.planId,
          startDate: data.startDate,
          endDate: data.endDate,
          isPaid: data.isPaid ?? false,
        },
      })
      toast.success('ຜູກ package ກັບບໍລິສັດສຳເລັດ')
    } catch {
      toast.error('ບໍ່ສາມາດຜູກ package ໄດ້')
    }
  }

  const handleExtendSubscription = async (data: ExtendFormData) => {
    try {
      await extendSubscriptionMutation.mutateAsync({
        id: id ?? '',
        body: {
          endDate: data.endDate,
          isPaid: data.isPaid ?? false,
        },
      })
      toast.success('ຕໍ່ອາຍຸ subscription ສຳເລັດ')
    } catch {
      toast.error('ບໍ່ສາມາດຕໍ່ອາຍຸໄດ້')
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
  const currentPlanName = getPlanName(company.planId, plans)

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

      {/* Package / Subscription */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-medium text-gray-900">Package ແລະ Subscription</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <DetailRow label="Package ປັດຈຸບັນ" value={currentPlanName} />
            <DetailRow label="Subscription" value={company.subscription?.status ?? '—'} />
            <DetailRow
              label="ວັນເລີ່ມ"
              value={company.subscription?.startDate ? formatDateOnly(company.subscription.startDate) : undefined}
            />
            <DetailRow
              label="ວັນໝົດອາຍຸ"
              value={company.subscription?.endDate ? formatDateOnly(company.subscription.endDate) : undefined}
            />
            <DetailRow label="ຈ່າຍແລ້ວ" value={company.subscription?.isPaid ? 'ແມ່ນ' : 'ບໍ່'} />

            <div className="rounded-lg bg-gray-50 p-3 space-y-3">
              <UsageLine
                label="ພະນັກງານ"
                value={usage?.employees ?? 0}
                limit={usage?.limits?.maxEmployees}
              />
              <UsageLine
                label="ສາຂາ"
                value={usage?.branches ?? 0}
                limit={usage?.limits?.maxBranches}
              />
              <UsageLine
                label="Storage GB"
                value={usage?.storageUsedGB ?? 0}
                limit={usage?.limits?.maxStorageGB}
              />
            </div>
          </div>

          <div className="space-y-5">
            <form onSubmit={planForm.handleSubmit(handleAssignPlan)} className="space-y-3" noValidate>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">ເລືອກ package</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  disabled={plansLoading || assignPlanMutation.isPending}
                  {...planForm.register('planId')}
                >
                  <option value="">ເລືອກ package</option>
                  {plans?.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {plan.price.toLocaleString()} {plan.currency}
                    </option>
                  ))}
                </select>
                {planForm.formState.errors.planId?.message && (
                  <p className="text-xs text-red-600">{planForm.formState.errors.planId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="ວັນເລີ່ມ"
                  type="date"
                  error={planForm.formState.errors.startDate?.message}
                  {...planForm.register('startDate')}
                />
                <Input
                  label="ວັນໝົດອາຍຸ"
                  type="date"
                  error={planForm.formState.errors.endDate?.message}
                  {...planForm.register('endDate')}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="rounded border-gray-300" {...planForm.register('isPaid')} />
                ຈ່າຍເງິນແລ້ວ
              </label>

              <Button type="submit" loading={assignPlanMutation.isPending}>
                ບັນທຶກ package
              </Button>
            </form>

            <form onSubmit={extendForm.handleSubmit(handleExtendSubscription)} className="space-y-3 border-t border-gray-100 pt-4" noValidate>
              <Input
                label="ຕໍ່ອາຍຸເຖິງວັນທີ"
                type="date"
                error={extendForm.formState.errors.endDate?.message}
                {...extendForm.register('endDate')}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="rounded border-gray-300" {...extendForm.register('isPaid')} />
                ຈ່າຍເງິນແລ້ວ
              </label>
              <Button
                type="submit"
                variant="outline"
                loading={extendSubscriptionMutation.isPending}
                disabled={!company.planId}
              >
                ຕໍ່ອາຍຸ
              </Button>
            </form>
          </div>
        </div>
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

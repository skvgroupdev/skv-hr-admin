import { useState } from 'react'
import { Plus, Package, Check, X } from 'lucide-react'
import { usePlansQuery } from '../../../hooks/queries/usePlansQuery'
import { useDeletePlanMutation } from '../../../hooks/mutations/usePlanMutations'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PlanFormModal } from './PlanFormModal'
import type { Plan, PlanFeatures } from '../../../types/plan'

const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
  attendance: 'ການເຂົ້າວຽກ',
  shiftManagement: 'ການຈັດການກະ',
  attendanceAdjustment: 'ຄຳຂໍແກ້ເວລາ',
  leave: 'ການລາພັກພັກ',
  ot: 'OT',
  payroll: 'ເງິນເດືອນ',
  restDayCompensation: 'ຊົດເຊີຍວັນພັກ',
  advancedReport: 'ລາຍງານຂັ້ນສູງ',
  announcement: 'ປະກາດ',
}

function PlanCard({ plan, onEdit }: { plan: Plan; onEdit: (p: Plan) => void }) {
  const deleteMutation = useDeletePlanMutation()

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{plan.name}</h3>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {plan.isActive ? 'ໃຊ້ງານ' : 'ປິດ'}
            </span>
          </div>
          {plan.description && <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(plan)}>ແກ້ໄຂ</Button>
          <Button
            size="sm"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => { if (confirm('ລຶບແພັກນີ້?')) deleteMutation.mutate(plan.id) }}
          >
            ລຶບ
          </Button>
        </div>
      </div>

      <div className="text-2xl font-bold text-primary mb-3">
        {plan.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">{plan.currency}/ເດືອນ</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="font-semibold text-gray-900">{plan.maxEmployees}</p>
          <p className="text-gray-500">ພະນັກງານ</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="font-semibold text-gray-900">{plan.maxBranches}</p>
          <p className="text-gray-500">ສາຂາ</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <p className="font-semibold text-gray-900">{plan.maxStorageGB} GB</p>
          <p className="text-gray-500">Storage</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        {(Object.keys(FEATURE_LABELS) as Array<keyof PlanFeatures>).map((key) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            {plan.features[key] ? (
              <Check className="h-3 w-3 text-green-600 shrink-0" />
            ) : (
              <X className="h-3 w-3 text-gray-300 shrink-0" />
            )}
            <span className={plan.features[key] ? 'text-gray-700' : 'text-gray-400'}>{FEATURE_LABELS[key]}</span>
          </div>
        ))}
      </div>

      {plan.trialDays > 0 && (
        <p className="mt-3 text-xs text-blue-600">ທົດລອງ {plan.trialDays} ວັນ</p>
      )}
    </Card>
  )
}

export default function PlanListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>()
  const { data: plans, isLoading, isError } = usePlansQuery()

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingPlan(undefined)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ແພັກບໍລິການ</h1>
          <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {plans?.length ?? 0} ແພັກ</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          ສ້າງແພັກ
        </Button>
      </div>

      {isError && <p className="text-sm text-red-600 text-center py-8">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</p>}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />)}
        </div>
      ) : plans?.length === 0 ? (
        <EmptyState
          icon={Package}
          title="ຍັງບໍ່ມີແພັກ"
          description="ກົດ '+ ສ້າງແພັກ' ເພື່ອເພີ່ມແພັກໃໝ່"
          action={<Button onClick={handleCreate}><Plus className="h-4 w-4" />ສ້າງແພັກ</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} />)}
        </div>
      )}

      <PlanFormModal open={modalOpen} onClose={() => setModalOpen(false)} plan={editingPlan} />
    </div>
  )
}

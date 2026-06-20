import { Button } from '../../../components/ui/Button'
import {
  useGeneratePayrollMutation,
  useHrReviewPayrollMutation,
  usePayPayrollMutation,
} from '../../../hooks/mutations/usePayrollMutations'
import type { PayrollPeriodStatus } from '../../../types/payroll'
import { useAuthStore } from '../../../stores/useAuthStore'

interface PayrollPeriodActionsProps {
  periodId: string
  status: PayrollPeriodStatus
  onViewPayslips: () => void
}

export function PayrollPeriodActions({ periodId, status, onViewPayslips }: PayrollPeriodActionsProps) {
  const generateMutation = useGeneratePayrollMutation()
  const reviewMutation = useHrReviewPayrollMutation()
  const payMutation = usePayPayrollMutation()
  const role = useAuthStore((state) => state.user?.role)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {status === 'DRAFT' && (
        <Button
          size="sm"
          loading={generateMutation.isPending}
          onClick={() => {
            if (confirm('ຕ້ອງການສ້າງ payroll ສຳລັບງວດນີ້?'))
              generateMutation.mutate(periodId)
          }}
        >
          ສ້າງ Payroll
        </Button>
      )}

      {status === 'GENERATED' && role === 'HR_ADMIN' && (
        <Button
          size="sm"
          loading={reviewMutation.isPending}
          onClick={() => {
            if (confirm('ອະນຸມັດ payroll ງວດນີ້?'))
              reviewMutation.mutate(periodId)
          }}
        >
          HR ຢືນຢັນການກວດ
        </Button>
      )}

      {status === 'HR_REVIEWED' && role === 'COMPANY_OWNER' && (
        <Button
          size="sm"
          variant="outline"
          loading={payMutation.isPending}
          onClick={() => {
            if (confirm('ຢືນຢັນການຈ່າຍ payroll? ຫຼັງຈາກນີ້ຈະແກ້ໄຂບໍ່ໄດ້'))
              payMutation.mutate(periodId)
          }}
        >
          ຈ່າຍເງິນ
        </Button>
      )}

      {status !== 'DRAFT' && (
        <Button size="sm" variant="ghost" onClick={onViewPayslips}>
          ເບິ່ງລາຍລະອຽດ
        </Button>
      )}
    </div>
  )
}

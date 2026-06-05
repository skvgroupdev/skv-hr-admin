import { Button } from '../../../components/ui/Button'
import {
  useGeneratePayrollMutation,
  useApprovePayrollMutation,
  useLockPayrollMutation,
} from '../../../hooks/mutations/usePayrollMutations'
import type { PayrollPeriodStatus } from '../../../types/payroll'

interface PayrollPeriodActionsProps {
  periodId: string
  status: PayrollPeriodStatus
  onViewPayslips: () => void
}

export function PayrollPeriodActions({ periodId, status, onViewPayslips }: PayrollPeriodActionsProps) {
  const generateMutation = useGeneratePayrollMutation()
  const approveMutation = useApprovePayrollMutation()
  const lockMutation = useLockPayrollMutation()

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

      {status === 'GENERATED' && (
        <Button
          size="sm"
          loading={approveMutation.isPending}
          onClick={() => {
            if (confirm('ອະນຸມັດ payroll ງວດນີ້?'))
              approveMutation.mutate(periodId)
          }}
        >
          ອະນຸມັດ
        </Button>
      )}

      {status === 'APPROVED' && (
        <Button
          size="sm"
          variant="outline"
          loading={lockMutation.isPending}
          onClick={() => {
            if (confirm('ລັອກ payroll ງວດນີ້? ບໍ່ສາມາດແກ້ໄຂໄດ້ອີກ'))
              lockMutation.mutate(periodId)
          }}
        >
          ລັອກ
        </Button>
      )}

      {(status === 'APPROVED' || status === 'LOCKED') && (
        <Button size="sm" variant="ghost" onClick={onViewPayslips}>
          ເບິ່ງລາຍລະອຽດ
        </Button>
      )}
    </div>
  )
}

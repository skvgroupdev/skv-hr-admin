import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { usePeriodPayslipsQuery } from '../../../hooks/queries/usePayrollQuery'
import type { Payslip } from '../../../types/payroll'
import { getEmployeeName, getEmployeeIdString } from '../../../types/payroll'
import { formatNumber } from '../../../utils/currency'
import { PayslipDetailModal } from './PayslipDetailModal'

interface PayslipListModalProps {
  open: boolean
  onClose: () => void
  periodId: string
  periodName: string
}

function PayslipRow({
  payslip,
  onNavigate,
  onViewDetail,
}: {
  payslip: Payslip
  onNavigate: (id: string) => void
  onViewDetail: (payslip: Payslip) => void
}) {
  const statusLabel: Record<string, string> = {
    DRAFT: 'ຮ່າງ',
    APPROVED: 'ອະນຸມັດ',
    PAID: 'ຈ່າຍແລ້ວ',
  }
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-2.5">
        <button
          onClick={() => onNavigate(getEmployeeIdString(payslip))}
          className="text-left text-primary hover:underline"
        >
          <p className="text-sm font-medium">{getEmployeeName(payslip)}</p>
          <p className="text-xs text-gray-400">{payslip.employee?.employeeCode ?? '-'}</p>
        </button>
      </td>
      <td className="px-3 py-2.5 text-sm text-right">{formatNumber(payslip.grossSalary)}</td>
      <td className="px-3 py-2.5 text-sm text-right">{formatNumber(payslip.totalDeductions)}</td>
      <td className="px-3 py-2.5 text-sm font-medium text-right text-primary">{formatNumber(payslip.netSalary)}</td>
      <td className="px-3 py-2.5">
        <span className="text-xs text-gray-600">{statusLabel[payslip.status] ?? payslip.status}</span>
      </td>
      <td className="px-3 py-2.5 text-center">
        <button
          onClick={() => onViewDetail(payslip)}
          className="text-xs text-blue-600 hover:underline"
        >
          ເບິ່ງ
        </button>
      </td>
    </tr>
  )
}

export function PayslipListModal({ open, onClose, periodId, periodName }: PayslipListModalProps) {
  const [page, setPage] = useState(1)
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
  const navigate = useNavigate()
  const { data, isLoading, isError } = usePeriodPayslipsQuery(periodId, page, 20)

  const handleNavigateToEmployee = (employeeId: string) => {
    onClose()
    navigate(`/hr/payroll/employees/${employeeId}`)
  }

  return (
    <>
      <Modal open={open} title={`Payslips — ${periodName}`} onClose={onClose}>
        <div className="space-y-3">
          {isLoading && <p className="text-center text-sm text-gray-500 py-6">ກຳລັງໂຫລດ...</p>}
          {isError && <p className="text-center text-sm text-red-600 py-6">ເກີດຂໍ້ຜິດພາດ</p>}
          {data && (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500">
                      <th className="px-3 py-2 text-left">ພະນັກງານ</th>
                      <th className="px-3 py-2 text-right">Gross (LAK)</th>
                      <th className="px-3 py-2 text-right">ຫັກ (LAK)</th>
                      <th className="px-3 py-2 text-right">Net (LAK)</th>
                      <th className="px-3 py-2 text-left">ສະຖານະ</th>
                      <th className="px-3 py-2 text-center">ລາຍລະອຽດ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((ps) => (
                      <PayslipRow
                        key={ps.id}
                        payslip={ps}
                        onNavigate={handleNavigateToEmployee}
                        onViewDetail={setSelectedPayslip}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <p>ທັງໝົດ {data.meta.total} payslip</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>ກ່ອນ</Button>
                  <Button size="sm" variant="outline" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>ຕໍ່ໄປ</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {selectedPayslip && (
        <PayslipDetailModal
          open={true}
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </>
  )
}

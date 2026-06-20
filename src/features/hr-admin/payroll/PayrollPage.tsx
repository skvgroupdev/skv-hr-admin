import { useState } from 'react'
import { Plus, DollarSign, ListOrdered, BarChart2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { usePayrollPeriodsQuery } from '../../../hooks/queries/usePayrollQuery'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PayrollPeriodFormModal } from './PayrollPeriodFormModal'
import { PayrollStatusBadge } from './PayrollStatusBadge'
import { PayrollPeriodActions } from './PayrollPeriodActions'
import { PayslipListModal } from './PayslipListModal'
import type { PayrollPeriod } from '../../../types/payroll'
import { formatDateOnly } from '../../../utils/date'

const HEADERS = ['ຊື່ງວດ', 'ໄລຍະ', 'ສ້າງ', 'ສະຖານະ', 'ຈັດການ']

function PeriodRow({ period }: { period: PayrollPeriod }) {
  const [showPayslips, setShowPayslips] = useState(false)

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{period.name}</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {formatDateOnly(period.startDate)} – {formatDateOnly(period.endDate)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">{formatDateOnly(period.createdAt)}</td>
        <td className="px-4 py-3">
          <PayrollStatusBadge status={period.status} />
        </td>
        <td className="px-4 py-3">
          <PayrollPeriodActions
            periodId={period.id}
            status={period.status}
            onViewPayslips={() => setShowPayslips(true)}
          />
        </td>
      </tr>
      <PayslipListModal
        open={showPayslips}
        onClose={() => setShowPayslips(false)}
        periodId={period.id}
        periodName={period.name}
      />
    </>
  )
}

export default function PayrollPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { data, isLoading, isError } = usePayrollPeriodsQuery(page)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ເງິນເດືອນ</h1>
          <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data?.meta.total ?? 0} ງວດ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate('/hr/payroll/report')}>
            <BarChart2 className="h-4 w-4" />
            ລາຍງານການເງິນ
          </Button>
          <Link to="/hr/payroll/payslips">
            <Button variant="outline">
              <ListOrdered className="h-4 w-4" />
              ລາຍການຈ່າຍທັງໝົດ
            </Button>
          </Link>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            ສ້າງງວດ
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
        <strong>ຂັ້ນຕອນ:</strong> ສ້າງງວດ → ສ້າງ Payroll → HR ກວດສອບ → Company Owner ຈ່າຍເງິນ
      </div>

      <Card padding={false}>
        {isError ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-red-600">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  {HEADERS.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {HEADERS.map((h) => (
                        <td key={h} className="px-4 py-3">
                          <div className="h-4 rounded bg-gray-200 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={HEADERS.length}>
                      <EmptyState
                        icon={DollarSign}
                        title="ຍັງບໍ່ມີງວດເງິນເດືອນ"
                        description="ກົດ '+ ສ້າງງວດ' ເພື່ອເລີ່ມຕົ້ນ"
                        action={
                          <Button onClick={() => setCreateModalOpen(true)}>
                            <Plus className="h-4 w-4" />ສ້າງງວດ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data?.data.map((period) => <PeriodRow key={period.id} period={period} />)
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>ກ່ອນ</Button>
          <span className="text-sm text-gray-500">ໜ້າ {page} / {data.meta.totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>ຕໍ່ໄປ</Button>
        </div>
      )}

      <PayrollPeriodFormModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  )
}

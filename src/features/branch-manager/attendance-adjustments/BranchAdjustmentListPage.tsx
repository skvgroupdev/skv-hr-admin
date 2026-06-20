import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { useAllAdjustmentsQuery, useApproveAdjustmentMutation } from '../../../hooks/useAttendanceAdjustments'
import { RejectModal } from './RejectModal'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { formatDateOnly } from '../../../utils/date'
import type { AttendanceAdjustment, AttendanceAdjustmentStatus } from '../../../types/attendance-adjustment'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'ທຸກສະຖານະ' },
  { value: 'PENDING', label: 'ລໍຖ້າ' },
  { value: 'APPROVED', label: 'ອະນຸມັດ' },
  { value: 'REJECTED', label: 'ປະຕິເສດ' },
  { value: 'CANCELLED', label: 'ຍົກເລີກ' },
]

const STATUS_COLORS: Record<AttendanceAdjustmentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_LABELS: Record<AttendanceAdjustmentStatus, string> = {
  PENDING: 'ລໍຖ້າ',
  APPROVED: 'ອະນຸມັດ',
  REJECTED: 'ປະຕິເສດ',
  CANCELLED: 'ຍົກເລີກ',
}

const TYPE_LABELS: Record<string, string> = {
  CHECK_IN: 'ເວລາເຂົ້າ',
  CHECK_OUT: 'ເວລາອອກ',
}

function resolveEmployeeName(item: AttendanceAdjustment): string {
  if (typeof item.employeeId === 'object') {
    const emp = item.employeeId
    return `${emp.firstName} ${emp.lastName}`
  }
  return '-'
}

function StatusBadge({ status }: { status: AttendanceAdjustmentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

interface TableRowProps {
  item: AttendanceAdjustment
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isApproving: boolean
}

function TableRow({ item, onApprove, onReject, isApproving }: TableRowProps) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
      <td className="p-3 text-sm font-medium">{resolveEmployeeName(item)}</td>
      <td className="p-3 text-sm">{TYPE_LABELS[item.type] ?? item.type}</td>
      <td className="p-3 text-sm">{formatDateOnly(item.workDate)}</td>
      <td className="p-3 text-sm">
        {new Date(item.requestedCheckTime).toLocaleTimeString('lo-LA', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td className="p-3 text-sm text-gray-600 max-w-[180px]">
        <p className="truncate">{item.reason}</p>
      </td>
      <td className="p-3">
        <StatusBadge status={item.status} />
      </td>
      <td className="p-3">
        {item.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onApprove(item.id)}
              loading={isApproving}
              className="gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              ອະນຸມັດ
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onReject(item.id)}
              className="gap-1"
            >
              <X className="h-3.5 w-3.5" />
              ປະຕິເສດ
            </Button>
          </div>
        )}
      </td>
    </tr>
  )
}

export default function BranchAdjustmentListPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const { data = [], isLoading, isError } = useAllAdjustmentsQuery(statusFilter || undefined)
  const approveMutation = useApproveAdjustmentMutation()

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">ຄຳຂໍແກ້ເວລາ</h1>
        <p className="text-sm text-gray-500 mt-0.5">ອະນຸມັດ / ປະຕິເສດຄຳຂໍຂອງສາຂາ</p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2B6B]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          {isLoading ? 'ກຳລັງໂຫຼດ...' : `${data.length} ລາຍການ`}
        </span>
      </div>

      <Card padding={false}>
        {isLoading && <p className="p-6 text-sm text-gray-500">ກຳລັງໂຫຼດ...</p>}
        {isError && <p className="p-6 text-sm text-red-600">ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ</p>}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white text-left">
                  <th className="p-3">ພະນັກງານ</th>
                  <th className="p-3">ປະເພດ</th>
                  <th className="p-3">ວັນທີ</th>
                  <th className="p-3">ເວລາທີ່ຂໍ</th>
                  <th className="p-3">ເຫດຜົນ</th>
                  <th className="p-3">ສະຖານະ</th>
                  <th className="p-3">ດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-gray-400">
                      ບໍ່ມີຂໍ້ມູນ
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <TableRow
                      key={item.id}
                      item={item}
                      onApprove={(id) => approveMutation.mutate({ id })}
                      onReject={(id) => setRejectingId(id)}
                      isApproving={approveMutation.isPending}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {rejectingId && (
        <RejectModal
          adjustmentId={rejectingId}
          onClose={() => setRejectingId(null)}
        />
      )}
    </div>
  )
}

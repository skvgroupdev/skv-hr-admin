import { useState } from 'react'
import { useLeavePendingQuery } from '../../../hooks/queries/useLeavePendingQuery'
import { useLeaveReportQuery } from '../../../hooks/queries/useLeaveReportQuery'
import { useApproveLeaveM, useRejectLeaveM } from '../../../hooks/mutations/useLeaveApprovalMutations'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { cn } from '../../../lib/cn'
import { ApprovalActionModal } from './ApprovalActionModal'
import type { LeaveRequest, LeaveRequestEmployee } from '../../../types/leave'
import { formatDateOnly } from '../../../utils/date'

type TabKey = 'pending' | 'report'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: 'ລໍຖ້າອະນຸມັດ' },
  { key: 'report', label: 'ລາຍງານ' },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'ລໍຖ້າ',
  APPROVED: 'ອະນຸມັດ',
  REJECTED: 'ປະຕິເສດ',
  CANCELLED: 'ຍົກເລີກ',
}

// Mirrors OutsideWorkPage resolveEmployee pattern
function resolveEmployee(req: LeaveRequest): { name: string; phone?: string } {
  const emp = typeof req.employeeId === 'object' ? req.employeeId : req.employee
  if (!emp) return { name: typeof req.employeeId === 'string' ? req.employeeId : '-' }
  const name =
    (emp as LeaveRequestEmployee).fullName ??
    (`${(emp as LeaveRequestEmployee).firstName ?? ''} ${(emp as LeaveRequestEmployee).lastName ?? ''}`.trim() || '-')
  return { name, phone: (emp as LeaveRequestEmployee).phone }
}

function resolveLeaveTypeName(req: LeaveRequest): string {
  if (req.leaveType?.name) return req.leaveType.name
  if (typeof req.leaveTypeId === 'object' && req.leaveTypeId?.name) return req.leaveTypeId.name
  return typeof req.leaveTypeId === 'string' ? req.leaveTypeId : '-'
}

function EmployeeCell({ req }: { req: LeaveRequest }) {
  const { name, phone } = resolveEmployee(req)
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{name}</p>
      {phone && <p className="text-xs text-gray-500 mt-0.5">{phone}</p>}
    </div>
  )
}

// ---- Pending Tab ----

function PendingLeaveRow({ request }: { request: LeaveRequest }) {
  const [actionState, setActionState] = useState<{ open: boolean; action: 'approve' | 'reject' }>({
    open: false,
    action: 'approve',
  })
  const approveMutation = useApproveLeaveM()
  const rejectMutation = useRejectLeaveM()

  const handleConfirm = (comment: string) => {
    if (actionState.action === 'approve') {
      approveMutation.mutate({ id: request.id, comment }, {
        onSuccess: () => setActionState({ open: false, action: 'approve' }),
      })
    } else {
      rejectMutation.mutate({ id: request.id, reason: comment }, {
        onSuccess: () => setActionState({ open: false, action: 'reject' }),
      })
    }
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3"><EmployeeCell req={request} /></td>
        <td className="px-4 py-3 text-sm text-gray-600">{resolveLeaveTypeName(request)}</td>
        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
          {formatDateOnly(request.startDate)} – {formatDateOnly(request.endDate)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{request.totalDays} ວັນ</td>
        <td className="px-4 py-3 text-sm text-gray-500 max-w-48 truncate">{request.reason}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={() => setActionState({ open: true, action: 'approve' })}>ອະນຸມັດ</Button>
            <Button size="sm" variant="danger" onClick={() => setActionState({ open: true, action: 'reject' })}>ປະຕິເສດ</Button>
          </div>
        </td>
      </tr>
      <ApprovalActionModal
        open={actionState.open}
        action={actionState.action}
        onClose={() => setActionState((p) => ({ ...p, open: false }))}
        onConfirm={handleConfirm}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
      />
    </>
  )
}

function PendingTab() {
  const { data: pending, isLoading } = useLeavePendingQuery()
  const HEADERS = ['ພະນັກງານ', 'ປະເພດລາພັກ', 'ຊ່ວງວັນທີ', 'ຈຳນວນວັນ', 'ເຫດຜົນ', 'ການຈັດການ']

  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              {HEADERS.map((h) => <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {HEADERS.map((h) => <td key={h} className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse" /></td>)}
                </tr>
              ))
            ) : pending?.length === 0 ? (
              <tr><td colSpan={HEADERS.length} className="py-12 text-center text-sm text-gray-500">ບໍ່ມີຄຳຂໍລໍຖ້າ</td></tr>
            ) : (
              pending?.map((req) => <PendingLeaveRow key={req.id} request={req} />)
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ---- Report Tab ----

function ReportTab() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const { data, isLoading } = useLeaveReportQuery({ page, status: statusFilter || undefined })
  const HEADERS = ['ພະນັກງານ', 'ປະເພດລາພັກ', 'ຊ່ວງວັນທີ', 'ຈຳນວນວັນ', 'ເຫດຜົນ', 'ສະຖານະ']

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">ທຸກສະຖານະ</option>
          {(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                {HEADERS.map((h) => <th key={h} className="px-4 py-3 text-left text-sm font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {HEADERS.map((h) => <td key={h} className="px-4 py-3"><div className="h-4 rounded bg-gray-200 animate-pulse" /></td>)}
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr><td colSpan={HEADERS.length} className="py-12 text-center text-sm text-gray-500">ບໍ່ມີຂໍ້ມູນ</td></tr>
              ) : (
                data?.data.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><EmployeeCell req={req} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{resolveLeaveTypeName(req)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDateOnly(req.startDate)} – {formatDateOnly(req.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{req.totalDays} ວັນ</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-48 truncate">{req.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_COLORS[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.meta && (
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />
        )}
      </Card>
    </div>
  )
}

// ---- Page ----

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending')

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">ການລາພັກ</h1>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'pending' && <PendingTab />}
      {activeTab === 'report' && <ReportTab />}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useOutsideWorkPendingQuery } from '../../../hooks/queries/useOutsideWorkPendingQuery'
import { useOutsideWorkReportQuery } from '../../../hooks/queries/useOutsideWorkReportQuery'
import {
  useApproveOutsideWorkMutation,
  useRejectOutsideWorkMutation,
} from '../../../hooks/mutations/useOutsideWorkMutations'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Pagination } from '../../../components/ui/Pagination'
import { cn } from '../../../lib/cn'
import { ApprovalActionModal } from '../leave/ApprovalActionModal'
import type { OutsideWork } from '../../../types/outside-work'
import { formatDate } from '../../../utils/date'
import { toast } from '../../../components/ui/Toast'
import { useNotificationSocketContext } from '../../../context/NotificationSocketContext'

type TabKey = 'pending' | 'report'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: 'ລໍຖ້າອະນຸມັດ' },
  { key: 'report', label: 'ລາຍງານ' },
]

const TYPE_LABELS: Record<string, string> = {
  OUTSIDE_WORK: 'ອອກນອກ',
  CUSTOMER_VISIT: 'ໄປຫາລູກຄ້າ',
  DELIVERY: 'ສົ່ງຂອງ',
  WORK_FROM_HOME: 'WFH',
  BUSINESS_TRIP: 'ເດີນທາງທຸລະກິດ',
  EMERGENCY: 'ສຸກເສີນ',
  OTHER: 'ອື່ນໆ',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'ລໍຖ້າ',
  APPROVED: 'ອະນຸມັດ',
  REJECTED: 'ປະຕິເສດ',
}

function resolveEmployee(item: OutsideWork): { name: string; phone?: string } {
  const emp = typeof item.employeeId === 'object' ? item.employeeId : item.employee
  if (!emp) return { name: typeof item.employeeId === 'string' ? item.employeeId : '-' }
  const name = emp.fullName ?? (`${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim() || '-')
  return { name, phone: emp.phone }
}

function EmployeeCell({ item }: { item: OutsideWork }) {
  const { name, phone } = resolveEmployee(item)
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{name}</p>
      {phone && <p className="text-xs text-gray-500 mt-0.5">{phone}</p>}
    </div>
  )
}

function ReasonCell({ reason }: { reason: string }) {
  return (
    <div className="max-w-56 group relative cursor-default">
      <p className="text-sm text-gray-500 line-clamp-2">{reason}</p>
      {reason.length > 60 && (
        <div className="absolute z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-72 bottom-full left-0 mb-1 shadow-lg">
          {reason}
        </div>
      )}
    </div>
  )
}

function OutsideWorkRow({ item }: { item: OutsideWork }) {
  const [actionState, setActionState] = useState<{ open: boolean; action: 'approve' | 'reject' }>({
    open: false,
    action: 'approve',
  })
  const approveMutation = useApproveOutsideWorkMutation()
  const rejectMutation = useRejectOutsideWorkMutation()

  const handleConfirm = (comment: string) => {
    if (actionState.action === 'approve') {
      approveMutation.mutate({ id: item.id, comment }, {
        onSuccess: () => setActionState((p) => ({ ...p, open: false })),
      })
    } else {
      rejectMutation.mutate({ id: item.id, rejectReason: comment }, {
        onSuccess: () => setActionState((p) => ({ ...p, open: false })),
      })
    }
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3"><EmployeeCell item={item} /></td>
        <td className="px-4 py-3 text-sm text-gray-600">{TYPE_LABELS[item.outsideType] ?? item.outsideType}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{item.locationName ?? '-'}</td>
        <td className="px-4 py-3"><ReasonCell reason={item.reason} /></td>
        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
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
  const { data: pending, isLoading } = useOutsideWorkPendingQuery()
  const HEADERS = ['ພະນັກງານ', 'ປະເພດ', 'ສະຖານທີ', 'ເຫດຜົນ', 'ວັນທີ', 'ການຈັດການ']

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
              pending?.map((item) => <OutsideWorkRow key={item.id} item={item} />)
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function ReportTab() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const { data, isLoading } = useOutsideWorkReportQuery({ page, status: statusFilter || undefined })
  const HEADERS = ['ພະນັກງານ', 'ປະເພດ', 'ສະຖານທີ', 'ເຫດຜົນ', 'ສະຖານະ', 'ວັນທີ']

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">ທຸກສະຖານະ</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
              ) : data?.data.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><EmployeeCell item={item} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{TYPE_LABELS[item.outsideType] ?? item.outsideType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.locationName ?? '-'}</td>
                  <td className="px-4 py-3"><ReasonCell reason={item.reason} /></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
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

export default function OutsideWorkPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending')
  const queryClient = useQueryClient()
  const { lastNotification } = useNotificationSocketContext()
  const prevNotificationRef = useRef(lastNotification)

  useEffect(() => {
    if (
      lastNotification &&
      lastNotification !== prevNotificationRef.current &&
      lastNotification.type === 'OUTSIDE_WORK_REQUEST'
    ) {
      prevNotificationRef.current = lastNotification
      queryClient.invalidateQueries({ queryKey: ['outside-work'] })
      toast.success('ມີຄຳຮ້ອງອອກນອກສະຖານທີ່ໃໝ່')
    }
  }, [lastNotification, queryClient])

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">ການອອກວຽກນອກ</h1>

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

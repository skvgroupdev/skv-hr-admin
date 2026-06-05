import { useState } from 'react'
import { useOTPendingQuery } from '../../../hooks/queries/useOTPendingQuery'
import { useOTReportQuery } from '../../../hooks/queries/useOTReportQuery'
import { useApproveOTMutation, useRejectOTMutation } from '../../../hooks/mutations/useOTMutations'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Pagination } from '../../../components/ui/Pagination'
import { cn } from '../../../lib/cn'
import { OTPolicyCard } from './OTPolicyCard'
import { ApprovalActionModal } from '../leave/ApprovalActionModal'
import type { OTRequest } from '../../../types/ot'
import { formatDateOnly } from '../../../utils/date'

type TabKey = 'policy' | 'pending' | 'report'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'policy', label: 'ນະໂຍບາຍ OT' },
  { key: 'pending', label: 'ລໍຖ້າອນຸມັດ' },
  { key: 'report', label: 'ລາພັກຍງານ' },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'ລໍຖ້າ',
  APPROVED: 'ອນຸມັດ',
  REJECTED: 'ປະຕິເສດ',
  CANCELLED: 'ຍົກເລີກ',
}

function OTRequestRow({ request }: { request: OTRequest }) {
  const [actionState, setActionState] = useState<{ open: boolean; action: 'approve' | 'reject' }>({
    open: false,
    action: 'approve',
  })
  const approveMutation = useApproveOTMutation()
  const rejectMutation = useRejectOTMutation()

  const handleConfirm = (comment: string) => {
    if (actionState.action === 'approve') {
      approveMutation.mutate({ id: request.id, comment }, { onSuccess: () => setActionState((p) => ({ ...p, open: false })) })
    } else {
      rejectMutation.mutate({ id: request.id, reason: comment }, { onSuccess: () => setActionState((p) => ({ ...p, open: false })) })
    }
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-700">{request.employeeId}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{formatDateOnly(request.date)}</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {request.startTime} –{' '}
          {request.endTime}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{request.totalHours.toFixed(1)} ຊ.ມ</td>
        <td className="px-4 py-3 text-sm text-gray-500 max-w-40 truncate">{request.reason}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={() => setActionState({ open: true, action: 'approve' })}>ອນຸມັດ</Button>
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
  const { data: pending, isLoading } = useOTPendingQuery()
  const HEADERS = ['ພະນັກງານ', 'ວັນທີ', 'ຊ່ວງເວລາພັກ', 'ຊ.ມ OT', 'ເຫດຜົນ', 'ການຈັດການ']

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
              <tr><td colSpan={HEADERS.length} className="py-12 text-center text-sm text-gray-500">ບໍ່ມີຄຳຂໍ OT ລໍຖ້າ</td></tr>
            ) : (
              pending?.map((req) => <OTRequestRow key={req.id} request={req} />)
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
  const { data, isLoading } = useOTReportQuery({ page, status: statusFilter || undefined })
  const HEADERS = ['ພະນັກງານ', 'ວັນທີ', 'ຊ.ມ OT', 'ສະຖານະ']

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
              ) : data?.data.map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{req.employeeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDateOnly(req.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.totalHours.toFixed(1)} ຊ.ມ</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_COLORS[req.status]}`}>
                      {STATUS_LABELS[req.status]}
                    </span>
                  </td>
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

export default function OTPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('policy')

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">ໂມງລ່ວງເວລາພັກ (OT)</h1>

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

      {activeTab === 'policy' && <OTPolicyCard />}
      {activeTab === 'pending' && <PendingTab />}
      {activeTab === 'report' && <ReportTab />}
    </div>
  )
}

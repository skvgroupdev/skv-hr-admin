import { useState } from 'react'
import { Plus, Clock, Users } from 'lucide-react'
import { useShiftsQuery } from '../../../hooks/queries/useShiftsQuery'
import { useDeleteShiftMutation } from '../../../hooks/mutations/useShiftMutations'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ShiftFormModal } from './ShiftFormModal'
import { BulkAssignShiftModal } from './BulkAssignShiftModal'
import type { Shift } from '../../../types/shift'

const HEADERS = ['ຊື່ກະ', 'ເວລາພັກ', 'ພັກ', 'ວັນທຳງານ', 'ຜ່ອນຜັນ (ນາທີ)', 'ຂ້າມຄືນ', 'ສະຖານະ', 'ການຈັດການ']

const DAY_LABEL_MAP: Record<number, string> = {
  1: 'ຈ', 2: 'ອ', 3: 'ພ', 4: 'ພຫ', 5: 'ສ', 6: 'ເສ', 0: 'ອທ',
}

function formatWorkDays(workDays?: number[]): string {
  if (!workDays || workDays.length === 0) return '-'
  return workDays.map((d) => DAY_LABEL_MAP[d] ?? d).join(' ')
}

function ShiftRow({ shift, onEdit }: { shift: Shift; onEdit: (s: Shift) => void }) {
  const deleteMutation = useDeleteShiftMutation()

  const timeRange =
    shift.startTime && shift.endTime ? `${shift.startTime} – ${shift.endTime}` : '-'
  const breakRange =
    shift.breakStartTime && shift.breakEndTime
      ? `${shift.breakStartTime} – ${shift.breakEndTime}`
      : '-'

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{shift.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{timeRange}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{breakRange}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatWorkDays(shift.workDays)}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border bg-green-100 text-green-800 border-green-200">
          {shift.gracePeriodMinutes} ນາທີ
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{shift.isOvernight ? 'ແມ່ນ' : 'ບໍ່'}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            shift.isActive
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {shift.isActive ? 'ເປີດໃຊ້' : 'ປິດ'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(shift)}>ແກ້ໄຂ</Button>
          <Button
            size="sm"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (confirm('ຕ້ອງການລຶບກະນີ້ແທ້ບໍ?')) deleteMutation.mutate(shift.id)
            }}
          >
            ລຶບ
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function ShiftListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | undefined>()

  const { data: shifts, isLoading, isError } = useShiftsQuery()

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingShift(undefined)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ໂມງເຂົ້າວຽກ</h1>
          <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {shifts?.length ?? 0} ກະ</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setBulkModalOpen(true)}>
            <Users className="h-4 w-4" />
            ກຳນົດກະໝູ່
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            ສ້າງກະ
          </Button>
        </div>
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
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {HEADERS.map((h) => (
                        <td key={h} className="px-4 py-3">
                          <div className="h-4 rounded bg-gray-200 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : shifts?.length === 0 ? (
                  <tr>
                    <td colSpan={HEADERS.length}>
                      <EmptyState
                        icon={Clock}
                        title="ຍັງບໍ່ມີໂມງເຂົ້າວຽກ"
                        description="ກົດ '+ ສ້າງກະ' ເພື່ອເພີ່ມໂມງເຂົ້າວຽກໃໝ່"
                        action={
                          <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4" />
                            ສ້າງກະ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  shifts?.map((shift) => (
                    <ShiftRow key={shift.id} shift={shift} onEdit={handleEdit} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ShiftFormModal open={modalOpen} onClose={() => setModalOpen(false)} shift={editingShift} />
      <BulkAssignShiftModal open={bulkModalOpen} onClose={() => setBulkModalOpen(false)} />
    </div>
  )
}

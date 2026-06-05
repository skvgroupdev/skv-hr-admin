import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { useHolidaysQuery } from '../../../hooks/queries/useHolidaysQuery'
import { useDeleteHolidayMutation } from '../../../hooks/mutations/useHolidayMutations'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { HolidayFormModal } from './HolidayFormModal'
import type { Holiday } from '../../../types/holiday'
import { formatDateOnly } from '../../../utils/date'

const HEADERS = ['ຊື່ວັນຫຍຸດ', 'ວັນທີ', 'ປະເພດ', 'ສະຖານະ', 'ການຈັດການ']

function HolidayRow({ holiday, onEdit }: { holiday: Holiday; onEdit: (h: Holiday) => void }) {
  const deleteMutation = useDeleteHolidayMutation()

  const dateStr = formatDateOnly(holiday.date)

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{holiday.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{dateStr}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
          holiday.type === 'PUBLIC'
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : 'bg-purple-100 text-purple-800 border-purple-200'
        }`}>
          {holiday.type === 'PUBLIC' ? 'ວັນຫຍຸດລັດ' : 'ວັນຫຍຸດບໍລິສັດ'}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
          holiday.isActive
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
          {holiday.isActive ? 'ເປີດໃຊ້' : 'ປິດ'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(holiday)}>ແກ້ໄຂ</Button>
          <Button
            size="sm"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (confirm('ຕ້ອງການລຶບວັນຫຍຸດນີ້ແທ້ບໍ?')) deleteMutation.mutate(holiday.id)
            }}
          >
            ລຶບ
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function HolidayListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>()
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear())
  const [typeFilter, setTypeFilter] = useState<'PUBLIC' | 'COMPANY' | ''>('')

  const { data, isLoading, isError } = useHolidaysQuery({
    year: yearFilter,
    type: typeFilter || undefined,
  })

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingHoliday(undefined)
    setModalOpen(true)
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ວັນຫຍຸດ</h1>
          <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data?.meta?.total ?? 0} ວັນ</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'PUBLIC' | 'COMPANY' | '')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">ທຸກປະເພດ</option>
            <option value="PUBLIC">ວັນຫຍຸດລັດ</option>
            <option value="COMPANY">ວັນຫຍຸດບໍລິສັດ</option>
          </select>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            ເພີ່ມວັນຫຍຸດ
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
                        icon={CalendarDays}
                        title="ຍັງບໍ່ມີວັນຫຍຸດ"
                        description="ກົດ '+ ເພີ່ມວັນຫຍຸດ' ເພື່ອເພີ່ມວັນຫຍຸດໃໝ່"
                        action={
                          <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4" />
                            ເພີ່ມວັນຫຍຸດ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data?.data.map((holiday) => (
                    <HolidayRow key={holiday.id} holiday={holiday} onEdit={handleEdit} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <HolidayFormModal open={modalOpen} onClose={() => setModalOpen(false)} holiday={editingHoliday} />
    </div>
  )
}

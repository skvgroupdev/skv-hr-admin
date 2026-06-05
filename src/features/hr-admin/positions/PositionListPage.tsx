import { useState } from 'react'
import { Plus, Briefcase } from 'lucide-react'
import { usePositionsQuery } from '../../../hooks/queries/usePositionsQuery'
import { useDeletePositionMutation } from '../../../hooks/mutations/useDeletePositionMutation'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PositionFormModal } from './PositionFormModal'
import type { Position } from '../../../types/position'

const TABLE_HEADERS = ['ຊື່ຕໍາແໜ່ງ', 'ລະດັບ', 'ຄຳອະທິບາຍ', 'ການຈັດການ']

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {TABLE_HEADERS.map((h) => (
            <td key={h} className="px-4 py-3">
              <div className="h-4 rounded bg-gray-200 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

interface PositionRowProps {
  position: Position
  onEdit: (position: Position) => void
}

function PositionRow({ position, onEdit }: PositionRowProps) {
  const deleteMutation = useDeletePositionMutation()

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{position.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{position.level ?? '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
        {position.description ?? '-'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(position)}>
            ແກ້ໄຂ
          </Button>
          <Button
            size="sm"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (confirm('ຕ້ອງການລຶບຕໍາແໜ່ງນີ້ແທ້ບໍ?')) deleteMutation.mutate(position.id)
            }}
          >
            ລຶບ
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function PositionListPage() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | undefined>()

  const { data, isLoading, isError } = usePositionsQuery({ page, limit: 20 })

  const handleEdit = (position: Position) => {
    setEditingPosition(position)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingPosition(undefined)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ລາພັກຍການຕໍາແໜ່ງ</h1>
          {data?.meta && (
            <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data.meta.total} ຕໍາແໜ່ງ</p>
          )}
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          ສ້າງຕໍາແໜ່ງ
        </Button>
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
                  {TABLE_HEADERS.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState
                        icon={Briefcase}
                        title="ຍັງບໍ່ມີຕໍາແໜ່ງ"
                        description="ກົດ '+ ສ້າງຕໍາແໜ່ງ' ເພື່ອເພີ່ມຕໍາແໜ່ງໃໝ່"
                        action={
                          <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4" />
                            ສ້າງຕໍາແໜ່ງ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data?.data.map((pos) => (
                    <PositionRow key={pos.id} position={pos} onEdit={handleEdit} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {data?.meta && (
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            onPageChange={setPage}
          />
        )}
      </Card>

      <PositionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        position={editingPosition}
      />
    </div>
  )
}

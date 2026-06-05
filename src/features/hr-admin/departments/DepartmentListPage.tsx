import { useState } from 'react'
import { Plus, Building2 } from 'lucide-react'
import { useDepartmentsQuery } from '../../../hooks/queries/useDepartmentsQuery'
import { useDeleteDepartmentMutation } from '../../../hooks/mutations/useDeleteDepartmentMutation'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { EmptyState } from '../../../components/ui/EmptyState'
import { DepartmentFormModal } from './DepartmentFormModal'
import type { Department } from '../../../types/department'

const TABLE_HEADERS = ['ຊື່ພະແນກ', 'ຄຳອະທິບາຍ', 'ການຈັດການ']

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

interface DepartmentRowProps {
  department: Department
  onEdit: (department: Department) => void
}

function DepartmentRow({ department, onEdit }: DepartmentRowProps) {
  const deleteMutation = useDeleteDepartmentMutation()

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{department.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
        {department.description ?? '-'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(department)}>
            ແກ້ໄຂ
          </Button>
          <Button
            size="sm"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (confirm('ຕ້ອງການລຶບພະແນກນີ້ແທ້ບໍ?')) deleteMutation.mutate(department.id)
            }}
          >
            ລຶບ
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function DepartmentListPage() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>()

  const { data, isLoading, isError } = useDepartmentsQuery({ page, limit: 20 })

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingDepartment(undefined)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ລາພັກຍການພະແນກ</h1>
          {data?.meta && (
            <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data.meta.total} ພະແນກ</p>
          )}
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          ສ້າງພະແນກ
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
                    <td colSpan={3}>
                      <EmptyState
                        icon={Building2}
                        title="ຍັງບໍ່ມີພະແນກ"
                        description="ກົດ '+ ສ້າງພະແນກ' ເພື່ອເພີ່ມພະແນກໃໝ່"
                        action={
                          <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4" />
                            ສ້າງພະແນກ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data?.data.map((dept) => (
                    <DepartmentRow key={dept.id} department={dept} onEdit={handleEdit} />
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

      <DepartmentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        department={editingDepartment}
      />
    </div>
  )
}

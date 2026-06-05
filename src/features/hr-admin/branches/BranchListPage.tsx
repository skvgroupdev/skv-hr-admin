import { useState } from 'react'
import { Plus, GitBranch } from 'lucide-react'
import { useBranchesQuery } from '../../../hooks/queries/useBranchesQuery'
import { useDeactivateBranchMutation, useActivateBranchMutation } from '../../../hooks/mutations/useBranchStatusMutation'
import { useDeleteBranchMutation } from '../../../hooks/mutations/useDeleteBranchMutation'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { EmptyState } from '../../../components/ui/EmptyState'
import { BranchFormModal } from './BranchFormModal'
import type { Branch } from '../../../types/branch'

const TABLE_HEADERS = ['ຊື່ສາຂາ', 'ລະຫັດ', 'ເບີໂທ', 'ທີ່ຢູ່', 'ສະຖານະ', 'ການຈັດການ']

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

interface BranchRowProps {
  branch: Branch
  onEdit: (branch: Branch) => void
}

function BranchRow({ branch, onEdit }: BranchRowProps) {
  const deactivate = useDeactivateBranchMutation()
  const activate = useActivateBranchMutation()
  const deleteMutation = useDeleteBranchMutation()

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{branch.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{branch.code ?? '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{branch.phone ?? '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-48 truncate">{branch.address ?? '-'}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            branch.isActive
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {branch.isActive ? 'ເປີດໃຊ້' : 'ປິດ'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(branch)}>
            ແກ້ໄຂ
          </Button>
          {branch.isActive ? (
            <Button
              size="sm"
              variant="outline"
              loading={deactivate.isPending}
              onClick={() => deactivate.mutate(branch.id)}
            >
              ປິດ
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              loading={activate.isPending}
              onClick={() => activate.mutate(branch.id)}
            >
              ເປີດ
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              if (confirm('ຕ້ອງການລຶບສາຂານີ້ແທ້ບໍ?')) deleteMutation.mutate(branch.id)
            }}
          >
            ລຶບ
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function BranchListPage() {
  const [page, setPage] = useState(1)
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>()

  const { data, isLoading, isError } = useBranchesQuery({ page, limit: 20, isActive: isActiveFilter })

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingBranch(undefined)
    setModalOpen(true)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ລາພັກຍການສາຂາ</h1>
          {data?.meta && (
            <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data.meta.total} ສາຂາ</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={isActiveFilter === undefined ? '' : String(isActiveFilter)}
            onChange={(e) => {
              const val = e.target.value
              setIsActiveFilter(val === '' ? undefined : val === 'true')
              setPage(1)
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">ທັງໝົດ</option>
            <option value="true">ເປີດໃຊ້ງານ</option>
            <option value="false">ປິດໃຊ້ງານ</option>
          </select>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            ສ້າງສາຂາ
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
                    <td colSpan={6}>
                      <EmptyState
                        icon={GitBranch}
                        title="ຍັງບໍ່ມີສາຂາ"
                        description="ກົດ '+ ສ້າງສາຂາ' ເພື່ອເພີ່ມສາຂາໃໝ່"
                        action={
                          <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4" />
                            ສ້າງສາຂາ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data?.data.map((branch) => (
                    <BranchRow key={branch.id} branch={branch} onEdit={handleEdit} />
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

      <BranchFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        branch={editingBranch}
      />
    </div>
  )
}

import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEmployeesQuery } from '../../../hooks/queries/useEmployeesQuery'
import { useBranchesQuery } from '../../../hooks/queries/useBranchesQuery'
import { useDepartmentsQuery } from '../../../hooks/queries/useDepartmentsQuery'
import {
  useDeactivateEmployeeMutation,
  useReactivateEmployeeMutation,
} from '../../../hooks/mutations/useEmployeeStatusMutation'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Pagination } from '../../../components/ui/Pagination'
import { EmptyState } from '../../../components/ui/EmptyState'
import type { Employee, EmployeeStatus } from '../../../types/employee'

const TABLE_HEADERS = ['ຊື່ພະນັກງານ', 'ລະຫັດ', 'ສາຂາ', 'ພະແນກ', 'ສະຖານະ', 'ການຈັດການ']

const STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: 'ເຄື່ອນໄຫວ',
  INACTIVE: 'ບໍ່ເຄື່ອນໄຫວ',
  PROBATION: 'ທົດລອງງານ',
  RESIGNED: 'ລາພັກ',
  SUSPENDED: 'ໂຈະ',
  TERMINATED: 'ໄລ່ອອກ',
}

const STATUS_CLASSES: Record<EmployeeStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  INACTIVE: 'bg-gray-100 text-gray-600 border-gray-200',
  PROBATION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  RESIGNED: 'bg-orange-100 text-orange-800 border-orange-200',
  SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
  TERMINATED: 'bg-red-100 text-red-800 border-red-200',
}

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

interface EmployeeRowProps {
  employee: Employee
}

function EmployeeRow({ employee }: EmployeeRowProps) {
  const navigate = useNavigate()
  const deactivate = useDeactivateEmployeeMutation()
  const reactivate = useReactivateEmployeeMutation()
  const isActive = employee.status === 'ACTIVE' || employee.status === 'PROBATION'

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <button
          onClick={() => navigate(`/hr/employees/${employee.id}`)}
          className="text-sm font-medium text-primary hover:underline text-left"
        >
          {employee.firstName} {employee.lastName}
        </button>
        {(employee.nickname || employee.firstNameEn || employee.lastNameEn) && (
          <div className="text-xs text-gray-400">
            {employee.nickname ? `(${employee.nickname}) ` : ''}
            {[employee.firstNameEn, employee.lastNameEn].filter(Boolean).join(' ')}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{employee.employeeCode ?? '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{employee.branch?.name ?? '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{employee.department?.name ?? '-'}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_CLASSES[employee.status]}`}
        >
          {STATUS_LABELS[employee.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/hr/employees/${employee.id}/edit`)}
          >
            ແກ້ໄຂ
          </Button>
          {isActive ? (
            <Button
              size="sm"
              variant="outline"
              loading={deactivate.isPending}
              onClick={() => {
                if (confirm('ຕ້ອງການປິດການໃຊ້ງານພະນັກງານນີ້ແທ້ບໍ?'))
                  deactivate.mutate(employee.id)
              }}
            >
              ປິດ
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              loading={reactivate.isPending}
              onClick={() => reactivate.mutate(employee.id)}
            >
              ເປີດ
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [branchId, setBranchId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [status, setStatus] = useState<EmployeeStatus | ''>('')

  const { data, isLoading, isError } = useEmployeesQuery({
    page,
    limit: 20,
    search: search || undefined,
    branchId: branchId || undefined,
    departmentId: departmentId || undefined,
    status: (status as EmployeeStatus) || undefined,
  })
  const { data: branchData } = useBranchesQuery({ limit: 100 })
  const { data: deptData } = useDepartmentsQuery({ limit: 100 })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ລາພັກຍການພະນັກງານ</h1>
          {data?.meta && (
            <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data.meta.total} ຄົນ</p>
          )}
        </div>
        <Button onClick={() => navigate('/hr/employees/create')}>
          <Plus className="h-4 w-4" />
          ເພີ່ມພະນັກງານ
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-56">
          <Input
            placeholder="ຄົ້ນຫາຊື່, ລະຫັດ..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select
          value={branchId}
          onChange={(e) => { setBranchId(e.target.value); setPage(1) }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">ທຸກສາຂາ</option>
          {branchData?.data.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={departmentId}
          onChange={(e) => { setDepartmentId(e.target.value); setPage(1) }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">ທຸກພະແນກ</option>
          {deptData?.data.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as EmployeeStatus | ''); setPage(1) }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">ທຸກສະຖານະ</option>
          {(Object.keys(STATUS_LABELS) as EmployeeStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
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
                ) : (data?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon={Users}
                        title="ຍັງບໍ່ມີພະນັກງານ"
                        description="ກົດ '+ ເພີ່ມພະນັກງານ' ເພື່ອເພີ່ມພະນັກງານໃໝ່"
                        action={
                          <Button onClick={() => navigate('/hr/employees/create')}>
                            <Plus className="h-4 w-4" />
                            ເພີ່ມພະນັກງານ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  (data?.data ?? []).map((emp) => <EmployeeRow key={emp.id} employee={emp} />)
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
    </div>
  )
}

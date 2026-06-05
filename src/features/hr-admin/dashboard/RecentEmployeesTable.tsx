import { Link } from 'react-router-dom'
import type { RecentEmployee } from '../../../types/dashboard'

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  PROBATION: 'ທົດລອງງານ',
  INACTIVE: 'Inactive',
}

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PROBATION: 'bg-amber-100 text-amber-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
}

interface RecentEmployeesTableProps {
  employees: RecentEmployee[]
  isLoading: boolean
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  )
}

export function RecentEmployeesTable({ employees, isLoading }: RecentEmployeesTableProps) {
  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-800">ພະນັກງານທີ່ເພີ່ມລ່າສຸດ</h2>
        <Link to="/hr/employees" className="text-sm text-primary hover:underline">
          ດູທັງໝົດ
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">ຊື່</th>
              <th className="px-4 py-3">ຕໍາແໜ່ງ</th>
              <th className="px-4 py-3">ສາຂາ</th>
              <th className="px-4 py-3">ສະຖານະ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link to={`/hr/employees/${emp.id}`} className="hover:text-primary">
                        {emp.firstName} {emp.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{emp.position}</td>
                    <td className="px-4 py-3 text-gray-600">{emp.branch}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[emp.status] ?? 'bg-gray-100 text-gray-500'}`}
                      >
                        {STATUS_LABEL[emp.status] ?? emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

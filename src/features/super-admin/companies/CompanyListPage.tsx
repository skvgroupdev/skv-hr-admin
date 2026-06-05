import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Building2 } from 'lucide-react'
import { useCompaniesQuery } from '../../../hooks/queries/useCompaniesQuery'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pagination } from '../../../components/ui/Pagination'
import { EmptyState } from '../../../components/ui/EmptyState'
import { CompanyCard } from './CompanyCard'

const TABLE_HEADERS = ['ຊື່ບໍລິສັດ', 'ອີເມວ', 'ສະຖານະ', 'ວັນທີສ້າງ', 'ການຈັດການ']

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

export default function CompanyListPage() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { data, isLoading, isError } = useCompaniesQuery({ page, limit: 20 })

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ລາພັກຍການບໍລິສັດ</h1>
          {data?.meta && (
            <p className="text-sm text-gray-500 mt-0.5">ທັງໝົດ {data.meta.total} ບໍລິສັດ</p>
          )}
        </div>
        <Button onClick={() => navigate('/super/companies/create')}>
          <Plus className="h-4 w-4" />
          ສ້າງບໍລິສັດ
        </Button>
      </div>

      {/* Table */}
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
                    <td colSpan={5}>
                      <EmptyState
                        icon={Building2}
                        title="ຍັງບໍ່ມີບໍລິສັດ"
                        description="ກົດ '+ ສ້າງບໍລິສັດ' ເພື່ອເພີ່ມບໍລິສັດໃໝ່"
                        action={
                          <Button onClick={() => navigate('/super/companies/create')}>
                            <Plus className="h-4 w-4" />
                            ສ້າງບໍລິສັດ
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data?.data.map((company) => (
                    <CompanyCard key={company.id} company={company} />
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
    </div>
  )
}

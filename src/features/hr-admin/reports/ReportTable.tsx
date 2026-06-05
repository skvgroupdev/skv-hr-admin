import { Card } from '../../../components/ui/Card'

interface ReportTableProps {
  headers: string[]
  rows: React.ReactNode[]
  isLoading: boolean
  emptyMessage?: string
}

export function ReportTable({ headers, rows, isLoading, emptyMessage = 'ບໍ່ມີຂໍ້ມູນ' }: ReportTableProps) {
  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-3">
                      <div className="h-4 rounded bg-gray-200 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="py-12 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : rows}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

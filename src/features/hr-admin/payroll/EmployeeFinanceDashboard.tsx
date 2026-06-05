import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useEmployeeFinanceSummaryQuery } from '../../../hooks/queries/usePayrollQuery'
import { formatLAK, formatLAKShort, formatNumber } from '../../../utils/currency'

const LAO_MONTHS = ['ມ.ກ', 'ກ.ພ', 'ມ.ນ', 'ມ.ສ', 'ພ.ພ', 'ມິ.ຖ', 'ກ.ລ', 'ສ.ຫ', 'ກ.ຍ', 'ຕ.ລ', 'ພ.ຈ', 'ທ.ວ']

interface StatCardProps { label: string; value: string }

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}

interface BreakdownTableRowProps {
  year: number; month: number; gross: number; net: number
}

function BreakdownTableRow({ year, month, gross, net }: BreakdownTableRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-2.5 text-sm text-gray-600">{year}</td>
      <td className="px-4 py-2.5 text-sm text-gray-600">{LAO_MONTHS[month - 1]}</td>
      <td className="px-4 py-2.5 text-sm text-right">{formatNumber(gross)}</td>
      <td className="px-4 py-2.5 text-sm text-right font-medium text-primary">{formatNumber(net)}</td>
      <td className="px-4 py-2.5 text-sm text-right text-gray-500">{formatNumber(gross - net)}</td>
    </tr>
  )
}

interface EmployeeFinanceDashboardProps { employeeId: string }

export function EmployeeFinanceDashboard({ employeeId }: EmployeeFinanceDashboardProps) {
  const { data, isLoading, isError } = useEmployeeFinanceSummaryQuery(employeeId)

  if (isLoading) return <p className="py-10 text-center text-sm text-gray-500">ກຳລັງໂຫລດ...</p>
  if (isError || !data) return <p className="py-10 text-center text-sm text-red-600">ເກີດຂໍ້ຜິດພາດ</p>

  const last12 = data.monthlyBreakdown.slice(-12)
  const totalDeductions = data.totalGrossSalary - data.totalNetSalary

  const chartData = last12.map((m) => ({
    name: `${LAO_MONTHS[m.month - 1]} ${m.year}`,
    net: m.netSalary,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="ຍອດລວມ Net" value={formatLAK(data.totalNetSalary)} />
        <StatCard label="ຍອດລວມ Gross" value={formatLAK(data.totalGrossSalary)} />
        <StatCard label="ສະເລ່ຍ Net/ເດືອນ" value={formatLAK(data.averageNetSalary)} />
        <StatCard label="ຍອດລວມຫັກທັງໝົດ" value={formatLAK(totalDeductions)} />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-medium text-gray-700">ເງິນເດືອນ Net (12 ເດືອນລ່າສຸດ)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatLAKShort(v)} />
            <Tooltip formatter={(v: number) => [formatLAK(v), 'Net']} />
            <Bar dataKey="net" fill="var(--color-primary, #2563eb)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              {['ປີ', 'ເດືອນ', 'Gross (LAK)', 'Net (LAK)', 'ຫັກ (LAK)'].map((h) => (
                <th key={h} className={`px-4 py-3 text-sm font-medium ${h.includes('LAK') ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {last12.map((m) => (
              <BreakdownTableRow key={`${m.year}-${m.month}`} year={m.year} month={m.month} gross={m.grossSalary} net={m.netSalary} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import type { TaxBracket } from '../../../types/tax-config'

interface TaxBracketTableProps {
  brackets: TaxBracket[]
}

function formatAmount(n: number | null): string {
  if (n === null) return '∞'
  return n.toLocaleString()
}

export function TaxBracketTable({ brackets }: TaxBracketTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-600">
          <th className="px-3 py-2 text-left font-medium">ຈາກ (LAK)</th>
          <th className="px-3 py-2 text-left font-medium">ຮອດ (LAK)</th>
          <th className="px-3 py-2 text-left font-medium">ອັດຕາ (%)</th>
        </tr>
      </thead>
      <tbody>
        {brackets.map((b, i) => (
          <tr key={i} className="border-t border-gray-100">
            <td className="px-3 py-2 text-gray-900">{formatAmount(b.from)}</td>
            <td className="px-3 py-2 text-gray-900">{formatAmount(b.to)}</td>
            <td className="px-3 py-2 text-gray-900">{(b.rate * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

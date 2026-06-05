import type { ReportQuery } from '../../../types/report'

interface ReportFilterBarProps {
  query: ReportQuery
  onChange: (q: ReportQuery) => void
  showDateRange?: boolean
  showSingleDate?: boolean
}

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)
const MONTHS = [
  { value: '1', label: 'ມັງກອນ' }, { value: '2', label: 'ກຸມພາ' },
  { value: '3', label: 'ມີນາ' }, { value: '4', label: 'ເມສາ' },
  { value: '5', label: 'ພຶດສະພາ' }, { value: '6', label: 'ມິຖຸນາ' },
  { value: '7', label: 'ກໍລະກົດ' }, { value: '8', label: 'ສິງຫາ' },
  { value: '9', label: 'ກັນຍາ' }, { value: '10', label: 'ຕຸລາພັກ' },
  { value: '11', label: 'ພະຈິກ' }, { value: '12', label: 'ທັນວາ' },
]

export function ReportFilterBar({ query, onChange, showDateRange, showSingleDate }: ReportFilterBarProps) {
  const set = (partial: Partial<ReportQuery>) => onChange({ ...query, ...partial })

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={query.year ?? ''}
        onChange={(e) => set({ year: e.target.value })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">ເລືອກປີ</option>
        {YEARS.map((y) => <option key={y} value={String(y)}>{y}</option>)}
      </select>

      <select
        value={query.month ?? ''}
        onChange={(e) => set({ month: e.target.value })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">ເລືອກເດືອນ</option>
        {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>

      {showSingleDate && (
        <input
          type="date"
          value={query.date ?? ''}
          onChange={(e) => set({ date: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}

      {showDateRange && (
        <>
          <input
            type="date"
            value={query.startDate ?? ''}
            onChange={(e) => set({ startDate: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="date"
            value={query.endDate ?? ''}
            onChange={(e) => set({ endDate: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </>
      )}
    </div>
  )
}

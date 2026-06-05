import type { User } from '../../../types/auth'

interface ProfileInfoListProps {
  user: User
}

interface InfoRow {
  label: string
  value: string
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'ພະນັກງານປະຈຳ',
  PART_TIME: 'ພະນັກງານນອກເວລາ',
  CONTRACT: 'ສັນຍາຈ້າງ',
  INTERN: 'ນັກສຶກສາຝຶກງານ',
}

export function ProfileInfoList({ user }: ProfileInfoListProps) {
  const rows: InfoRow[] = [
    { label: 'ລະຫັດ', value: user.employeeCode ?? '-' },
    { label: 'ຕຳແໜ່ງ', value: user.position?.name ?? '-' },
    { label: 'ພະແນກ', value: user.department?.name ?? '-' },
    { label: 'ສາຂາ', value: user.branch?.name ?? '-' },
    { label: 'ປະເພດ', value: user.employmentType ? (EMPLOYMENT_TYPE_LABELS[user.employmentType] ?? user.employmentType) : '-' },
    { label: 'ໂທ', value: user.phone },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 divide-y divide-gray-100">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between py-3">
          <span className="text-xs text-gray-500">{row.label}</span>
          <span className="text-sm font-medium text-gray-800">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

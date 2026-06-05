import { useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, FileText, Clock, Receipt, Megaphone, type LucideIcon } from 'lucide-react'

interface MenuItem {
  label: string
  icon: LucideIcon
  path: string
  from: string
  to: string
  iconColor: string
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'ປະຫວັດ',  icon: CalendarDays, path: '/employee/attendance/history',    from: '#EFF6FF', to: '#DBEAFE', iconColor: '#1D4ED8' },
  { label: 'ອອກວຽກນອກ', icon: MapPin,     path: '/employee/requests/outside-work', from: '#F5F3FF', to: '#EDE9FE', iconColor: '#7C3AED' },
  { label: 'ລາພັກ',       icon: FileText,     path: '/employee/requests/leave',         from: '#ECFDF5', to: '#D1FAE5', iconColor: '#059669' },
  { label: 'OT',       icon: Clock,        path: '/employee/requests/ot',            from: '#FFFBEB', to: '#FEF3C7', iconColor: '#D97706' },
  { label: 'ການເງິນ',     icon: Receipt,      path: '/employee/payslip',                from: '#ECFEFF', to: '#CFFAFE', iconColor: '#0891B2' },
  { label: 'ປະກາດ',   icon: Megaphone,    path: '/employee/profile',                from: '#FEF2F2', to: '#FEE2E2', iconColor: '#DC2626' },
]

interface MenuCardProps {
  item: MenuItem
  onClick: () => void
}

function MenuCard({ item, onClick }: MenuCardProps) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-md active:scale-[0.97] hover:scale-[1.03] transition-all duration-200"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
      >
        <Icon className="h-6 w-6" style={{ color: item.iconColor }} />
      </div>
      <span className="text-xs font-semibold text-gray-700">{item.label}</span>
    </button>
  )
}

export function HomeMenuGrid() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-4">
      {MENU_ITEMS.map((item) => (
        <MenuCard key={item.label} item={item} onClick={() => navigate(item.path)} />
      ))}
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import { Home, Fingerprint, FileText, Receipt, User, type LucideIcon } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/employee/home',       label: 'ໜ້າຫຼັກ', icon: Home        },
  { to: '/employee/attendance', label: 'ເຂົ້າ-ອອກ', icon: Fingerprint },
  { to: '/employee/requests',   label: 'ຄຳຮ້ອງ',   icon: FileText    },
  { to: '/employee/payslip',    label: 'ການເງິນ',      icon: Receipt     },
  { to: '/employee/profile',    label: 'ໂປຣໄຟລ',   icon: User        },
]

interface NavTabProps {
  item: NavItem
  isActive: boolean
}

function NavTab({ item, isActive }: NavTabProps) {
  const Icon = item.icon
  return (
    <div className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${isActive ? 'scale-105' : ''}`}>
      <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'text-[#1A3A6B]' : 'text-gray-400'}`} />
      <span className={`text-[10px] transition-all duration-200 ${isActive ? 'text-[#1A3A6B] font-semibold' : 'text-gray-400 font-medium'}`}>
        {item.label}
      </span>
      {isActive && <span className="w-1 h-1 rounded-full bg-[#1A3A6B] mt-0.5" />}
    </div>
  )
}

export function EmployeeBottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 max-w-md mx-auto h-16 bg-white/90 backdrop-blur-lg border-t border-gray-100/80 shadow-2xl shadow-black/5 grid grid-cols-5 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className="flex items-center justify-center">
          {({ isActive }) => <NavTab item={item} isActive={isActive} />}
        </NavLink>
      ))}
    </nav>
  )
}

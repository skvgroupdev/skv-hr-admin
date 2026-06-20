import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2, Receipt, Package, ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/cn'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  disabled?: boolean
}

const superAdminNav: NavItem[] = [
  { label: 'ໜ້າຫຼັກ', icon: <LayoutDashboard className="h-5 w-5" />, to: '/super/dashboard', disabled: true },
  { label: 'ບໍລິສັດ', icon: <Building2 className="h-5 w-5" />, to: '/super/companies' },
  { label: 'ແພັກບໍລິການ', icon: <Package className="h-5 w-5" />, to: '/super/plans' },
  { label: 'ອັດຕາພາສີ', icon: <Receipt className="h-5 w-5" />, to: '/super/tax-configs' },
  { label: 'ພາສີຕໍ່ບໍລິສັດ', icon: <ShieldCheck className="h-5 w-5" />, to: '/super/company-tax-configs' },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col bg-primary text-white">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/10 px-4 py-5">
        <img src="/skv-hr-logo.png" alt="SKV HR" className="h-10 w-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {superAdminNav.map((item) => (
            <li key={item.to}>
              {item.disabled ? (
                <div
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 cursor-not-allowed select-none"
                  title="ຈະເປີດໃຊ້ໃນ Phase 2"
                >
                  {item.icon}
                  {item.label}
                  <span className="ml-auto text-xs bg-white/10 rounded px-1.5 py-0.5">ໄວໆນີ້</span>
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Brand */}
      <div className="border-t border-white/10 px-4 py-3 text-center">
        <p className="text-xs text-white/40">ສະໜອງໂດຍ SKV Group</p>
        <p className="text-[10px] text-white/25 mt-0.5">v1.0.0</p>
      </div>
    </aside>
  )
}

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, GitBranch, Building2, Briefcase, Users,
  Clock, CalendarDays, ClipboardCheck, FileText, Timer,
  MapPin, Bell, Megaphone, BarChart3, DollarSign, Receipt,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { usePendingCountsQuery } from '../../hooks/queries/usePendingCountsQuery'
import { useAuthStore } from '../../stores/useAuthStore'
import type { PlanFeatures } from '../../types/plan'

type BadgeKey = 'leave' | 'ot' | 'outsideWork'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  badgeKey?: BadgeKey
  feature?: keyof PlanFeatures
}

interface NavGroup {
  label?: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'ພາບລວມ', icon: <LayoutDashboard className="h-4 w-4" />, to: '/hr/dashboard' },
    ],
  },
  {
    label: 'ຈັດການພະນັກງານ',
    items: [
      { label: 'ພະນັກງານ', icon: <Users className="h-4 w-4" />, to: '/hr/employees' },
      { label: 'ສາຂາ', icon: <GitBranch className="h-4 w-4" />, to: '/hr/branches' },
      { label: 'ພະແນກ', icon: <Building2 className="h-4 w-4" />, to: '/hr/departments' },
      { label: 'ຕໍາແໜ່ງ', icon: <Briefcase className="h-4 w-4" />, to: '/hr/positions' },
    ],
  },
  {
    label: 'ການດຳເນີນງານ',
    items: [
      { label: 'ການເຂົ້າວຽກ', icon: <ClipboardCheck className="h-4 w-4" />, to: '/hr/attendance', feature: 'attendance' },
      { label: 'ຄຳຂໍແກ້ເວລາ', icon: <Clock className="h-4 w-4" />, to: '/hr/attendance-adjustments', feature: 'attendanceAdjustment' },
      { label: 'ການລາພັກ', icon: <FileText className="h-4 w-4" />, to: '/hr/leave', badgeKey: 'leave', feature: 'leave' },
      { label: 'OT', icon: <Timer className="h-4 w-4" />, to: '/hr/ot', badgeKey: 'ot', feature: 'ot' },
      { label: 'ອອກວຽກນອກ', icon: <MapPin className="h-4 w-4" />, to: '/hr/outside-work', badgeKey: 'outsideWork' },
    ],
  },
  {
    label: 'ການເງິນ & ລາຍງານ',
    items: [
      { label: 'ເງິນເດືອນ', icon: <DollarSign className="h-4 w-4" />, to: '/hr/payroll', feature: 'payroll' },
      { label: 'ລາຍງານ', icon: <BarChart3 className="h-4 w-4" />, to: '/hr/reports', feature: 'advancedReport' },
    ],
  },
  {
    label: 'ການສື່ສານ',
    items: [
      { label: 'ປະກາດ', icon: <Megaphone className="h-4 w-4" />, to: '/hr/announcements', feature: 'announcement' },
      { label: 'ການແຈ້ງເຕືອນ', icon: <Bell className="h-4 w-4" />, to: '/hr/notifications' },
    ],
  },
  {
    label: 'ຕັ້ງຄ່າ',
    items: [
      { label: 'ໂມງເຂົ້າວຽກ', icon: <Clock className="h-4 w-4" />, to: '/hr/shifts', feature: 'shiftManagement' },
      { label: 'ວັນຫຍຸດ', icon: <CalendarDays className="h-4 w-4" />, to: '/hr/holidays' },
      { label: 'ນະໂຍບາຍເວລາ', icon: <Clock className="h-4 w-4" />, to: '/hr/settings/work-policy', feature: 'attendance' },
      { label: 'ການຕັ້ງຄ່າພາສີ', icon: <Receipt className="h-4 w-4" />, to: '/hr/settings/tax-config' },
    ],
  },
]

interface NavItemLinkProps {
  item: NavItem
  pendingCounts: Record<BadgeKey, number> | undefined
}

function NavItemLink({ item, pendingCounts }: NavItemLinkProps) {
  const badgeCount = item.badgeKey && pendingCounts ? pendingCounts[item.badgeKey] : 0

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-white/15 text-white font-medium'
            : 'text-white/65 hover:bg-white/10 hover:text-white',
        )
      }
    >
      {item.icon}
      <span>{item.label}</span>
      {badgeCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
          {badgeCount}
        </span>
      )}
    </NavLink>
  )
}

export function HrSidebar() {
  const { data: pendingCounts } = usePendingCountsQuery()
  const features = useAuthStore((state) => state.user?.features)

  return (
    <aside className="flex h-full w-64 flex-col bg-primary text-white">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/10 px-4 py-5">
        <img src="/skv-hr-logo.png" alt="SKV HR" className="h-10 w-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35 select-none">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.filter((item) => !item.feature || features?.[item.feature]).map((item) => (
                <li key={item.to}>
                  <NavItemLink item={item} pendingCounts={pendingCounts} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Brand */}
      <div className="border-t border-white/10 px-4 py-3 text-center">
        <p className="text-xs text-white/40">ສະໜອງໂດຍ SKV Group</p>
        <p className="text-[10px] text-white/25 mt-0.5">v1.0.0</p>
      </div>
    </aside>
  )
}

import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUnreadCountQuery } from '../../hooks/queries/useEmployeeNotificationsQuery'

export function EmployeeTopBar() {
  const navigate = useNavigate()
  const { data: unread } = useUnreadCountQuery()

  const unreadCount = unread?.count ?? 0

  return (
    <header className="bg-gradient-to-r from-[#1A3A6B] to-[#0F2347] text-white px-4 h-14 flex items-center justify-between shrink-0">
      <span className="text-lg font-semibold tracking-wide">SKV HR</span>

      <button
        onClick={() => navigate('/employee/notifications')}
        className="relative p-2"
        aria-label="ການແຈ້ງເຕືອນ"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </header>
  )
}

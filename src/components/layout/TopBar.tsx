import { useEffect, useRef, useState } from 'react'
import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore, getLoginPath } from '../../stores/useAuthStore'
import { RoleBadge } from '../ui/Badge'
import { NotificationBell } from '../ui/NotificationBell'
import { toast } from '../ui/Toast'
import { useNotificationSocketContext } from '../../context/NotificationSocketContext'

export function TopBar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { lastNotification } = useNotificationSocketContext()

  // Track how many unread bumps arrived via socket (resets when dropdown opens/reads)
  const [socketUnreadBump, setSocketUnreadBump] = useState(0)
  const prevNotifRef = useRef(lastNotification)

  useEffect(() => {
    // Only act when a genuinely new payload arrives
    if (lastNotification && lastNotification !== prevNotifRef.current) {
      prevNotifRef.current = lastNotification
      setSocketUnreadBump((n) => n + 1)
      toast.success(lastNotification.message)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      // If it's a leave request, refresh HR pending list
      if (lastNotification.type === 'LEAVE_REQUEST') {
        queryClient.invalidateQueries({ queryKey: ['leave', 'pending'] })
      }
    }
  }, [lastNotification, queryClient])

  const handleLogout = () => {
    const redirectPath = getLoginPath(user?.role)
    logout()
    navigate(redirectPath, { replace: true })
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <img src="/skv-hr-logo.png" alt="SKV HR" className="h-8 w-auto" />

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <NotificationBell socketUnreadBump={socketUnreadBump} />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <RoleBadge role={user.role} />
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          ອອກຈາກລະບົບ
        </button>
      </div>
    </header>
  )
}

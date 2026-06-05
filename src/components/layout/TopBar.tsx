import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { RoleBadge } from '../ui/Badge'

export function TopBar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <img src="/skv-hr-logo.png" alt="SKV HR" className="h-8 w-auto" />

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
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

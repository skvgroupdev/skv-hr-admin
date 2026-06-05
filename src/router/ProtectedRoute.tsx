import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { authApi } from '../api/auth.api'
import type { Role, User } from '../types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const isHydrating = useAuthStore((s) => s.isHydrating)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  // Page-refresh case only: isHydrating=true means token was restored from storage
  // but user is unknown. Call /auth/me once to restore user state.
  // Fresh login sets isHydrating=false before navigate, so this effect is skipped.
  useEffect(() => {
    if (isHydrating && accessToken) {
      authApi.me()
        .then((data) => setUser(data as User))
        .catch(() => logout())
    }
  }, [isHydrating, accessToken, setUser, logout])

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  // User is being restored from token — hold render for role-gated routes to avoid flash of 403
  if (allowedRoles && !user) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="rounded-full bg-red-100 p-4">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">ທ່ານບໍ່ມີສິດເຂົ້າເຖິງ</h1>
        <p className="text-sm text-gray-500">ຫນ້ານີ້ຈຳກັດເຉພາະ {allowedRoles.join(', ')}</p>
      </div>
    )
  }

  return <>{children}</>
}

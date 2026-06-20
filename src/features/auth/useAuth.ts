import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../stores/useAuthStore'
import type { LoginRequest } from '../../types/auth'

export type LoginMode = 'staff' | 'admin'

// mutationFn ที่ wrap ให้ check mode ก่อน navigate
export const useLoginMutation = (mode: LoginMode = 'staff') => {
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await authApi.login(data)

      // admin mode: STAFF บัญชีไม่มีสิทธิ์ → reject เพื่อให้ isError = true
      if (mode === 'admin' && response.user.role === 'STAFF') {
        throw new Error('STAFF_NOT_ALLOWED')
      }

      return response
    },
    onError: () => {},
    onSuccess: (response) => {
      const role = response.user.role
      setTokens(response.accessToken, response.refreshToken, role)
      setUser(response.user)

      if (mode === 'staff') {
        // staff login → employee home เสมอ ไม่สนใจ role
        navigate('/employee/home', { replace: true })
        return
      }

      // admin mode
      if (role === 'SUPER_ADMIN') {
        navigate('/super/companies', { replace: true })
      } else {
        navigate('/hr/dashboard', { replace: true })
      }
    },
  })
}

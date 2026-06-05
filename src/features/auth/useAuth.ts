import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../stores/useAuthStore'
import type { LoginRequest } from '../../types/auth'

export const useLoginMutation = () => {
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)

      const role = response.user.role
      if (role === 'SUPER_ADMIN') {
        navigate('/super/companies', { replace: true })
      } else if (['STAFF', 'SUPERVISOR', 'BRANCH_MANAGER'].includes(role)) {
        navigate('/employee/home', { replace: true })
      } else {
        navigate('/hr/dashboard', { replace: true })
      }
    },
  })
}

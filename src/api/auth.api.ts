import { apiClient } from './client'
import type { LoginRequest, AuthResponse } from '../types/auth'

const unwrap = <T>(res: { data: { data: T } | T }) => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const authApi = {
  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<{ data: AuthResponse } | AuthResponse>('/auth/login', body)
    return unwrap<AuthResponse>(res)
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await apiClient.post<{ data: AuthResponse } | AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return unwrap<AuthResponse>(res)
  },

  me: async () => {
    const res = await apiClient.get('/auth/me')
    return unwrap(res)
  },
}

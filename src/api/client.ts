import axios from 'axios'
import { useAuthStore, getLoginPath } from '../stores/useAuthStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 → refresh → retry once
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

const processQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = useAuthStore.getState().getRefreshToken()
    if (!refreshToken) {
      const role = useAuthStore.getState().user?.role
      useAuthStore.getState().logout()
      window.location.href = getLoginPath(role)
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
      const { accessToken, refreshToken: newRefreshToken } = data.data ?? data

      useAuthStore.getState().setTokens(accessToken, newRefreshToken)
      processQueue(accessToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch {
      const role = useAuthStore.getState().user?.role
      useAuthStore.getState().logout()
      window.location.href = getLoginPath(role)
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

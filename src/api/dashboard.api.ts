import { apiClient } from './client'
import type { DashboardData } from '../types/dashboard'

const unwrapDashboard = (res: { data: unknown }): DashboardData => {
  const payload = res.data as { data: DashboardData }
  return payload.data
}

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const res = await apiClient.get('/dashboard')
    return unwrapDashboard(res)
  },
}

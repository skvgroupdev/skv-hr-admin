import { apiClient } from './client'
import type { DashboardData, TodayOverview } from '../types/dashboard'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data: T }
  return payload.data
}

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const res = await apiClient.get('/dashboard')
    return unwrap<DashboardData>(res)
  },

  getTodayOverview: async (): Promise<TodayOverview> => {
    const res = await apiClient.get('/dashboard/today-overview')
    return unwrap<TodayOverview>(res)
  },
}

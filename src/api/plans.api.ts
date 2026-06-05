import { apiClient } from './client'
import type { Plan, CreatePlanDto } from '../types/plan'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const plansApi = {
  list: async (): Promise<Plan[]> => {
    const res = await apiClient.get('/plans')
    return unwrap<Plan[]>(res)
  },

  getById: async (id: string): Promise<Plan> => {
    const res = await apiClient.get(`/plans/${id}`)
    return unwrap<Plan>(res)
  },

  create: async (body: CreatePlanDto): Promise<Plan> => {
    const res = await apiClient.post('/plans', body)
    return unwrap<Plan>(res)
  },

  update: async (id: string, body: Partial<CreatePlanDto>): Promise<Plan> => {
    const res = await apiClient.patch(`/plans/${id}`, body)
    return unwrap<Plan>(res)
  },

  softDelete: async (id: string): Promise<Plan> => {
    const res = await apiClient.delete(`/plans/${id}`)
    return unwrap<Plan>(res)
  },
}

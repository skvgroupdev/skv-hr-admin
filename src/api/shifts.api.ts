import { apiClient } from './client'
import type { Shift, CreateShiftDto, UpdateShiftDto } from '../types/shift'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const shiftsApi = {
  list: async (): Promise<Shift[]> => {
    const res = await apiClient.get('/shifts')
    return unwrap<Shift[]>(res)
  },

  getById: async (id: string): Promise<Shift> => {
    const res = await apiClient.get(`/shifts/${id}`)
    return unwrap<Shift>(res)
  },

  create: async (body: CreateShiftDto): Promise<Shift> => {
    const res = await apiClient.post('/shifts', body)
    return unwrap<Shift>(res)
  },

  update: async (id: string, body: UpdateShiftDto): Promise<Shift> => {
    const res = await apiClient.patch(`/shifts/${id}`, body)
    return unwrap<Shift>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/shifts/${id}`)
  },
}

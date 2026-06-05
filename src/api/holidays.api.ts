import { apiClient } from './client'
import type { Holiday, CreateHolidayDto, UpdateHolidayDto } from '../types/holiday'
import type { PaginatedResponse } from '../types/company'

interface HolidayQuery {
  page?: number
  limit?: number
  year?: number
  type?: 'PUBLIC' | 'COMPANY'
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const holidaysApi = {
  list: async (params: HolidayQuery = {}): Promise<PaginatedResponse<Holiday>> => {
    const res = await apiClient.get('/holidays', {
      params: { page: 1, limit: 50, ...params },
    })
    return res.data as PaginatedResponse<Holiday>
  },

  create: async (body: CreateHolidayDto): Promise<Holiday> => {
    const res = await apiClient.post('/holidays', body)
    return unwrap<Holiday>(res)
  },

  update: async (id: string, body: UpdateHolidayDto): Promise<Holiday> => {
    const res = await apiClient.patch(`/holidays/${id}`, body)
    return unwrap<Holiday>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/holidays/${id}`)
  },
}

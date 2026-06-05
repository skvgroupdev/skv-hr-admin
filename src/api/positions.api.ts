import { apiClient } from './client'
import type { Position, CreatePositionDto, UpdatePositionDto } from '../types/position'
import type { PaginatedResponse } from '../types/company'

interface ListParams {
  page?: number
  limit?: number
  sort?: string
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const positionsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Position>> => {
    const res = await apiClient.get('/positions', {
      params: { page: 1, limit: 20, sort: '-createdAt', ...params },
    })
    return res.data as PaginatedResponse<Position>
  },

  getById: async (id: string): Promise<Position> => {
    const res = await apiClient.get(`/positions/${id}`)
    return unwrap<Position>(res)
  },

  create: async (body: CreatePositionDto): Promise<Position> => {
    const res = await apiClient.post('/positions', body)
    return unwrap<Position>(res)
  },

  update: async (id: string, body: UpdatePositionDto): Promise<Position> => {
    const res = await apiClient.patch(`/positions/${id}`, body)
    return unwrap<Position>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/positions/${id}`)
  },
}

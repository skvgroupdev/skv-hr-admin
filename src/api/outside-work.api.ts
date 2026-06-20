import { apiClient } from './client'
import type { OutsideWork, CreateOutsideWorkDto } from '../types/outside-work'
import type { PaginatedResponse } from '../types/company'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

interface OutsideWorkQuery {
  page?: number
  limit?: number
  status?: string
}

export const outsideWorkApi = {
  getPending: async (): Promise<OutsideWork[]> => {
    const res = await apiClient.get('/outside-work/pending')
    return unwrap<OutsideWork[]>(res)
  },

  getReport: async (query: OutsideWorkQuery): Promise<PaginatedResponse<OutsideWork>> => {
    const res = await apiClient.get('/outside-work/report', { params: query })
    return res.data as PaginatedResponse<OutsideWork>
  },

  createRequest: async (body: CreateOutsideWorkDto): Promise<OutsideWork> => {
    const res = await apiClient.post('/outside-work/request', body)
    return unwrap<OutsideWork>(res)
  },

  approve: async (id: string, comment?: string): Promise<OutsideWork> => {
    const res = await apiClient.post(`/outside-work/${id}/approve`, { comment })
    return unwrap<OutsideWork>(res)
  },

  reject: async (id: string, rejectReason: string): Promise<OutsideWork> => {
    const res = await apiClient.post(`/outside-work/${id}/reject`, { reason: rejectReason })
    return unwrap<OutsideWork>(res)
  },
}

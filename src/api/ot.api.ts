import { apiClient } from './client'
import type { OTPolicy, OTRequest, CreateOTRequestDto, UpdateOTPolicyDto } from '../types/ot'
import type { PaginatedResponse } from '../types/company'

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

interface OTQuery {
  page?: number
  limit?: number
  status?: string
  year?: number
  month?: number
}

export const otApi = {
  getPolicy: async (): Promise<OTPolicy> => {
    const res = await apiClient.get('/ot/policy')
    return unwrap<OTPolicy>(res)
  },

  updatePolicy: async (body: UpdateOTPolicyDto): Promise<OTPolicy> => {
    const res = await apiClient.patch('/ot/policy', body)
    return unwrap<OTPolicy>(res)
  },

  getPending: async (): Promise<OTRequest[]> => {
    const res = await apiClient.get('/ot/pending')
    return unwrap<OTRequest[]>(res)
  },

  getReport: async (query: OTQuery): Promise<PaginatedResponse<OTRequest>> => {
    const res = await apiClient.get('/ot/report', { params: query })
    return res.data as PaginatedResponse<OTRequest>
  },

  createRequest: async (body: CreateOTRequestDto): Promise<OTRequest> => {
    const res = await apiClient.post('/ot/request', body)
    return unwrap<OTRequest>(res)
  },

  approve: async (id: string, comment?: string): Promise<OTRequest> => {
    const res = await apiClient.post(`/ot/${id}/approve`, { comment })
    return unwrap<OTRequest>(res)
  },

  reject: async (id: string, reason: string): Promise<OTRequest> => {
    const res = await apiClient.post(`/ot/${id}/reject`, { reason })
    return unwrap<OTRequest>(res)
  },

  cancel: async (id: string): Promise<OTRequest> => {
    const res = await apiClient.post(`/ot/${id}/cancel`)
    return unwrap<OTRequest>(res)
  },
}

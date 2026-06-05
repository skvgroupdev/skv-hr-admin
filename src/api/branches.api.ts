import { apiClient } from './client'
import type { Branch, CreateBranchDto, UpdateBranchDto } from '../types/branch'
import type { PaginatedResponse } from '../types/company'

interface ListParams {
  page?: number
  limit?: number
  sort?: string
  isActive?: boolean
}

const unwrap = <T>(res: { data: unknown }): T => {
  const payload = res.data as { data?: T } & T
  return (payload.data ?? payload) as T
}

export const branchesApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Branch>> => {
    const res = await apiClient.get('/branches', {
      params: { page: 1, limit: 20, sort: '-createdAt', ...params },
    })
    return res.data as PaginatedResponse<Branch>
  },

  getById: async (id: string): Promise<Branch> => {
    const res = await apiClient.get(`/branches/${id}`)
    return unwrap<Branch>(res)
  },

  create: async (body: CreateBranchDto): Promise<Branch> => {
    const res = await apiClient.post('/branches', body)
    return unwrap<Branch>(res)
  },

  update: async (id: string, body: UpdateBranchDto): Promise<Branch> => {
    const res = await apiClient.patch(`/branches/${id}`, body)
    return unwrap<Branch>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/branches/${id}`)
  },

  activate: async (id: string): Promise<Branch> => {
    const res = await apiClient.post(`/branches/${id}/activate`)
    return unwrap<Branch>(res)
  },

  deactivate: async (id: string): Promise<Branch> => {
    const res = await apiClient.post(`/branches/${id}/deactivate`)
    return unwrap<Branch>(res)
  },
}

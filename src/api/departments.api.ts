import { apiClient } from './client'
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department'
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

export const departmentsApi = {
  list: async (params: ListParams = {}): Promise<PaginatedResponse<Department>> => {
    const res = await apiClient.get('/departments', {
      params: { page: 1, limit: 20, sort: '-createdAt', ...params },
    })
    return res.data as PaginatedResponse<Department>
  },

  getById: async (id: string): Promise<Department> => {
    const res = await apiClient.get(`/departments/${id}`)
    return unwrap<Department>(res)
  },

  create: async (body: CreateDepartmentDto): Promise<Department> => {
    const res = await apiClient.post('/departments', body)
    return unwrap<Department>(res)
  },

  update: async (id: string, body: UpdateDepartmentDto): Promise<Department> => {
    const res = await apiClient.patch(`/departments/${id}`, body)
    return unwrap<Department>(res)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`)
  },
}
